# 🌊 SchemaFlow - Visual Database Design Tool

A modern, collaborative database modeling application for MySQL and MongoDB with real-time team collaboration, authentication, and cloud persistence.

[![Status](https://img.shields.io/badge/Status-Production_Ready-green)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.1.0-blue)](https://github.com)

---

## ✨ Features

### 🎨 Visual Diagramming
- **Drag & Drop Interface** - Intuitive ReactFlow-based canvas.
- **MySQL & MongoDB Support** - Specialized nodes for tables and collections.
- **Field-Level Relationships** - Visual mapping with custom edge labels.
- **Undo/Redo** - Full history management with keyboard shortcuts.
- **Theme Support** - Default, Dark, Ocean, and Sunset themes.

### 👥 Project-Level Collaboration
- **Project Sharing** - Invite collaborators via email to specific projects.
- **Role-Based Access** - 
    - **OWNER**: Full control.
    - **EDITOR**: Can edit diagrams.
    - **VIEWER**: Read-only access.
- **Team Workspaces** - Manage groups of users (legacy).
- **Mobile-Responsive** - 
    - **Mobile Bottom Sheet** for properties.
    - **Drawer Menu** for mobile toolbars.
    - **Touch-Friendly** interface.

### 🔐 Authentication & Security
- **JWT Authentication** - Secure token-based auth.
- **Protected Routes** - All API endpoints require authentication.
- **Session Persistence** - Zustand + localStorage integration.

### 🏗️ Dual Database Architecture
- **MongoDB Atlas** - Stores User, Team, and Authentication data.
- **PostgreSQL (Neon)** - Stores Project data, Versions, and Collaborators for relational integrity.
- **Optimized Performance** - Bulk fetching and smart caching.

### 🔄 Import & Export
- **Database Import** - Connect to existing MySQL or MongoDB databases.
- **Automatic Schema Detection** - Introspect tables, fields, and relationships.
- **SQL/JSON Export** - Generate CREATE TABLE statements or Mongoose schemas.
- **Auto-Save & Versioning** - Cloud auto-save every 2s with 5-min snapshots.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas URL
- PostgreSQL URL (e.g., Neon.tech)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd moon-modler

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
npx prisma generate --schema=prisma/schema-postgres.prisma  # Postgres Client
npx prisma generate --schema=prisma/schema.prisma           # Mongo Client
```

### Environment Setup

**Backend `.env`:**
```env
# MongoDB (Users/Auth)
DATABASE_URL="mongodb+srv://..."

# PostgreSQL (Projects/Versions)
POSTGRES_URL="postgresql://..."

JWT_SECRET="your-super-secret-jwt-key"
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL="http://localhost:3002/api/v1"
```

### Running the Application

**Terminal 1 - Backend (WebSocket + API):**
```bash
cd backend
npm run dev:socket
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
moon-modler/
├── frontend/                # Next.js 14 App Router
│   ├── src/
│   │   ├── app/            # Pages (Dashboard, Editor, Login)
│   │   ├── features/       # Feature Modules (Editor, Projects, Auth)
│   │   │   ├── editor/     # ReactFlow Canvas & Mobile Components
│   │   │   ├── projects/   # Project Management & Sharing
│   │   │   └── teams/      # Team Management
│   │   ├── components/     # UI Library (Radix/Shadcn)
│   │   └── lib/            # Utilities
│
├── backend/                 # Node.js + Next.js Custom Server
│   ├── src/
│   │   ├── services/       # Core Logic (ProjectsService, TeamsService)
│   │   ├── controllers/    # API Handlers
│   │   └── common/         # Validators & Helpers
│   ├── prisma/
│   │   ├── schema.prisma            # MongoDB Schema (Users/Teams)
│   │   └── schema-postgres.prisma   # PostgreSQL Schema (Projects)
```

---

## 📚 Documentation

- **[IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)** - Detailed technical status.
- **[USER_FLOWS.md](USER_FLOWS.md)** - Feature matrix and flows.
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - How to test collaboration.
- **[CANVAS_USAGE.md](CANVAS_USAGE.md)** - Canvas architecture.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Next.js, ReactFlow, PostgreSQL, and MongoDB**
