# Insta-CV Frontend

A modern React application for creating and managing professional resumes with AI-powered features.

## Features

- Resume builder with multiple templates
- PDF generation with server-side rendering
- GitHub integration for skills and projects
- Job matching and recommendations
- User authentication with OAuth support

## Configuration

The application uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```env
# Frontend Configuration
VITE_FRONTEND_BASE_URL=https://your-frontend-domain.com

# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8080

# PDF Backend Configuration
VITE_PDF_BACKEND_URL=http://localhost:3001

# OAuth Configuration (usually same as API_BASE_URL)
VITE_OAUTH_BASE_URL=http://localhost:8080
```

### Default Values

If environment variables are not set, the application will use these defaults:
- `VITE_FRONTEND_BASE_URL`: `window.location.origin` (current domain)
- `VITE_API_BASE_URL`: `http://localhost:8080`
- `VITE_PDF_BACKEND_URL`: `http://localhost:3001`
- `VITE_OAUTH_BASE_URL`: `http://localhost:8080`

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Dependencies

This project uses:
- React 19 with Vite
- Tailwind CSS for styling
- Zustand for state management
- React Router for navigation
- Axios for API calls
- Lucide React for icons

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Insta-CV Frontend

A modern resume builder application built with React and Vite.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=https://instacv-backend-production.up.railway.app

# PDF Backend Configuration
VITE_PDF_BACKEND_URL=http://localhost:3001

# Frontend URL for production deployment
VITE_FRONTEND_URL=https://instacv-frontend-production.up.railway.app

# App Version
VITE_APP_VERSION=0.1.0-beta
```

### Production Deployment

For production deployment, make sure to set:

- `VITE_FRONTEND_URL`: The public URL of your deployed frontend application
- `VITE_PDF_BACKEND_URL`: The URL of your deployed PDF backend service

## Development

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm run preview
```

## PDF Generation

The application uses a separate PDF backend service for generating PDFs. Make sure the PDF backend service is running and accessible at the configured URL.

For local development, the PDF backend should be running on `http://localhost:3001`.
