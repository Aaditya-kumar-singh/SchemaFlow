# 🚀 FREE DEPLOYMENT GUIDE (SchemaFlow)

This project uses a split deployment strategy to maximize the Free Tier usage of modern platforms.

- **Frontend**: Cloudflare Pages (Static Hosting)
- **Backend**: Render / Railway (Docker/Node Hosting)
- **Database**: Neon (Postgres) + MongoDB Atlas

---

## 🏗️ Phase 1: Deploy Backend (Render)

1. **Create Account**: Go to [Render.com](https://render.com/) and sign up.
2. **New Web Service**: Click "New +" -> "Web Service".
3. **Connect GitHub**: Select your `SchemaFlow` repository.
4. **Configuration**:
   - **Root Directory**: `backend` (Important!)
   - **Runtime**: `Docker` (Recommended) or `Node`.
   - **Build Command**: `npm install` (if Node)
   - **Start Command**: `npm start` (if Node)
   - **Instance Type**: Free
5. **Environment Variables**:
   Add the following variables in the Render Dashboard:
   - `DATABASE_URL`: Your Neon Postgres Connection String
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A random string
   - `NODE_ENV`: `production`
   - `PORT`: `3000`
6. **Deploy**: Click "Create Web Service".
7. **Copy URL**: Once live, copy your backend URL (e.g., `https://schemaflow-backend.onrender.com`).

---

## 🎨 Phase 2: Deploy Frontend (Cloudflare Pages)

1. **Create Project**: Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) -> Workers & Pages.
2. **Connect Git**: Click "Create Application" -> "Pages" -> "Connect to Git".
3. **Select Repo**: Choose `SchemaFlow`.
4. **Build Settings**:
   - **Framework Preset**: Next.js (Static HTML Export)
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `out` (We configured this in next.config.ts)
   - **Root Directory**: `frontend` (Important!)
5. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: Paste your Render Backend URL + `/api/v1`
     - Example: `https://schemaflow-backend.onrender.com/api/v1`
6. **Deploy**: Click "Save and Deploy".

---

## 🔍 Verification

1. Go to your new Cloudflare Pages URL.
2. Open the Network tab in Developer Tools.
3. Try to login or fetch projects.
4. Ensure requests are going to `your-render-url.com/api/v1/...` and not `localhost`.
