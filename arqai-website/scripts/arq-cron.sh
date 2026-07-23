#!/usr/bin/env bash
#
# ArqAI cron trigger (for VPS / non-Vercel deployments).
#
# Calls one of the app's cron endpoints with the CRON_SECRET bearer token.
# The secret is read from an env file (default /etc/arq/cron.env) and passed to
# curl via a stdin config, so it never appears in `crontab -l` or `ps` output.
#
# Usage:  arq-cron.sh /api/cron/agent-runs
#         arq-cron.sh /api/cron/recalculate-scores
#
# Env file (chmod 600, owned by the cron user) should contain:
#         CRON_SECRET=your-secret-here
#         # optional override:
#         ARQ_BASE_URL=https://thearq.ai

set -euo pipefail

ENV_FILE="${ARQ_ENV_FILE:-/etc/arq/cron.env}"
if [ -f "$ENV_FILE" ]; then
  # shellcheck disable=SC1090
  set -a; . "$ENV_FILE"; set +a
fi

BASE_URL="${ARQ_BASE_URL:-https://thearq.ai}"
ENDPOINT="${1:?usage: arq-cron.sh <endpoint-path>}"

if [ -z "${CRON_SECRET:-}" ]; then
  echo "$(date -u +%FT%TZ) [arq-cron] CRON_SECRET not set (checked $ENV_FILE and environment)" >&2
  exit 1
fi

# --max-time is generous because the agent sweep runs several LLM calls in
# sequence. Even if curl gives up waiting, the server keeps processing the
# request, so the work still completes.
status=$(
  curl -sS -o /dev/null -w '%{http_code}' --max-time 600 \
    --config - "${BASE_URL}${ENDPOINT}" <<EOF
header = "Authorization: Bearer ${CRON_SECRET}"
EOF
)

echo "$(date -u +%FT%TZ) [arq-cron] ${ENDPOINT} -> HTTP ${status}"

# Non-2xx is a real failure (bad secret, app down); surface it to cron.
case "$status" in
  2*) exit 0 ;;
  *)  echo "$(date -u +%FT%TZ) [arq-cron] ${ENDPOINT} failed with HTTP ${status}" >&2; exit 1 ;;
esac
