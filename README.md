# GMS Dashboard

Gym Management System - Frontend Dashboard built with React, TypeScript, Vite, and TanStack Router.

## 🚀 Tech Stack

- **React 19.2.0** - UI library
- **TypeScript** - Type safety
- **Vite 7.1.7** - Build tool
- **TanStack Router** - Type-safe routing
- **Tailwind CSS 4.0.6** - Styling
- **shadcn/ui** - UI components
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Recharts** - Data visualization
- **date-fns** - Date utilities

## 📋 Prerequisites

- **Node.js** 20.19+ or 22.12+
- **npm** or **yarn**
- **Docker Desktop** (for backend services)
- **GitHub Personal Access Token** with `read:packages` permission

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd gms-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and update with your values:

```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

Edit `.env` file with your configuration (all values are already set for local development).

### 4. Setup Backend Services (Docker)

#### One-time: Login to GitHub Container Registry

```bash
docker login ghcr.io
```

Use your GitHub username and Personal Access Token with `read:packages` permission as password.

#### Pull Latest Backend Image

```bash
docker compose -f ./docker-compose-dev.yaml pull
```

#### Start All Backend Services

```bash
docker compose -f ./docker-compose-dev.yaml up -d
```

This will start:
- **MySQL Database** (port 3306)
- **phpMyAdmin** (port 6060)
- **NATS Message Broker** (ports 4222, 8222)
- **MinIO Object Storage** (ports 9000, 9001)
- **Spring Boot Backend** (port 8080)

#### Check Status / View Logs

```bash
# Check status
docker compose -f ./docker-compose-dev.yaml ps

# View backend logs
docker compose -f ./docker-compose-dev.yaml logs -f backend

# View all logs
docker compose -f ./docker-compose-dev.yaml logs -f
```

### 5. Start Frontend Development Server

```bash
npm run dev
```

The frontend will be available at: **http://localhost:3000**

## 🌐 Access Points

Once everything is running, you can access:

- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **phpMyAdmin**: http://localhost:6060
- **MinIO Console**: http://localhost:9001
- **NATS Monitor**: http://localhost:8222

## 🛑 Stop Services

### Stop Backend Services

```bash
docker compose -f ./docker-compose-dev.yaml down
```

### Stop Frontend

Press `Ctrl+C` in the terminal running `npm run dev`

## 📁 Project Structure

```
gms-dashboard/
├── src/
│   ├── routes/              # TanStack Router routes
│   │   ├── dashboard/
│   │   │   ├── admin/       # Admin section (Overview, Expenses, etc.)
│   │   │   └── marketing/   # Marketing section (Assets, Membership, Branch)
│   ├── components/          # Reusable components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── common/          # Common components (Header, Aside)
│   │   ├── asset-components/    # Asset tracking dialogs
│   │   └── dashboard-components/ # Dashboard metric cards
│   ├── lib/                 # Utility functions
│   │   ├── utils.ts         # General utilities
│   │   ├── asset-utils.ts   # Asset tracking utilities
│   │   └── dashboard-utils.ts # Dashboard metrics utilities
│   └── styles.css           # Global styles
├── docker-compose-dev.yaml  # Backend services configuration
├── .env                     # Environment variables (not in git)
├── .env.example             # Environment template
└── vite.config.ts           # Vite configuration with API proxy
```

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test
```

## 🐳 Docker Commands Reference

```bash
# Pull latest images
docker compose -f ./docker-compose-dev.yaml pull

# Start services in background
docker compose -f ./docker-compose-dev.yaml up -d

# Start services with logs
docker compose -f ./docker-compose-dev.yaml up

# Stop services
docker compose -f ./docker-compose-dev.yaml down

# Stop and remove volumes (clean slate)
docker compose -f ./docker-compose-dev.yaml down -v

# View logs
docker compose -f ./docker-compose-dev.yaml logs -f [service-name]

# Restart a specific service
docker compose -f ./docker-compose-dev.yaml restart [service-name]
```

## 🔗 API Integration

The frontend connects to the backend API through Vite's proxy configuration:

- API requests to `/api/*` are automatically proxied to `http://localhost:8080/api/*`
- Base URL is configured in `.env` as `VITE_API_BASE_URL`
- No CORS issues during development

## 🚨 Troubleshooting

### Backend services won't start

1. Make sure Docker Desktop is running
2. Check if ports are already in use (8080, 3306, 6060, etc.)
3. Try stopping and removing all containers: `docker compose -f ./docker-compose-dev.yaml down -v`
4. Pull latest images again: `docker compose -f ./docker-compose-dev.yaml pull`

### Frontend can't connect to backend

1. Verify backend is running: `docker compose -f ./docker-compose-dev.yaml ps`
2. Check backend logs: `docker compose -f ./docker-compose-dev.yaml logs -f backend`
3. Verify `.env` has correct `VITE_API_BASE_URL=http://localhost:8080/`
4. Restart frontend dev server

### Permission denied when pulling Docker images

1. Login to GHCR: `docker login ghcr.io`
2. Use your GitHub username
3. Use Personal Access Token (not password) with `read:packages` permission
4. Create token at: https://github.com/settings/tokens

## 📝 Development Workflow

1. **Start backend services** (one time per session):
   ```bash
   docker compose -f ./docker-compose-dev.yaml up -d
   ```

2. **Start frontend**:
   ```bash
   npm run dev
   ```

3. **Make changes** - Frontend hot-reloads automatically

4. **Stop services when done**:
   ```bash
   docker compose -f ./docker-compose-dev.yaml down
   ```

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Create a Pull Request
5. Wait for code review and approval
6. Merge after approval

## 📄 License

[Add your license information here]
