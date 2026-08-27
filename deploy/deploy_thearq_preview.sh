#!/usr/bin/env bash
#
# Manual deploy for preview.thearq.ai, keeping the command people already
# type:
#
#   sudo /home/arqadmin/arq-website/deploy_thearq_preview.sh <branch-name>
#
# Identical to deploy_thearq_prod.sh apart from which service it names. Both
# go through /usr/local/bin/aci-deploy, so a deploy run by hand and a deploy
# run by the hook execute the same code, and both inherit what a hand-rolled
# script tends not to have: a guard that refuses to run over uncommitted
# changes, a rollback when the build fails or the site does not come back
# healthy, a lock so two deploys cannot share a checkout, and a health check
# against the loopback port rather than the public URL.
#
# Usage: deploy_thearq_preview.sh <ref>

set -Eeuo pipefail

# The launcher defaults to deploy/aci-deploy.sh, which is the ACI repo's
# name for it. This repo calls it deploy/deploy.sh.
SCRIPT_PATH="${ACI_DEPLOY_SCRIPT_PATH:-deploy/deploy.sh}"
DEPLOY_USER="${ARQ_DEPLOY_USER:-arqadmin}"
SERVICE="${ACI_SERVICE:-arqai-preview.service}"
# The public name, verified after the loopback port for the build id this
# deploy produced. Override to deploy a site that answers on another name.
PUBLIC_URL="${ACI_PUBLIC_URL:-https://preview.thearq.ai/}"

# git as the account that owns the checkout. These scripts are run with
# sudo, so a bare `git` here executes as root against a checkout owned by
# someone else, and git refuses it as "dubious ownership" - which the
# `|| echo unknown` below then hides, reporting nothing useful. Do not add
# safe.directory for root to work around it: root git operations leave
# root-owned objects in .git, and the next deploy, which runs unprivileged,
# then cannot write the index.
dgit() {
  if [ "$(id -un)" = "$DEPLOY_USER" ]; then
    git "$@"
  else
    sudo -u "$DEPLOY_USER" git "$@"
  fi
}

REF="${1:-}"
if [ -z "$REF" ]; then
  echo "usage: deploy_thearq_preview.sh <ref>" >&2
  echo >&2
  # No default, and specifically not the checked-out branch. The deploy
  # advances the checkout with `git reset --hard <sha>`, which moves the
  # local branch pointer without touching the remote, so the name this
  # checkout sits on is not evidence of what is deployed.
  APP_DIR=$(systemctl show "$SERVICE" -p WorkingDirectory --value 2>/dev/null || true)
  if [ -n "$APP_DIR" ] && [ -d "$APP_DIR" ]; then
    echo "this checkout is currently:" >&2
    echo "  branch:   $(dgit -C "$APP_DIR" rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)" >&2
    echo "  upstream: $(dgit -C "$APP_DIR" rev-parse --abbrev-ref '@{upstream}' 2>/dev/null || echo none)" >&2
    echo "  commit:   $(dgit -C "$APP_DIR" log -1 --oneline 2>/dev/null || echo unknown)" >&2
    echo >&2
    echo "the branch name above is where the local pointer sits, which is not" >&2
    echo "necessarily what is deployed - pass the ref you actually want." >&2
  fi
  exit 2
fi

# The deploy has to run as the account that owns the checkout. Running it as
# root leaves root-owned objects in .git, and the next deploy - which does
# run as arqadmin - then cannot write the index.
#
# NOTE: /opt/arqapi must be owned by arqadmin for this to work. It is not
# today, because arqai-preview.service runs as root. See README.md.
if [ "$(id -un)" = "$DEPLOY_USER" ]; then
  exec env ACI_SERVICE="$SERVICE" ACI_PUBLIC_URL="$PUBLIC_URL" ACI_DEPLOY_SCRIPT_PATH="$SCRIPT_PATH" /usr/local/bin/aci-deploy "$REF"
fi

exec sudo -u "$DEPLOY_USER" env ACI_SERVICE="$SERVICE" ACI_PUBLIC_URL="$PUBLIC_URL" ACI_DEPLOY_SCRIPT_PATH="$SCRIPT_PATH" /usr/local/bin/aci-deploy "$REF"
