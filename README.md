# PayGoal – website, partner portal and API

Code for **PAYGOAL BUSINESS SOLUTIONS PRIVATE LIMITED** (paygoal.in).

| Part | What it is | Tech |
| --- | --- | --- |
| **Website** (`/`) | Marketing page with the scroll-trail effect and a contact form | Vite, React, TypeScript, Tailwind CSS v4, motion, lenis |
| **Partner portal** (`/signup`, `/login`, `/dashboard`) | Partners sign up, track onboarding, open support tickets, edit their profile. Reports is a "coming soon" placeholder. | Same app, loaded as a separate chunk |
| **Admin portal** (`/admin`) | Your team approves partners, updates onboarding steps, answers tickets and reads website enquiries | Same app |
| **API** (`backend/`) | REST API under `/api` | Node.js, Express 5, MongoDB (Mongoose) |

> **No payments, no money transfer.** There are no payment, wallet, payout or transfer features anywhere in the code, and the API has no such endpoints. Add them later only after proper legal and regulatory review.

---

## Editing content

All website text is in **`frontend/src/content.ts`**. Search it for `PLACEHOLDER` and replace these before going live:

| Field | Current placeholder |
| --- | --- |
| `email` | `contact@paygoal.in` |
| `phoneDisplay` / `phoneHref` | `+91 XXXXX XXXXX` |
| `whatsappHref` | `https://wa.me/91XXXXXXXXXX` |
| `hours` | Working hours |
| `contact.body` | Reply-time promise |
| `legal.privacy` / `legal.terms` | Policy text (have it reviewed by your legal advisor) |

## Project structure

```
PayGoal/
├── frontend/                  website + partner/admin portal (React)
│   ├── index.html             page shell: title, meta tags, fonts
│   ├── public/                favicon, og-image.png, robots.txt, sitemap.xml
│   ├── src/
│   │   ├── content.ts         ALL website copy and company details
│   │   ├── main.tsx           routes: "/" = website, everything else = portal (lazy-loaded)
│   │   ├── App.tsx            marketing page (sections in order)
│   │   ├── sections/          marketing page sections
│   │   ├── components/        navbar, scroll trail, footer, shared pieces
│   │   ├── lib/               API client, smooth scroll
│   │   ├── portal/            login, signup, layouts, UI kit
│   │   │   ├── partner/       partner dashboard pages
│   │   │   └── admin/         admin pages
│   │   └── styles/index.css   design tokens (colours, fonts)
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                   REST API (Node + Express + MongoDB)
│   ├── src/
│   │   ├── index.ts           starts the API (listens on 127.0.0.1 only)
│   │   ├── app.ts             Express app; mounts routes under /api
│   │   ├── config.ts          environment settings + database-name safety check
│   │   ├── db.ts              MongoDB connection
│   │   ├── validation.ts      input validation rules
│   │   ├── models/            User, Enquiry, Ticket
│   │   ├── routes/            auth, enquiries, me, tickets, admin
│   │   ├── middleware/        sessions, errors
│   │   └── scripts/           create-admin, reset-password
│   ├── .env.example           settings template (copy to .env)
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

`frontend/` and `backend/` are independent projects: each has its own `package.json`, dependencies and build. The frontend talks to the backend only through `/api`.

### API overview

| Endpoint | Who | Purpose |
| --- | --- | --- |
| `POST /api/enquiries` | Public | Website contact form (rate-limited, spam honeypot) |
| `POST /api/auth/signup`, `/login`, `/logout`, `GET /api/auth/me` | Public / signed in | Accounts |
| `GET /api/me/overview`, `PUT /api/me/profile`, `PUT /api/me/password` | Signed in | Own account |
| `GET/POST /api/tickets`, `GET/PATCH /api/tickets/:id`, `POST /api/tickets/:id/messages` | Partner (own) / admin (all) | Support tickets |
| `GET /api/admin/stats`, `/partners`, `/partners/:id`, `/enquiries`, `PATCH …` | Admin | Admin tools |

**Security built in:**
- Passwords are hashed with bcrypt.
- Sessions live in an httpOnly, SameSite=Lax cookie.
- Requests that change data must be sent as JSON, which blocks cross-site form attacks (CSRF).
- Login, signup and the contact form are rate-limited.
- Inputs are validated, and partners can only see their own data.

---

## Run locally

Requires **Node.js 20.6+** and a MongoDB you can reach.

```bash
# Terminal 1: backend
cd backend
npm install
cp .env.example .env        # then edit .env (see below)
npm run create-admin -- --email you@paygoal.in --name "Your Name"
npm run dev                 # API on http://127.0.0.1:4100

# Terminal 2: frontend
cd frontend
npm install
npm run dev                 # website on http://localhost:5173 (forwards /api to the API)
```

For local development, `backend/.env` can use `MONGODB_DB=paygoal_dev`. The database name must start with `paygoal`, otherwise the server refuses to start. That check stops it from ever being pointed at another project's database.

## Build

```bash
cd frontend && npm run build    # website + portal -> frontend/dist/
cd backend  && npm run build    # API              -> backend/dist/
```

---

## Deploy on the Ubuntu server

The server already hosts another site and another project that uses MongoDB. **Every step below only adds new things for PayGoal:**
- a new database, `paygoal`;
- a new database user;
- a new systemd service;
- a new nginx file.

Nothing existing is edited, restarted or removed.

### 0. Check what's already there (read-only)

```bash
node -v                          # needs v20.6 or newer
mongod --version
sudo ss -ltnp | grep -E ':4100|:27017'   # 4100 must be free (change PORT in .env if not)
ls /etc/nginx/sites-enabled/     # just to see existing sites, don't edit them
```

### 1. Create a separate MongoDB database and user

Connect with `mongosh`. If MongoDB already requires a login, use the existing admin user that the other project's administrator uses:

```bash
mongosh                                                     # if auth is NOT enabled
# or
mongosh -u <existing-admin> -p --authenticationDatabase admin   # if auth IS enabled
```

Then, inside `mongosh`:

```js
use paygoal
db.createUser({
  user: "paygoal_app",
  pwd: passwordPrompt(),                       // type a strong password
  roles: [ { role: "readWrite", db: "paygoal" } ]   // access to the paygoal database ONLY
})
```

This creates only the `paygoal` database and a user that can touch nothing else.

> **Do not** change MongoDB's own settings, such as enabling authentication, changing `bindIp` or restarting `mongod`, without checking with whoever runs the other project. Their app may depend on the current setup. PayGoal works either way.

### 2. Get the code and build

```bash
sudo mkdir -p /var/www/paygoal && sudo chown $USER /var/www/paygoal
git clone <your-repo-url> /var/www/paygoal
cd /var/www/paygoal/frontend && npm ci && npm run build   # website -> /var/www/paygoal/frontend/dist
cd /var/www/paygoal/backend  && npm ci && npm run build   # API     -> /var/www/paygoal/backend/dist
```

### 3. Configure the API

```bash
cd /var/www/paygoal/backend
cp .env.example .env
nano .env
chmod 600 .env
```

Set:

```ini
PORT=4100
MONGODB_URI=mongodb://paygoal_app:YOUR_PASSWORD@127.0.0.1:27017/paygoal?authSource=paygoal
MONGODB_DB=paygoal
JWT_SECRET=<output of: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))">
COOKIE_SECURE=false        # change to true after SSL is set up (step 6)
```

If the password contains special characters such as `@ : / ?`, URL-encode them in `MONGODB_URI`.

Create the first admin. You'll be asked for a password; there are no default logins.

```bash
npm run create-admin:prod -- --email you@paygoal.in --name "Your Name"
```

### 4. Run the API as a service

Create a **new** file `/etc/systemd/system/paygoal-api.service`:

```ini
[Unit]
Description=PayGoal API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/paygoal/backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node --env-file=/var/www/paygoal/backend/.env dist/index.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo chown www-data /var/www/paygoal/backend/.env    # the service user must be able to read it
sudo systemctl daemon-reload
sudo systemctl enable --now paygoal-api
sudo systemctl status paygoal-api       # should be "active (running)"
curl http://127.0.0.1:4100/api/health   # {"ok":true}
```

Use `which node` if Node isn't at `/usr/bin/node`. Logs: `journalctl -u paygoal-api -f`.

### 5. nginx

Create a **new** file `/etc/nginx/sites-available/paygoal.in`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name paygoal.in www.paygoal.in;

    root /var/www/paygoal/frontend/dist;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_comp_level 6;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml application/xml;

    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-Frame-Options "SAMEORIGIN" always;

    # API -> Node service on localhost
    location /api/ {
        proxy_pass http://127.0.0.1:4100;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 1m;
    }

    # Hashed build assets: cache for one year
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable" always;
        add_header X-Content-Type-Options "nosniff" always;
        try_files $uri =404;
    }

    # index.html: always revalidate so new deploys show immediately
    location = /index.html {
        add_header Cache-Control "no-cache" always;
        add_header X-Content-Type-Options "nosniff" always;
    }

    # Website + portal routes (/dashboard, /admin, ...) are handled by the app
    location / {
        try_files $uri /index.html;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/paygoal.in /etc/nginx/sites-enabled/paygoal.in
sudo nginx -t                  # must say "syntax is ok" before reloading
sudo systemctl reload nginx    # reload keeps the other site running
```

DNS: point the `A` records for `paygoal.in` and `www.paygoal.in` to this server.

### 6. Free SSL with certbot

```bash
sudo apt install certbot python3-certbot-nginx   # if not installed yet
sudo certbot --nginx -d paygoal.in -d www.paygoal.in
```

Certbot changes only the paygoal.in server block. Then turn on secure cookies and restart the PayGoal API, which is the only service restarted:

```bash
sed -i 's/^COOKIE_SECURE=.*/COOKIE_SECURE=true/' /var/www/paygoal/backend/.env
sudo systemctl restart paygoal-api
```

### Updating later

```bash
cd /var/www/paygoal && git pull
cd /var/www/paygoal/frontend && npm ci && npm run build                                     # website changes
cd /var/www/paygoal/backend  && npm ci && npm run build && sudo systemctl restart paygoal-api # API changes
```

### Backups

Back up only the PayGoal database:

```bash
mongodump --uri "mongodb://paygoal_app:YOUR_PASSWORD@127.0.0.1:27017/paygoal?authSource=paygoal" --out ~/backups/paygoal-$(date +%F)
```

---

## Notes

- **Privacy and tracking:** no analytics or tracking scripts. The only cookie is the login session.
- **Third-party content:**
  - Google Fonts, for the typefaces.
  - Google Maps embed, loaded only near the Contact section.
- **KYC documents:** there is no document upload yet, on purpose. Partners are asked not to send identity documents through tickets. Add secure uploads later with proper storage and access controls.
- **Forgotten passwords:** there is no email-based reset yet, because no email service is set up. To reset a partner's password on the server, run `cd /var/www/paygoal/backend && npm run reset-password:prod -- --email partner@example.com`. This keeps their role.
- **Reduced motion:** visitors with `prefers-reduced-motion` get no scroll trail. They see a static wordmark.
- **Illustrative dashboard:** the hero dashboard is labelled "Illustrative" and shows no real data.
