# Vercel deployment

How to ship Quantum Digital Labs to Vercel. Follow this instead of changing Root Directory or creating new projects.

**Team / scope:** `quantum-0b2e`  
**GitHub repo:** `quantum-digital-labs/quantum-digital-labs`  
**Production branch:** `main`

---

## Current setup (two projects)

| Project | URL | What it is | How it deploys |
| --- | --- | --- | --- |
| `quantum-digital-labs` | https://quantum-digital-labs.vercel.app | Vite frontend | Git push to `main` |
| `quantum-digital-labs-api` | https://quantum-digital-labs-api.vercel.app | Express API | CLI from `server/` |

The frontend calls the API with:

```env
VITE_API_BASE_URL=https://quantum-digital-labs-api.vercel.app/api
```

That value lives in `client/.env.production` and is baked in at **build time**. Changing it requires a **frontend** redeploy.

Do **not** create a third Vercel project. Do **not** delete `quantum-digital-labs-api` until a repo-root deploy of `quantum-digital-labs` is **Ready** and `/api/health` works on the frontend domain.

Typical time: **1–2 minutes** for a frontend git deploy, **about 30–60 seconds** for an API CLI deploy. Successful frontend builds have been ~11–24s; API builds ~17–18s.

---

## 1. Frontend change (`client/`)

This is the usual path for UI work.

```bash
git add .
git commit -m "Your message"
git push origin main
```

Vercel builds `quantum-digital-labs` from GitHub automatically.

**Check**

1. [Deployments](https://vercel.com/quantum-0b2e/quantum-digital-labs) → latest production is **Ready** (not Error / UNKNOWN).
2. Open https://quantum-digital-labs.vercel.app and click through the changed pages.

Root Directory on this project is the **repo root** (`.`). Repo-root `vercel.json` installs client + server, builds the Vite app, and can route `/api` later. Until that unified deploy is proven Ready, the live site still uses the API project above.

---

## 2. API change (`server/`)

`quantum-digital-labs-api` is **not** git-auto-deployed. Pushing `main` does **not** update the API.

From the repo:

```bash
cd server
npx vercel --prod --yes --scope quantum-0b2e
```

First time on a machine, link the folder if needed:

```bash
cd server
npx vercel link --yes --scope quantum-0b2e --project quantum-digital-labs-api
npx vercel --prod --yes --scope quantum-0b2e
```

**Check**

- https://quantum-digital-labs-api.vercel.app/api/health
- Then reload the frontend and test the feature that hits the API (login, forms, CMS).

If you changed `CLIENT_URL` or CORS, confirm https://quantum-digital-labs.vercel.app is allowed.

---

## 3. Frontend + API in one feature

1. Deploy the API (`cd server && npx vercel --prod --yes --scope quantum-0b2e`).
2. Push frontend changes to `main` (or push first if the UI does not depend on the new API yet).
3. Wait until **both** production deployments are **Ready**.
4. Test on https://quantum-digital-labs.vercel.app.

Expect **about 2–3 minutes** total.

---

## Environment variables

Set these in the Vercel dashboard (Project → Settings → Environment Variables). Never commit `.env` files.

### `quantum-digital-labs` (frontend)

| Name | Production value |
| --- | --- |
| `VITE_API_BASE_URL` | `https://quantum-digital-labs-api.vercel.app/api` |

Vite only reads `VITE_*` at build time. After changing this, redeploy the frontend.

### `quantum-digital-labs-api` (API)

| Name | Notes |
| --- | --- |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | `https://quantum-digital-labs.vercel.app` (comma-separated if you add more origins) |
| `DATABASE_URL` | Postgres connection string |
| `JWT_SECRET` | Strong secret, 32+ characters |
| `JWT_EXPIRES_IN` | e.g. `7d` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `MAIL_FROM` | Optional; needed for mail |

After changing API env vars, redeploy the API project.

---

## Local check before you push

```bash
npm run dev
npm run dev:server
```

- Frontend: http://localhost:5173  
- API: http://localhost:5050/api/health  

Use `client/.env` with `VITE_API_BASE_URL=http://localhost:5050/api`. Do not point local Vite at production unless you intend to hit the live API.

```bash
npm run build
```

Fix typecheck/build errors before pushing. A failed Vite build fails the Vercel deploy.

---

## If something looks wrong

| Symptom | What to do |
| --- | --- |
| Latest deploy is **UNKNOWN** for several minutes | Hobby allows **one concurrent build**. Wait, or cancel stuck deploys in the dashboard, then Redeploy. |
| CLI says **Not authorized** | `npx vercel login`, confirm `--scope quantum-0b2e`, then retry. Live alias is not replaced until a deploy is Ready. |
| Frontend live, API 404 / CORS errors | Redeploy `quantum-digital-labs-api`. Confirm `CLIENT_URL` includes the frontend origin. |
| Env change has no effect | `VITE_*` needs a **frontend rebuild**. API env needs an **API redeploy**. |
| Accidentally created a new Vercel project | Delete the extra project. Keep only `quantum-digital-labs` and `quantum-digital-labs-api`. |

Dashboard: [quantum-digital-labs](https://vercel.com/quantum-0b2e/quantum-digital-labs) · [quantum-digital-labs-api](https://vercel.com/quantum-0b2e/quantum-digital-labs-api)

---

## Do not

- Do not add another Vercel project for this repo.
- Do not change Root Directory in the dashboard unless you are finishing the single-project merge and a repo-root deploy is already **Ready**.
- Do not delete `quantum-digital-labs-api` while `VITE_API_BASE_URL` still points at `https://quantum-digital-labs-api.vercel.app/api`.
- Do not commit `.env`, `.env.local`, or SMTP / database / JWT secrets.

---

## Later: one project (not done yet)

Repo-root `vercel.json` and `api/index.ts` are on `main` so `quantum-digital-labs` can serve the SPA and `/api` together. That merge is **not live** until:

1. A production deploy of `quantum-digital-labs` from the repo root is **Ready**.
2. https://quantum-digital-labs.vercel.app/api/health works.
3. `VITE_API_BASE_URL` is switched to `/api` and the frontend is rebuilt.
4. API env vars are copied onto `quantum-digital-labs`.
5. Only then delete `quantum-digital-labs-api`.

Until then, keep using **git push for the frontend** and **`vercel --prod` from `server/` for the API**.
