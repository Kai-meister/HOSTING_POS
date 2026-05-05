# POS System

A complete Point of Sale system with Spring Boot backend and React JS frontend.

## Project Structure

```
pos-system/
  backend/    - Spring Boot REST API (Java 17)
  frontend/   - React JS with Vite
```

## Tech Stack

**Backend:**
- Spring Boot 3.2.0
- Spring Data JPA
- H2 (local dev) / PostgreSQL (production)
- Lombok
- SpringDoc OpenAPI (Swagger UI)

**Frontend:**
- React 18 with Vite
- React Router v6
- TanStack Query v5
- Axios
- React Hot Toast
- Lucide React icons

---

## Running Locally

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+

### Backend

```bash
cd pos-system/backend
mvn spring-boot:run
```

The backend starts on http://localhost:8080

- H2 Console: http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:mem:posdb`)
- Swagger UI: http://localhost:8080/swagger-ui.html

Sample data (3 categories, 10 products) is automatically seeded on startup.

### Frontend

```bash
cd pos-system/frontend
npm install
npm run dev
```

The frontend starts on http://localhost:5173

API calls are proxied to `http://localhost:8080` via Vite's dev server proxy.

---

## Pages

| Page | Route | Description |
|------|-------|-------------|
| POS | `/pos` | Main selling screen with product grid, cart, and payment |
| Dashboard | `/dashboard` | Today's stats and recent orders |
| Products | `/products` | Product management (CRUD) |
| Orders | `/orders` | Order history with expandable item details |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/{id}` | Update category |
| DELETE | `/api/categories/{id}` | Delete category |
| GET | `/api/products` | List active products (optional `?categoryId=`) |
| POST | `/api/products` | Create product |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Soft-delete product |
| GET | `/api/orders` | List all orders |
| GET | `/api/orders/{id}` | Get order by ID |
| POST | `/api/orders` | Create order (validates stock, deducts inventory) |
| GET | `/api/dashboard/stats` | Today's sales, revenue, product counts |

---

## Deploying to Render

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Create PostgreSQL Database on Render

1. Go to https://render.com and sign in
2. Click **New** → **PostgreSQL**
3. Fill in:
   - Name: `pos-database`
   - Region: Choose closest to you
   - Plan: Free
4. Click **Create Database**
5. After creation, copy the **Internal Database URL** (used for the backend service)

### Step 3: Deploy Backend (Spring Boot)

1. Click **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `pos-backend`
   - **Root Directory**: `pos-system/backend`
   - **Environment**: Docker
   - **Plan**: Free
4. Add Environment Variables:
   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | (Internal Database URL from Step 2) |
   | `DB_USERNAME` | (Database username from Render) |
   | `DB_PASSWORD` | (Database password from Render) |
   | `SPRING_PROFILES_ACTIVE` | `prod` |
5. Click **Create Web Service**
6. Wait for deployment. Copy the backend URL (e.g., `https://pos-backend.onrender.com`)

### Step 4: Deploy Frontend (React)

**Option A: Web Service (Docker)**

1. Click **New** → **Web Service**
2. Connect the same GitHub repository
3. Configure:
   - **Name**: `pos-frontend`
   - **Root Directory**: `pos-system/frontend`
   - **Environment**: Docker
   - **Plan**: Free
4. Add Environment Variables:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://pos-backend.onrender.com` |
5. Click **Create Web Service**

**Option B: Static Site**

1. Click **New** → **Static Site**
2. Connect the same GitHub repository
3. Configure:
   - **Name**: `pos-frontend`
   - **Root Directory**: `pos-system/frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variables:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://pos-backend.onrender.com` |
5. Click **Create Static Site**

Note: With Static Site, API calls go directly from browser to backend. Ensure the backend CORS config allows the frontend Render URL.

### Step 5: Test the Deployment

1. Open the frontend URL in your browser
2. The POS page loads with products from the seeded data
3. Add items to cart, process a sale, and check the Dashboard

---

## Environment Variables Reference

### Backend

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | H2 in-memory | Full JDBC URL for PostgreSQL |
| `DB_USERNAME` | `sa` | Database username |
| `DB_PASSWORD` | `` | Database password |
| `SPRING_PROFILES_ACTIVE` | `default` | Set to `prod` for PostgreSQL |

### Frontend

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `` (empty, uses proxy) | Backend API base URL |

---

## Local Docker Testing

Test the Docker builds locally before pushing to Render:

```bash
# Build and run backend
cd pos-system/backend
docker build -t pos-backend .
docker run -p 8080:8080 pos-backend

# Build and run frontend (in another terminal)
cd pos-system/frontend
docker build --build-arg VITE_API_URL=http://localhost:8080 -t pos-frontend .
docker run -p 80:80 pos-frontend
```

Visit http://localhost to see the app.
