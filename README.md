# React + Vite

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
