# Client — The Minimal API Workspace

Client is a high-performance, browser-based API testing environment designed for speed and simplicity. It provides a "zero-friction" workflow where you can start testing APIs instantly without an account, while offering cloud synchronization and organization for power users.

![Landing Page Preview](https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&q=80&w=2070)

## ✨ Features

- **🚀 Instant Testing**: Start sending GET, POST, PUT, DELETE, and PATCH requests directly from your browser.
- **🛡️ Proxy Execution**: Bypass CORS restrictions automatically. All requests are routed through a secure backend proxy.
- **📁 Finder-Style Organization**: Drag and drop requests into folders (Collections) with a smooth, macOS-inspired interface.
- **💾 Persistence Everywhere**: 
  - **Guest Mode**: All your tabs and folders are persisted in `localStorage`. Refresh without losing a single bit of work.
  - **Cloud Sync**: Sign in with Google or GitHub to sync your collections across devices.
- **⌨️ Power User Workflows**:
  - Double-click to rename any resource.
  - Context menus for quick management.
  - Keyboard shortcut (`D`) for instant theme switching.
- **🎨 Premium UI**: Built with a focus on aesthetics, featuring glassmorphism, smooth animations, and a polished dark mode.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Runtime**: [Bun](https://bun.sh/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [ShadCN UI](https://ui.shadcn.com/)
- **Icons**: [Tabler Icons](https://tabler-icons.io/)
- **State**: [Zustand](https://zustand-demo.pmnd.rs/) with Persistence Middleware
- **Database**: [PostgreSQL (Neon)](https://neon.tech/) + [Drizzle ORM](https://orm.drizzle.team/)
- **Auth**: [Better Auth](https://better-auth.com/) (Google & GitHub)
- **Client**: [Axios](https://axios-http.com/)

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd client
bun install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL=your_postgres_url
BETTER_AUTH_SECRET=your_auth_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Social Auth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

### 3. Database Migration

```bash
bun db:push
```

### 4. Run Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📁 Repository Structure

- `app/(client)`: The main API testing workbench.
- `app/(marketing)`: High-conversion landing page.
- `app/api/proxy`: Server-side proxy handling for CORS bypass.
- `components/features`: Modular components for Sidebar, RequestBuilder, and ResponseViewer.
- `store/useStore.ts`: Centralized Zustand state with persistence logic.
- `lib/db`: Schema and database configuration.

## 📄 License

Built with ❤️ by [Kishore](https://github.com/kishore-sv).
