# Hybrid Deployment Guide: Cloudflare Frontend + Elastic Beanstalk Backend

This guide details how to set up a **Hybrid Architecture** where you run your frontend on **Cloudflare Pages** (for performance/Edge) while **keeping your existing Elastic Beanstalk deployment** fully active.

## 📊 Architecture (Hybrid)

| Feature | Current (EB Only) | New (Hybrid) |
| :--- | :--- | :--- |
| **Frontend 1** | Runs on EB (Docker) | **Remains Active** (accessible via EB URL) |
| **Frontend 2** | N/A | **Runs on Cloudflare Pages** (accessible via `*.pages.dev`) |
| **Backend** | Runs on EB (Docker) | **Shared by BOTH Frontends** |
| **Database** | Postgres/Mongo (EB/RDS) | Shared Source of Truth |

**Benefits:**
*   Zero downtime migration.
*   You can test Cloudflare without breaking the existing site.
*   Once happy, you can simply stop using the EB frontend.

---

## � Step 1: Backend Configuration (Done)

I have already updated `backend/src/main.ts` to enable **CORS**. This allows the new Cloudflare frontend to talk to your existing backend safely.

*   **Action:** You just need to deploy the latest backend code to EB (via your standard `git push`).

---

## 🛠 Step 2: Cloudflare Setup (No Docker Required)

You will host the frontend directly from GitHub using Cloudflare's build system.

### 2.1 Prepare the Code
1.  **Install Adapter**: Run the following in your local terminal:
    ```bash
    cd frontend
    npm install --save-dev @cloudflare/next-on-pages
    ```
2.  **Commit & Push**: Push this change to GitHub.

### 2.2 Create Project on Cloudflare
1.  Log in to **Cloudflare Dashboard**.
2.  Go to **Compute (Workers) & Pages** > **Create Application** > **Pages** > **Connect to Git**.
3.  Select your `SchemaFlow` repository.
4.  **Configure Build Settings**:
    *   **Project Name**: `schemaflow-frontend`
    *   **Production Branch**: `main`
    *   **Framework Preset**: `Next.js`
    *   **Build Command**: `npx @cloudflare/next-on-pages`
    *   **Output Directory**: `.vercel/output/static`
    *   **Root Directory**: `frontend` (Important! Click "Path" or "Root Directory" to set this).

### 2.3 Environment Variables (Crucial)
In the Cloudflare "Environment variables" section (during setup or in Settings):

| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://<your-eb-env>.elasticbeanstalk.com/api/v1` | **Must include `/api/v1`** (or your actual socket path base). |
| `NODE_VERSION` | `20` | Ensure it matches your dev environment. |

*Note:* Find your EB URL in AWS Console. It usually looks like `schemaflow-production.us-east-1.elasticbeanstalk.com`.

---

## � Step 3: Deploy & Verify

1.  Click **Save and Deploy**.
2.  Cloudflare will clone your repo, run the build inside `frontend` folder, and deploy.
3.  **Test**: Open the new `https://schemaflow-frontend.pages.dev` URL.
    *   Try Logging in.
    *   Check if real-time collaboration works (Socket.IO).
    *   Since CORS is enabled on EB, it should work immediately!

---

## 🧹 Step 4: Finalizing (Optional)

If `backend/src/main.ts` changes are deployed and Cloudflare is working:
*   You now have two working frontends.
*   You can turn off the Docker frontend later if you want to save resources, or keep it as a backup.

```typescript
// In backend/src/main.ts

const server = createServer(async (req, res) => {
    // --------------------------------------------------------
    // [ADD] Manual CORS Headers for API Routes
    // --------------------------------------------------------
    const allowedOrigins = ['https://your-frontend.pages.dev', 'http://localhost:3000'];
    const origin = req.headers.origin;
    
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        // Optional: Allow all during dev/migration, easier but less secure
        // res.setHeader('Access-Control-Allow-Origin', '*'); 
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle Preflight
    if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
        return;
    }
    // --------------------------------------------------------

    try {
        const parsedUrl = parse(req.url!, true);
        await handle(req, res, parsedUrl);
    } catch (err) {
        // ...
    }
});

// Update Socket.IO CORS as well
const io = new Server(server, {
    // ...
    cors: {
        origin: ["https://your-frontend.pages.dev", "http://localhost:3000"], // Add your Cloudflare URL
        methods: ["GET", "POST"],
        credentials: true
    }
});
```

### 1.2 Re-deploy Backend
Push these changes to GitHub. Your existing `deploy.yml` will deploy this to Elastic Beanstalk. Ensure `JWT_SECRET` is set in EB Environment Properties.

---

## 🛠 Step 2: Configure Frontend (Cloudflare Adapter)

Cloudflare Pages runs differently than Docker. We need to adapt the build compatibility.

### 2.1 Install Cloudflare Adapter (Recommended)
Since you are using Next.js 16, the best path for dynamic features (if any) is `@cloudflare/next-on-pages`.

```bash
cd frontend
npm install --save-dev @cloudflare/next-on-pages
```

### 2.2 Update `next.config.ts` (Example)
Cloudflare usually works fine with default or standalone, but mostly you just need to ensure you aren't relying on Node.js-specific native modules (like `fs`) in the frontend code.

### 2.3 Configure Environment Variables
In your local code and Cloudflare Dashboard, update the API URL to point to your EB specific URL (NOT localhost).

**File:** `.env.production` (create if missing in frontend)
```env
# Point to your running Elastic Beanstalk Backend URL
# IMPORTANT: No trailing slash
NEXT_PUBLIC_API_URL=https://your-schemaflow-backend.ap-southeast-2.elasticbeanstalk.com
```

### 2.4 Update API Clients
Find where you make API calls (e.g., `axios.ts` or `authStore.ts`). Ensure they use the variable.

```typescript
// src/lib/api/axios.ts
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || '/api'; // Fallback to /api for proxying in dev

export const api = axios.create({
    baseURL,
    withCredentials: true, // Important for cookies across domains
});
```

**Socket.IO Client:**
```typescript
// src/features/editor/hooks/useCollaboration.ts
const socket = io(process.env.NEXT_PUBLIC_API_URL || '', {
    path: '/api/socket/io',
    withCredentials: true
});
```

---

## 🚢 Step 3: Deploy Frontend to Cloudflare

1.  Go to **Cloudflare Dashboard** > **Workers & Pages** > **Create Application** > **Pages** > **Connect to Git**.
2.  Select your repository (`SchemaFlow`).
3.  **Build Settings:**
    *   **Framework Preset:** Next.js
    *   **Build Command:** `npx @cloudflare/next-on-pages` (if using adapter) OR `npm run build` (standard)
    *   **Output Directory:** `.vercel/output/static` (for adapter) or `out` (for export)
    *   *Note:* If using standard build, try the default Next.js preset first.
4.  **Environment Variables (in Cloudflare):**
    *   `NEXT_PUBLIC_API_URL`: `https://<your-eb-url>.elasticbeanstalk.com`

---

## 🧹 Step 4: Cleanup (Optional)

Once Cloudflare is working:
1.  **Modify `deploy.yml`**: Comment out or remove the "Deploy Frontend" steps to stop pushing the frontend container to EB.
2.  **Scale Down**: You might be able to reduce the EC2 instance size since it's doing 50% less work (no SSR/Frontend serving).

