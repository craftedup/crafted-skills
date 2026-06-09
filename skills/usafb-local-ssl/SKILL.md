---
name: usafb-local-ssl
description: Local SSL setup for usafb-public-ui development. Use when starting the local SSL proxy, troubleshooting HTTPS for local.usafootball.com, or configuring mkcert certificates for this project.
---

# USA Football Local SSL Setup

Run the app over HTTPS at `https://local.usafootball.com:3001` using a local SSL proxy in front of the Next.js dev server on port 3000.

## Prerequisites

### 1. Hosts file — map `local.usafootball.com` to localhost
`/etc/hosts` must resolve `local.usafootball.com` to `127.0.0.1`. Add it idempotently:
```bash
grep -q 'local.usafootball.com' /etc/hosts || echo '127.0.0.1 local.usafootball.com' | sudo tee -a /etc/hosts
```

### 2. mkcert certificates
Certs live in `~/certs/`. **Look for an existing pair first** — depending on how many hostnames a cert was generated for, mkcert may append a `+N` suffix to the filename (e.g. `local.usafootball.com+3.pem`):
```bash
ls ~/certs/local.usafootball.com*.pem
```
Use whichever `*-key.pem` (key) + `*.pem` (cert) pair is present.

If no cert exists, install mkcert and generate one. Passing explicit `-key-file`/`-cert-file` gives deterministic filenames (no `+N` suffix):
```bash
brew install mkcert
mkcert -install
mkdir -p ~/certs
mkcert -key-file ~/certs/local.usafootball.com-key.pem \
       -cert-file ~/certs/local.usafootball.com.pem \
       local.usafootball.com localhost 127.0.0.1 ::1
```

## Start the SSL proxy
Proxies HTTPS :3001 → HTTP :3000. Point `--key`/`--cert` at the pair from above:
```bash
npx local-ssl-proxy \
  --key ~/certs/local.usafootball.com-key.pem \
  --cert ~/certs/local.usafootball.com.pem \
  --source 3001 --target 3000
```

To auto-detect the pair regardless of any `+N` suffix:
```bash
KEY=$(ls ~/certs/local.usafootball.com*-key.pem | head -1)
CERT=$(ls ~/certs/local.usafootball.com*.pem | grep -v -- '-key.pem' | head -1)
npx local-ssl-proxy --key "$KEY" --cert "$CERT" --source 3001 --target 3000
```

## Dev workflow
1. Start the app on port 3000 (`npm run dev` or `yarn dev`)
2. Start the SSL proxy (command above)
3. Open `https://local.usafootball.com:3001`
