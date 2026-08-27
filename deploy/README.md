# Deploy hooks for thearq.ai and preview.thearq.ai

Lets a development agent deploy either site over HTTPS, without SSH.

## Why HTTPS and not SSH

The sandbox the agent runs in has no route to port 22 — direct connections
time out and the egress proxy opens CONNECT tunnels only to 443. 443 reaches
the box, so the trigger arrives over HTTPS instead.

## Shape

One hook instance per site. Separate port, separate token file, separate
systemd unit, separate sudoers rule. A token for one site cannot deploy
another, which is what makes standing preview access a much smaller decision
than standing production access.

| | thearq.ai | preview.thearq.ai |
|---|---|---|
| Hook unit | `arq-live-hook.service` | `arq-preview-hook.service` |
| Hook port | 9097 | 9096 |
| Token file | `/etc/arq-live-deploy.env` | `/etc/arq-preview-deploy.env` |
| App service | `thearq-live.service` | `arqai-preview.service` |
| Health port | 3003 | 3001 |
| Checkout | `/home/arqadmin/arq-website/arqai-website` | `/opt/arqapi` |
| What routes the public name | `nextjs-upstream.conf` (nginx) | `preview.thearq.ai.conf` (nginx) |

Ports 9099 and 9098 belong to the ACI hooks on the same box. Do not reuse
them.

## What is installed, and what is not

`deploy.sh` is **not** installed. `/usr/local/bin/aci-deploy` is a launcher —
shared with the ACI sites — that fetches the requested ref, reads
`deploy/deploy.sh` out of *that ref*, syntax-checks it, and runs it from a
temp file. The deploy logic ships with the code it deploys, so fixing this
file takes effect on the next deploy with no reinstall step.

The temp file matters: the deploy resets the checkout to the target commit,
and bash reads a script incrementally as it runs. Replacing the file under a
running shell makes it execute whatever bytes now sit at the offset it had
reached.

The `ACI_` variable prefix is not a copy-paste slip. The launcher is shared
across every site on this box and reads those names; renaming them here
would require a second launcher, which is exactly what that arrangement
avoids.

## Environment

Neither site uses `ACI_ENV_SRC`. Both keep their environment in `.env.local`
inside the app directory, which is gitignored and therefore survives
`git reset --hard` untouched — there is no authoritative copy elsewhere to
install from, and nothing to drift out of step with.

That differs from the ACI production site, which keeps its real env outside
the repo and installs it on every deploy. If a copy outside the repo ever
becomes the source of truth here, set `ACI_ENV_SRC` in the unit and the
script will install it after each reset.

## Before installing the preview hook

`arqai-preview.service` currently runs with **no `User=`, which means root**,
and binds `PORT=3001` on every interface rather than loopback. Every other
Next app on this box runs unprivileged on `127.0.0.1`.

The hook deliberately does not inherit that. It runs as `arqadmin` and
escalates only to one `systemctl restart` through sudoers. For that to work,
the checkout must belong to `arqadmin`:

```sh
chown -R arqadmin:arqadmin /opt/arqapi
```

The same change is worth making to `arqai-preview.service` itself — there is
no reason for a public Next.js process to run as root. Add to its unit:

```
User=arqadmin
Group=arqadmin
```

That part is done and holds: the service runs as `arqadmin` and serves
normally.

Both are now done. The bind was narrowed on 2026-08-27 with the drop-in in
`arqai-preview-loopback.conf`, which also records the unit it overrides;
`ss -lntp` reports `127.0.0.1:3001`. The rest of this section is kept for
why the obvious fix does not work.

**`Environment=HOSTNAME=127.0.0.1` does not narrow the bind — do not use
it.** It was tried on this unit and `ss -lntp` still reported `*:3001`.
`HOSTNAME` is read by the server that `output: 'standalone'` generates;
this app runs `next start` (its `start` script is a bare `next start`),
which takes `-H/--hostname` and otherwise defaults to `0.0.0.0` whatever
the variable says. Pass the flag through npm in the unit instead:

```
ExecStart=/usr/bin/npm start -- -H 127.0.0.1 -p 3001
```

Verify afterwards with `ss -lntp | grep 3001`; it should show
`127.0.0.1:3001` rather than `*:3001`. Do not put the flag in the `start`
script in `package.json` — thearq.ai builds from this same repo and would
inherit it.

## Install

As root on the VPS. See the repo root's install notes for the shared
launcher, which only needs installing once for the whole box.

```sh
# Per-site sudoers: exactly one unit each, nothing wider
cat > /etc/sudoers.d/arq-deploy <<'SUDO'
arqadmin ALL=(root) NOPASSWD: /usr/bin/systemctl restart thearq-live.service, /usr/bin/systemctl status thearq-live.service
arqadmin ALL=(root) NOPASSWD: /usr/bin/systemctl restart arqai-preview.service, /usr/bin/systemctl status arqai-preview.service
SUDO
chmod 440 /etc/sudoers.d/arq-deploy
visudo -c
```

Then the units, a token each, and the nginx location per vhost. The token is
generated on the box and never typed by hand.

## Security shape

An authenticated remote-execution endpoint, narrow on purpose:

- Binds `127.0.0.1` only; nothing reaches it except through nginx.
- Bearer token compared with `hmac.compare_digest`, so it cannot be guessed a
  byte at a time by timing the response.
- The only input is a git ref, matched against `^[A-Za-z0-9._/-]{1,255}$` in
  the launcher and again in the deploy script. It never reaches a shell.
- Runs as `arqadmin`, not root. The single privileged action is one
  `systemctl restart` on one named unit.
- One deploy at a time (`flock` plus an in-process lock); concurrent requests
  get 409 rather than two builds in one checkout.
- A failed build or an unhealthy service rolls the checkout back to the
  previous commit and restarts.

Rotate a token by editing its file and restarting that hook unit, which
revokes the old one immediately.

## Troubleshooting

### A deploy succeeds and the site does not change

This happened on thearq.ai and cost an afternoon, so the shape is worth
knowing. Every layer reported success: the hook returned 200, the launcher
fetched the ref, `git reset --hard` landed the right commit, `next build`
regenerated every route, the service restarted, and the health check came
back `http=200 service=active`. The public site kept serving the previous
build regardless.

The cause was one line in the cPanel per-domain include dir:

```
/etc/nginx/conf.d/users/arqadmin/thearq.ai/nextjs-upstream.conf
set $CPANEL_APACHE_PROXY_PASS http://127.0.0.1:3001;
```

3001 is preview. thearq.ai had been serving the preview app, while
`thearq-live.service` on 3003 accepted deploys nobody could see. See
`nginx-live-upstream.conf` for the corrected file.

The health check cannot catch this. It probes `127.0.0.1:3003` directly, so
it proves the app it just restarted is alive - not that anything routes to
it. A check through the public name would have failed loudly on the first
deploy instead of silently succeeding for months.

Two dead ends to skip if the symptom reappears, both of which look
convincing:

- **The cache.** `x-nextjs-cache: HIT` and a long `s-maxage` make a stale
  proxy the obvious suspect. Purging `/var/cache/ea-nginx/proxy/<site>/`
  and reloading nginx changes nothing, because the bytes are not cached -
  they are live from a different app.
- **Apache.** This domain has a full, correct Apache proxy config pointing
  at 3003. It is not in the request path. Editing it, running
  `/scripts/rebuildhttpdconf`, and restarting httpd all appear to work and
  move nothing.

Identify it in one step instead. Compare what the public name serves
against each local port:

```sh
curl -s https://thearq.ai/about | md5sum
for p in 3001 3003; do printf '%s ' "$p"; curl -s "http://127.0.0.1:$p/about" | md5sum; done
```

Whichever port matches the public hash is what is actually serving. If it
is not the port the deploy restarted, the routing is the bug and no further
deploy will fix it. To confirm the layer before changing anything, send a
tagged request and look for it in each server's log:

```sh
P=probe$RANDOM
curl -s -o /dev/null "https://thearq.ai/about?$P=1"
sudo grep -rl "$P" /etc/apache2/logs/domlogs/   # silent = Apache never saw it
sudo grep -rl "$P" /var/log/nginx/
```

Note that `grep ... | tail || echo "not found"` does not work here: the
`||` tests the exit status of the pipeline, which is `tail`'s, and `tail`
succeeds whether or not grep matched. Use `grep -rl` and read the output.

### `Host key verification failed` on the launcher's fetch

The first preview deploy came back as:

```
"stdout": "== launcher: fetching claude/arq-deploy-hooks ==\n",
"stderr": "Host key verification failed.\nfatal: Could not read from remote repository."
```

Nothing was touched — the run stopped on the very first fetch, before any
reset, build, or restart, and the site kept serving throughout.

This is the cost of the ownership change, and it is worth naming plainly:
the fetch used to run as root, because `arqai-preview.service` and every
manual deploy before it ran as root. It now runs as `arqadmin`, and
`arqadmin`'s SSH state is not root's. The message is about the *host* key,
not the account key: ssh could not confirm github.com's identity, so it
stopped before authentication was ever attempted.

Two shapes it can take, and they need telling apart before fixing:

```sh
sudo -u arqadmin git -C /home/arqadmin/arq-website/arqai-website remote get-url origin
sudo -u arqadmin git -C /opt/arqapi remote get-url origin
```

- **The live checkout uses HTTPS and preview uses SSH.** That is the likely
  one: the live deploy runs as the same user and fetches fine. Point preview
  at the same URL live uses and the problem is gone, with no key material
  involved:
  `sudo -u arqadmin git -C /opt/arqapi remote set-url origin <the live URL>`

- **Both use SSH.** Then `arqadmin` needs github.com in its `known_hosts`.
  Do not blind-append `ssh-keyscan` output; that trusts whatever answers on
  the day. Take the fingerprints from GitHub's own published list
  (https://docs.github.com/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints)
  and check them against what the scan returned:

  ```sh
  sudo -u arqadmin bash -c 'ssh-keyscan -t ed25519 github.com > /tmp/gh.keys'
  ssh-keygen -lf /tmp/gh.keys          # compare with the published fingerprint
  sudo -u arqadmin bash -c 'mkdir -p ~/.ssh && chmod 700 ~/.ssh &&
    cat /tmp/gh.keys >> ~/.ssh/known_hosts && chmod 600 ~/.ssh/known_hosts'
  ```

  If the fetch then fails with `Permission denied (publickey)` instead, the
  host key is settled and it is the account key that is missing — that is a
  separate decision about which key `arqadmin` should hold, not something to
  fix by copying root's.
