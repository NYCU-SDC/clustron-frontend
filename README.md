[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/NYCU-SDC/clustron-frontend)

# Clustron Frontend

A React-based web application for HPC (High-Performance Computing) cluster management at National Yang Ming Chiao Tung University (NYCU).

## Overview

Clustron Frontend provides a comprehensive web portal for managing computational groups, submitting jobs to SLURM-based clusters, configuring SSH keys, and administering role-based access control.

### Key Features

- **Group Management**: Create and manage computational groups with hierarchical roles (Owner, TA, Student, Auditor)
- **Job Submission**: Submit and monitor batch jobs on HPC clusters via SLURM integration
- **User Settings**: Configure profiles, SSH keys, and login method bindings
- **Administration**: Configure role access levels and system-wide permissions
- **OAuth Authentication**: Support for NYCU Portal and Google login
- **Internationalization**: Full support for English and Traditional Chinese

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.0.0 | UI framework |
| TypeScript | 5.7.2 | Type-safe development |
| Vite | 6.3.1 | Build tool and dev server |
| Tailwind CSS | 4.1.13 | Styling |
| React Router | 7.5.1 | Client-side routing |
| TanStack Query | 5.76.2 | Server state management |
| Radix UI | Various | Accessible UI primitives |
| react-hook-form + zod | 7.56.1 / 3.24.3 | Form validation |
| react-i18next | 15.4.1 | Internationalization |

## Getting Started

### Prerequisites

- Node.js 23 or higher [10](#0-9) 
- npm (comes with Node.js)

### Installation

```
# Clone the repository
git clone https://github.com/NYCU-SDC/clustron-frontend.git
cd clustron-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
[11](#0-10) 

The application will be available at `http://localhost:5173`. [12](#0-11) 

### Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with hot module replacement |
| `npm run build` | TypeScript compilation + production build |
| `npm run lint` | Run ESLint code analysis |
| `npm run preview` | Preview production build locally | [11](#0-10) 

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── group/          # Group management components
│   ├── setting/        # Settings components
│   └── ui/             # Base UI components (Radix)
├── pages/              # Route-level pages
│   ├── layouts/        # Layout wrappers
│   ├── group/          # Group pages
│   ├── job/            # Job pages
│   ├── setting/        # Settings pages
│   └── admin/          # Admin pages
├── locales/            # i18n translations (en.json, zh.json)
├── lib/                # Utilities and API requests
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── App.tsx             # Route configuration
└── main.tsx            # Application entry point
```
[2](#0-1) 

## Deployment

The project uses GitHub Actions for CI/CD with three deployment environments:

- **Snapshot**: Ephemeral PR preview environments at `pr-N.clustron.sdc.nycu.club` [13](#0-12) 
- **Dev**: Persistent development environment at `dev.clustron.sdc.nycu.club` [14](#0-13) 
- **Stage**: Staging environment deployed on version tags [15](#0-14) 

Docker images are published to `nycusdc/clustron-frontend` on Docker Hub. [16](#0-15) 

### CI/CD Pipeline

Each deployment runs through quality gates:
1. **Lint**: ESLint code analysis [17](#0-16) 
2. **Format**: Prettier formatting check [17](#0-16) 
3. **Build**: TypeScript compilation and Vite build [18](#0-17) 
4. **Docker**: Build and push container image [19](#0-18) 
5. **Deploy**: Trigger n8n webhook for orchestration [20](#0-19) 

## Code Quality

The project enforces code quality through:

- **ESLint**: Linting with React, TypeScript, and TanStack Query rules [21](#0-20) 
- **Prettier**: Automatic code formatting [22](#0-21) 
- **Husky**: Pre-commit hooks for automated formatting [23](#0-22) 
- **TypeScript**: Strict type checking [24](#0-23) 

## API Configuration

The development server proxies API requests to the backend: [25](#0-24) 

```typescript
proxy: {
  "^/api/.*": {
    target: "https://api.dev.clustron.sdc.nycu.club",
    changeOrigin: true,
  },
}
```

## Contributing

1. Create a feature branch from `main`
2. Make your changes with appropriate tests
3. Ensure all quality checks pass (`npm run lint`, `npm run build`)
4. Submit a pull request - a snapshot environment will be automatically deployed
5. After review and merge, changes deploy to the dev environment [26](#0-25) 

## License

This project is maintained by NYCU Software Development Club (NYCU-SDC).<cite />

## Notes

The application uses a sophisticated multi-environment deployment strategy with n8n webhook orchestration for domain management and Discord notifications. [20](#0-19)  The frontend communicates with a separate backend API for all data operations. [27](#0-26)  The project emphasizes accessibility through Radix UI primitives and maintains comprehensive internationalization support. [28](#0-27) 

Wiki pages you might want to explore:
- [Overview (NYCU-SDC/clustron-frontend)](/wiki/NYCU-SDC/clustron-frontend#1)
- [Development and Deployment (NYCU-SDC/clustron-frontend)](/wiki/NYCU-SDC/clustron-frontend#7)
- [Clustron Backend](/wiki/NYCU-SDC/clustron-backend)
