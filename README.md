<div align="center">

<img src="https://img.shields.io/badge/SIH-2026-FF6B35?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyTDIgN2wxMCA1IDEwLTV6TTIgMTdsOSA0LjUgOS00LjVNMiAxMmw5IDQuNSA5LTQuNSIvPjwvc3ZnPg==&logoColor=white" alt="SIH 2026"/>
<img src="https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
<img src="https://img.shields.io/badge/CesiumJS-1.122-4FC3F7?style=for-the-badge&logo=cesium&logoColor=white" alt="CesiumJS"/>
<img src="https://img.shields.io/badge/Supabase-PostGIS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/>
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>

<br/>
<br/>

# 🗺️ 3D-BhuMap

### *India's 3D Cadastral Mapping Platform for Smart India Hackathon 2026*

**A production-grade geospatial web application for 3D spatial property registration, conflict detection, and government land administration — built on Next.js, CesiumJS, and Supabase PostGIS.**

<br/>

[**Live Demo**](http://localhost:3000) · [**3D Map**](http://localhost:3000/map) · [**Dashboard**](http://localhost:3000/dashboard) · [**Report an Issue**](https://github.com/ayanhackss/BhuMap-3D/issues)

</div>

---

## 🧭 What is BhuMap-3D?

India's land records are 2D. But buildings go **up**. A single plot can contain a basement, five floors, and a rooftop — each with separate owners, disputes, and government records that don't exist yet.

**3D-BhuMap** solves this by introducing:

- **3DSPID** — a new spatial identifier that pinpoints a property in X, Y *and* Z
- **ULPIN integration** — each 3D unit is anchored to its parent 2D ULPIN parcel
- **AI-assisted building extraction** from drone orthophotos and DSM point clouds
- **3D conflict detection** — flags sewer lines running through basements, overlapping floor slabs, etc.
- **Government approval workflow** — multi-role review pipeline (Surveyor → GIS Analyst → Authority)

---

## ✨ Features

### 🗺️ 3D GIS Viewer
- **CesiumJS** globe with real OSM 3D Buildings (requires Cesium Ion token)
- Polygon fallback mode — fully functional without an Ion token (demo mode)
- **Explode Building** — separates floors visually to inspect individual units
- **Underground Mode** — makes the globe translucent to see buried infrastructure
- **AI Extract** — simulates AI-assisted building detection from aerial imagery
- **Conflict Detection** — identifies 3D volume intersections between property and utilities
- **Layer Panel** — toggle cadastral, survey, remote sensing, and infrastructure layers
- **Property Detail Panel** — shows 3DSPID, ULPIN, dimensions, AI confidence, and approval status
- **Search** — global search flies camera to matching building or SPID

### 📊 Government Dashboard
- Real-time KPI cards: parcels, buildings, properties, coverage %, AI confidence
- Bar + Pie charts (Recharts) — building type distribution, property approval status
- Recent conflict feed with severity indicators
- Demo Flow checklist — guided walkthrough for evaluators

### 🔐 Authentication & Roles
| Role | Access |
|------|--------|
| Super Admin | Full access |
| Government Authority | Approve / Reject / Reports |
| Surveyor | Edit geometry, Verify |
| GIS Analyst | Analyze, Conflict detection |
| Utility Department | Underground utilities view |
| Public Viewer | Verified records only |

### 📋 Data Pages
- **Parcels** — ULPIN-indexed parcel registry with status badges
- **Buildings** — 3D building footprints with AI confidence scores
- **Properties** — Vertical units with 3DSPID identifiers
- **Surveys** — Field survey management
- **Conflicts** — Detected spatial conflicts with resolution workflow
- **Approvals** — Government authority review queue
- **Audit Log** — Complete immutable record of all actions
- **Reports** — Generate cadastral certificates and exports

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 16** (App Router, Server Components) |
| Language | **TypeScript 5** |
| 3D Engine | **CesiumJS 1.122** (loaded from CDN, singleton) |
| Database | **Supabase** (PostgreSQL + PostGIS) |
| Auth | **Supabase Auth** + demo bypass |
| State | **Zustand** with `persist` middleware |
| Data Fetching | **TanStack Query v5** |
| Charts | **Recharts** |
| Styling | **Tailwind CSS v4** + CSS custom properties |
| Typography | **Bricolage Grotesque** (Display & Body) |
| Monospace | **Geist Mono** |
| Icons | **Lucide React** |
| Edge Middleware | **Next.js Middleware** (route-level auth guard) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- A [Supabase](https://supabase.com) project (free tier works)
- *(Optional)* A [Cesium Ion](https://cesium.com/ion/) token for real OSM 3D Buildings

### 1. Clone & Install

```bash
git clone https://github.com/ayanhackss/BhuMap-3D.git
cd BhuMap-3D
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server-only, never expose

# Cesium Ion (optional — enables real OSM 3D Buildings)
NEXT_PUBLIC_CESIUM_ION_TOKEN=your-cesium-ion-token
```

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` is used only in server-side API routes. Never import it in client components.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Demo Login

The app ships with four demo accounts (no Supabase connection needed):

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `admin@bhumap.gov.in` | `Admin@123` |
| Govt. Authority | `authority@bhumap.gov.in` | `Auth@123` |
| Surveyor | `surveyor@bhumap.gov.in` | `Survey@123` |
| GIS Analyst | `analyst@bhumap.gov.in` | `Analyst@123` |

---

## 🗄️ Database Schema

The app expects the following Supabase tables:

```sql
-- Land parcels (2D, ULPIN-indexed)
CREATE TABLE parcels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ulpin TEXT UNIQUE NOT NULL,           -- Unique Land Parcel ID
  village TEXT, tehsil TEXT, district TEXT, state TEXT,
  area_sqm NUMERIC, survey_number TEXT,
  status TEXT DEFAULT 'active',
  geometry GEOMETRY(POLYGON, 4326),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3D building footprints
CREATE TABLE buildings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id UUID REFERENCES parcels(id),
  building_name TEXT,
  building_type TEXT,                   -- residential, commercial, government, etc.
  floor_count INT,
  min_elevation_m NUMERIC,
  max_elevation_m NUMERIC,
  ai_confidence NUMERIC,               -- 0–100
  status TEXT DEFAULT 'draft',
  geometry GEOMETRY(POLYGON, 4326),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Vertical property units (3DSPID)
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spid_3d TEXT UNIQUE NOT NULL,         -- 3D Spatial Property ID
  parent_ulpin TEXT REFERENCES parcels(ulpin),
  building_id UUID REFERENCES buildings(id),
  floor_name TEXT, unit_number TEXT,
  property_type TEXT, usage TEXT,
  min_elevation_m NUMERIC, max_elevation_m NUMERIC,
  area_sqm NUMERIC, volume_cbm NUMERIC,
  approval_status TEXT DEFAULT 'draft', -- draft, provisional, verified, rejected
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Spatial conflicts
CREATE TABLE conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conflict_type TEXT,                  -- volume_intersection, boundary_overlap, etc.
  severity TEXT,                       -- critical, high, medium, low
  status TEXT DEFAULT 'open',          -- open, in_review, resolved
  object_a_id UUID, object_b_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Field surveys
CREATE TABLE surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id UUID REFERENCES parcels(id),
  surveyor_id UUID,
  survey_method TEXT,                  -- gnss, drone, total_station
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (main)/                    # Authenticated app shell
│   │   ├── layout.tsx             # Sidebar + topbar + hydration gate
│   │   ├── error.tsx              # Error boundary (all routes)
│   │   ├── dashboard/             # KPI cards, charts, conflict feed
│   │   ├── map/                   # 3D CesiumJS viewer
│   │   ├── parcels/               # ULPIN parcel registry
│   │   ├── buildings/             # Building footprints
│   │   ├── properties/            # 3DSPID property units
│   │   ├── surveys/               # Field survey management
│   │   ├── conflicts/             # Spatial conflict detection
│   │   ├── approvals/             # Govt. approval workflow
│   │   ├── reports/               # Report generation
│   │   └── audit/                 # Audit log
│   ├── api/
│   │   └── auth/session/          # Server-side session cookie API
│   ├── login/                     # Auth page (demo + Supabase)
│   └── page.tsx                   # Public landing page
├── components/
│   ├── layout/
│   │   ├── AppSidebar.tsx         # Role-filtered navigation
│   │   └── AppTopbar.tsx          # Search + notifications
│   └── map/
│       ├── LayerPanel.tsx         # Layer visibility controls
│       ├── RightPanel.tsx         # Property detail inspector
│       ├── MapToolbar.tsx         # Map tools (measure, explode, AI)
│       └── MapStatusBar.tsx       # Cursor coords + scale
├── lib/
│   ├── supabase.ts                # Client-side Supabase client
│   ├── supabase.server.ts         # Server-only (service role key)
│   ├── cesium-loader.ts           # Singleton CDN loader
│   └── utils.ts                   # Formatters, badge helpers
├── store/
│   ├── authStore.ts               # Zustand auth (persisted)
│   └── mapStore.ts                # Zustand map state (persisted)
└── middleware.ts                  # Edge auth guard (bhumap-session cookie)
```

---

## 🔒 Authentication Architecture

```
Browser                   Edge Middleware              API Route
───────                   ──────────────              ─────────
Login form
  │  POST /api/auth/session ──────────────────────────────►
  │                                                   Sets HttpOnly
  │                                                   bhumap-session cookie
  │◄─────────────────────────────────────────────────
  │  Navigate to /dashboard
  │──────────────────────────► Reads bhumap-session
  │                            cookie ✓ → allow
  │◄──────────────────────────
  Dashboard renders
```

- **Edge middleware** (`src/middleware.ts`) reads the `bhumap-session` cookie on every protected route
- **Cookie is set server-side** via `/api/auth/session` so it's available to middleware immediately on the first redirect
- **Zustand** persists the user profile (role, name) in localStorage for client-side use
- **Hydration gate** in layout prevents the ~50ms flash where the user appears logged out

---

## 🎨 Design System

The design is locked in [`design.md`](./design.md). Key tokens:

| Token | Value |
|-------|-------|
| `--color-background` | `oklch(96% 0.006 240)` (light) |
| `--color-paper` | `#ffffff` |
| `--color-accent` | `#3b82f6` (signal blue) |
| `--color-ink` | `#111827` |
| `--color-muted` | `#6b7280` |
| Font | Bricolage Grotesque |
| Mono | Geist Mono |

---

## 🧪 Demo Flow (for SIH Evaluators)

1. Open `http://localhost:3000` → Landing page
2. Click **Go to App** → Login with `authority@bhumap.gov.in` / `Auth@123`
3. **Dashboard** → View KPI cards, charts, and conflict feed
4. **Map** → Click `Demo Area` to fly to Patna, Bihar
5. Click **Explode Building** → See Floor 10 separated
6. Click **AI Extract** → AI confidence report
7. Click **Detect Conflicts** → Sewer/basement intersection alert
8. Search `"Urban Tower"` in top bar → Camera flies to building
9. Toggle layers in the left panel → Buildings hide/show
10. **Parcels / Buildings / Properties** → Real data tables
11. **Conflicts → Approvals** → Review workflow

---

## 🛣️ Roadmap

- [ ] Real-time collaborative editing (Supabase Realtime)
- [ ] LiDAR point cloud import (`.laz` / `.las`)
- [ ] Floor plan PDF overlay on 3D model
- [ ] Mobile field surveyor app (PWA)
- [ ] Integration with DILRMP / NGDRS
- [ ] Blockchain-anchored property certificates
- [ ] AI model fine-tuned on Indian building typologies

---

## 👥 Team

> **Smart India Hackathon 2026** — Team BhuMap

<table align="center">
  <tr>
    <td align="center"><b>Ayan Hussain</b></td>
    <td align="center"><b>Abhishek Kumar</b></td>
    <td align="center"><b>Samriddhi Kumari</b></td>
  </tr>
  <tr>
    <td align="center"><b>Ishaan Singh</b></td>
    <td align="center"><b>Gautam Kumar</b></td>
    <td align="center"><b>Aditya Kumar</b></td>
  </tr>
</table>

---

## 🤝 Contributing

This project was built for **Smart India Hackathon 2026**. Contributions, suggestions, and feedback are welcome.

```bash
# Fork → Branch → Code → PR
git checkout -b feature/your-feature
git commit -m "feat: description"
git push origin feature/your-feature
```

---

## 📄 License

MIT © 2026 — Built with ❤️ for Smart India Hackathon 2026

---

<div align="center">

**Made with Next.js · CesiumJS · Supabase · TypeScript**

*Transforming India's land records — one voxel at a time.*

[![GitHub Stars](https://img.shields.io/github/stars/ayanhackss/BhuMap-3D?style=social)](https://github.com/ayanhackss/BhuMap-3D)

</div>
