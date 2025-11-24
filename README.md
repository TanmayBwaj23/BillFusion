# BillFusion - Unified Billing & Reporting Platform

A React + Vite application for unified billing and reporting with support for clients, vendors, and employees.

## ⚙️ Environment Configuration

Before running the application, you need to configure environment variables:

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update the `.env` file** with your configuration (see [ENV_SETUP.md](ENV_SETUP.md) for details)

3. **Required variables:**
   - `VITE_API_BASE_URL` - Backend API URL (default: `http://localhost:8000`)

For detailed information about all available environment variables, see [ENV_SETUP.md](ENV_SETUP.md).

## 🚀 Quick Start with Docker

**Prerequisites:** Only Docker and Docker Compose need to be installed on your machine.

### Development Setup

1. **Start the application:**
   ```bash
   docker-compose up --build
   ```
   
2. **Access the application:**
   - Open your browser and navigate to `http://localhost:5173`
   - The application supports hot reloading - changes to your code will automatically refresh the browser

3. **Stop the application:**
   ```bash
   docker-compose down
   ```

### Useful Docker Commands

- **Rebuild and start:** `docker-compose up --build`
- **Run in background:** `docker-compose up -d`
- **View logs:** `docker-compose logs -f billfusion-frontend`
- **Access container shell:** `docker-compose exec billfusion-frontend sh`

## 📋 Features

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
