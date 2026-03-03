# API Integration & Dokploy Deployment

API integration matches the reference frontend (rrichie551/frontend). Uses exactly **two** environment variables.

---

## Environment Variables (Dokploy)

Add these to your Dokploy project **before** building. They are inlined at build time (Vite).

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | API base URL | `https://api.skyfareshub.com` |
| `REACT_APP_WEBSITE_ID` | Website ID from CRM | `f0c88814-ba97-4498-8a4c-d1318d338898` |

### Reservation of Flights (reservationofflights.com)

```
REACT_APP_API_URL = https://api.skyfareshub.com
REACT_APP_WEBSITE_ID = f0c88814-ba97-4498-8a4c-d1318d338898
```

**Important:** These must be set as **Build** environment variables. Vite inlines them during `npm run build`.

---

## Setting in Dokploy

1. Open your Dokploy project for the Reservation of Flights frontend
2. Go to **Environment Variables** / **Build Args**
3. Add both variables with values above
4. Rebuild / Redeploy

---

## API Client Behavior

- **Base URL:** From `REACT_APP_API_URL`
- **Website ID:** Sent on every request via:
  - Header: `x-website-id`
  - Body (POST): `websiteId` field
- **Endpoints:** `/citySearch`, `/date`, `/flightprice`, `/flightCreateOrder`, `/flightcretaeorderget`, `/api/consumer/bookings`
- **Error handling:** 401 (MISSING_WEBSITE_ID, INVALID_WEBSITE_ID, INACTIVE_WEBSITE), 429 (rate limit retry), network/timeout

---

## CORS

The API uses dynamic CORS. Ensure `https://reservationofflights.com` is in the allowed origins for your Website ID in the CRM/API admin.

---

## Local Development

1. Copy `.env.example` to `.env.local`
2. Set:
   ```
   REACT_APP_API_URL=http://localhost:2800
   REACT_APP_WEBSITE_ID=f0c88814-ba97-4498-8a4c-d1318d338898
   ```
3. Run `npm run dev`
4. Ensure the API is running (e.g. on port 2800)

---

## Docker Build & Run

### Build

```bash
# Default build (uses default API URL and Website ID from Dockerfile)
docker build -t reservation-of-flights .

# With custom env vars (set at build time)
docker build \
  --build-arg REACT_APP_API_URL=https://api.skyfareshub.com \
  --build-arg REACT_APP_WEBSITE_ID=f0c88814-ba97-4498-8a4c-d1318d338898 \
  -t reservation-of-flights .
```

### Run

```bash
docker run -p 3000:80 reservation-of-flights
```

Then open http://localhost:3000

### CORS-free option

To avoid CORS, set `REACT_APP_API_URL=/api` at build. The nginx config proxies `/api/*` to the API:

```bash
docker build --build-arg REACT_APP_API_URL=/api -t reservation-of-flights .
```

---

## Troubleshooting: "Unable to connect" on live site

This usually means **CORS** or **missing env vars**:

1. **If using Docker** (recommended): The Dockerfile defaults to `REACT_APP_API_URL=/api`. Nginx proxies `/api/*` to the real API, so requests are same-origin and CORS doesn't apply. Rebuild and redeploy the Docker image.

2. **If building without Docker** (Vercel, Netlify, etc.):
   - Set `REACT_APP_API_URL=https://api.skyfareshub.com` and `REACT_APP_WEBSITE_ID=f0c88814-ba97-4498-8a4c-d1318d338898` as **build** env vars
   - Add `https://reservationofflights.com` (and `https://www.reservationofflights.com`) to the API's CORS allowlist for your Website ID in the CRM
   - Or set up a proxy (e.g. Vercel rewrites: `/api/*` → `https://api.skyfareshub.com/*`) and use `REACT_APP_API_URL=/api`

3. **Verify**: DevTools → Network → run a flight search. Check the failed request:
   - Wrong URL (e.g. localhost)? → Env vars not set at build
   - CORS error in console? → Add your domain to API CORS
   - 401? → Check Website ID

---

## Quick Test Steps

### Local

1. `npm run dev`
2. Open http://localhost:5173
3. On homepage, enter From (e.g. JFK) and To (e.g. LHR), pick dates, Search
4. Verify redirect to `/flights?from=JFK&to=LHR&...`
5. DevTools → Network:
   - Request to `{REACT_APP_API_URL}/date`
   - Header `x-website-id` present
   - Response 200 or expected error

### Deployed

1. Set env vars in Dokploy
2. Deploy / rebuild
3. Visit site, perform flight search
4. DevTools Network: verify `x-website-id` header and API base URL
