# 🌉 FoodBridge — Food Redistribution Platform

> Connecting surplus food from restaurants, events, and hostels with volunteers and NGOs to reduce food waste and feed people in need.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Map | Leaflet.js + OpenStreetMap (via react-leaflet) |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (via `pg` / node-postgres) |
| Auth | Google OAuth 2.0 (via Passport.js) |
| File Upload | Multer |
| AI Quality Check | External AI API (via Axios) |
| Session | express-session + connect-pg-simple |
| Security | Helmet, CORS |

---

## 📁 Project Structure

```
FoodBridge/
├── client/                  # React frontend
│   └── src/
│       ├── components/
│       │   ├── common/      # Navbar, Footer, FoodCard, ExpiryTimer
│       │   ├── food/        # FoodForm, FoodList, FoodQualityBadge
│       │   ├── map/         # FoodMap (Leaflet)
│       │   ├── dashboard/   # ImpactStats
│       │   └── auth/        # LoginButton, ProtectedRoute
│       ├── pages/           # Full page components (HomePage, MapPage, etc.)
│       ├── services/        # API call functions (food, auth, ai)
│       ├── context/         # AuthContext (global user state)
│       ├── hooks/           # useLocation (GPS hook)
│       └── utils/           # Helper functions
│
├── server/                  # Node + Express backend
│   ├── routes/              # auth, food, user, delivery, ai
│   ├── controllers/         # Business logic for each route
│   ├── middleware/          # isAuthenticated, errorHandler, validate
│   ├── config/              # db.config.js, passport.config.js, multer.config.js
│   ├── services/            # AI API integration, external services
│   └── uploads/             # Uploaded food images (git-ignored)
│
├── database/
│   ├── schema.sql           # Full DB schema — run this first
│   ├── seeds/seed.sql       # Sample data for development
│   └── queries/             # Reusable SQL query functions
│
└── docs/                    # Additional documentation
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL v14+
- A Google Cloud project (for OAuth credentials)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/FoodBridge.git
cd FoodBridge
```

### 2. Set up environment variables
```bash
cp .env.example server/.env
# Edit server/.env with your values
```

### 3. Set up the database
```bash
# Create a new PostgreSQL database
createdb foodbridge_db
# OR
psql -U postgres -f database/create_db.sql

# Run the schema
psql -d foodbridge_db -f database/schema.sql

# (Optional) Load sample data
psql -d foodbridge_db -f database/seeds/seed.sql
```

### 4. Install all dependencies
```bash
npm run install:all
```

### 5. Run the app (frontend + backend together)
```bash
npm run dev
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## 🔑 Environment Variables

See `.env.example` for all required variables. Key ones:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `GOOGLE_CALLBACK_URL` | `http://localhost:5000/api/auth/google/callback` |
| `SESSION_SECRET` | Any long random string |
| `AI_API_KEY` | Your AI provider API key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (for hosted listing images) |
| `CLOUDINARY_UPLOAD_PRESET` | Unsigned Cloudinary upload preset name |
| `CLOUDINARY_FOLDER` | Optional Cloudinary folder for uploaded listing images |
| `CLIENT_URL` | `http://localhost:3000` |
| `REACT_APP_API_BASE_URL` | Frontend API base URL (e.g. `https://your-backend.vercel.app/api`) |
| `PG_SSL_REJECT_UNAUTHORIZED` | Set `false` for providers using self-signed/intermediate cert chains |

---

## 🛠️ Backend Debug Checklist

If your backend fails locally or on Vercel, check these first:

1. **Health endpoint:** `GET /api/health` should return status JSON.
2. **Database endpoint:** `GET /api/health/db` should return `{ "database": "connected" }`.
3. **Google auth availability:** `GET /api/auth/google/status` should return `{ "enabled": true }`.
4. **Session secret present:** ensure `SESSION_SECRET` is set in local `.env` and Vercel envs.
5. **Allowed frontend origin:** ensure `CLIENT_URL` contains your frontend origin exactly.

---

## ▲ Deploying Google Authentication on Vercel

### 1) Deploy backend (`server/`) to Vercel
- Create a separate Vercel project pointing to the `server` directory.
- Ensure `server/vercel.json` is included.

### 2) Set backend environment variables in Vercel

Set these in **Vercel Project → Settings → Environment Variables**:

- `NODE_ENV=production`
- `DATABASE_URL=<your_postgres_url>`
- `PG_SSL_REJECT_UNAUTHORIZED=false` (or `true` if your provider requires strict cert validation)
- `SESSION_SECRET=<long-random-secret>`
- `CLIENT_URL=https://<your-frontend>.vercel.app`
- `GOOGLE_CLIENT_ID=<google-client-id>`
- `GOOGLE_CLIENT_SECRET=<google-client-secret>`
- Optional: `GOOGLE_CALLBACK_URL=https://<your-backend>.vercel.app/api/auth/google/callback`

> If `GOOGLE_CALLBACK_URL` is not set, the server automatically falls back to `https://$VERCEL_URL/api/auth/google/callback`.

### 3) Configure Google Cloud OAuth

In **Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client ID**:

- **Authorized JavaScript origin**:
  - `https://<your-frontend>.vercel.app`
- **Authorized redirect URI**:
  - `https://<your-backend>.vercel.app/api/auth/google/callback`

### 4) Configure frontend environment

In your frontend Vercel project env vars:

- `REACT_APP_API_BASE_URL=https://<your-backend>.vercel.app/api`
- Optional: `REACT_APP_ENABLE_GOOGLE_AUTH=true`

### 5) Verify end-to-end

1. Open frontend login page.
2. Click **Continue with Google**.
3. After Google sign-in, you should be redirected to `/dashboard`.
4. Confirm session with `GET /api/auth/me`.

> ✅ Food images are persisted in PostgreSQL as `data:image/...;base64,...` in `food_listings.image_url`, so listings still render donor-uploaded images across serverless restarts.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/google` | Start Google OAuth login |
| GET | `/api/auth/google/callback` | OAuth callback |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/login` | Login with email + password |
| POST | `/api/auth/register` | Register with email + password |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/food` | Get all available food |
| GET | `/api/food/nearby` | Get food near location (`?lat=&lng=&radius=`) |
| GET | `/api/food/:id` | Get single food listing |
| POST | `/api/food` | Create food listing (with image) |
| PUT | `/api/food/:id` | Update food listing |
| DELETE | `/api/food/:id` | Delete food listing |
| GET | `/api/deliveries` | Get all pending deliveries |
| POST | `/api/deliveries` | Volunteer claims a pickup |
| PUT | `/api/deliveries/:id/status` | Update delivery status |
| POST | `/api/ai/check-quality` | AI food quality check |

---

## 👥 Team Roles

| Member | Responsibility |
|--------|---------------|
| **Ashmit** | Database design — `database/schema.sql`, `database/queries/` |
| **Amitabha** | Frontend — `client/src/` (pages, components) + some backend routes |
| **Saptarshi Sau** | Backend — `server/routes/`, `server/controllers/`, `server/services/` |
| **Rajdeep** | Full-stack , code review, merging, deployment |

---

## 🌿 Git Workflow

```bash
# Each person works on their own branch
git checkout -b feature/your-feature-name

# Push and create a PR for Rajdeep to review
git push origin feature/your-feature-name
```

Branch naming:
- `feature/food-listing-api`
- `feature/map-component`
- `feature/google-auth`
- `fix/expiry-timer-bug`

---

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| `users` | Stores donor/volunteer/NGO accounts (via Google OAuth) |
| `food_listings` | Food items posted for donation (with location, expiry, AI quality) |
| `deliveries` | Tracks volunteer pickups and delivery status |

---

## ✅ Development Checklist

### Database (Ashmit)
- [ ] Finalize schema.sql
- [ ] Write user queries
- [ ] Write food queries
- [ ] Write delivery queries

### Backend (Saptarshi)
- [ ] Connect DB in `config/db.config.js`
- [ ] Complete `auth.controller.js`
- [ ] Complete `food.controller.js`
- [ ] Complete `delivery.controller.js`
- [ ] Integrate AI API in `ai.controller.js`
- [ ] Mount all routes in `index.js`

### Frontend (Amitabha)
- [ ] Build `Navbar`, `Footer` components
- [ ] Build `LoginPage` with Google OAuth button
- [ ] Build `HomePage` with food listings
- [ ] Build `FoodMap` with Leaflet markers
- [ ] Build `AddFoodPage` with form + image upload
- [ ] Build `DashboardPage` with impact stats
- [ ] Connect all pages to backend via services

### Integration (All)
- [ ] Test auth flow end to end
- [ ] Test food listing create + map display
- [ ] Test volunteer pickup flow
- [ ] Test AI quality check

---
