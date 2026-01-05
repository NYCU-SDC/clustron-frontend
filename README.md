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

| Technology            | Purpose                   |
| --------------------- | ------------------------- |
| React                 | UI framework              |
| TypeScript            | Type-safe development     |
| Vite                  | Build tool and dev server |
| Tailwind CSS          | Styling                   |
| React Router          | Client-side routing       |
| TanStack Query        | Server state management   |
| ShadCN                | Component library         |
| react-hook-form + zod | Form validation           |
| react-i18next         | Internationalization      |

## Getting Started

### Prerequisites

- Node.js 23 or higher
- npm (comes with Node.js)

### Installation

```shell
# Clone the repository
git clone https://github.com/NYCU-SDC/clustron-frontend.git
cd clustron-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`.

### Development Scripts

| Command           | Description                                       |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Start Vite dev server with hot module replacement |
| `npm run build`   | TypeScript compilation + production build         |
| `npm run lint`    | Run ESLint code analysis                          |
| `npm run preview` | Preview production build locally                  |

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

## Deployment

The project uses GitHub Actions for CI/CD with three deployment environments:

- **Snapshot**: Ephemeral PR preview environments at `pr-N.clustron.sdc.nycu.club`
- **Dev**: Persistent development environment at `dev.clustron.sdc.nycu.club`
- **Stage**: Staging environment deployed on version tags

Docker images are published to `nycusdc/clustron-frontend` on Docker Hub.

### CI/CD Pipeline

Each deployment runs through quality gates:

1. **Lint**: ESLint code analysis
2. **Format**: Prettier formatting check
3. **Build**: TypeScript compilation and Vite build
4. **Docker**: Build and push container image
5. **Deploy**: Trigger n8n webhook for orchestration

## Code Quality

The project enforces code quality through:

- **ESLint**: Linting with React, TypeScript, and TanStack Query rules
- **Prettier**: Automatic code formatting
- **Husky**: Pre-commit hooks for automated formatting
- **TypeScript**: Strict type checking

## API Configuration

The backend server URL is configured through environment variable.
`.env`

```
VITE_BACKEND_BASE_URL=https://api.dev.clustron.sdc.nycu.club
```

## Contributing

1. Create a feature branch from `main`
2. Make your changes with appropriate tests
3. Ensure all quality checks pass (`npm run lint`, `npm run build`)
4. Submit a pull request - a snapshot environment will be automatically deployed
5. After review and merge, changes deploy to the dev environment

## License

This project is maintained by NYCU Software Development Club (NYCU-SDC).

## Notes

The application uses a sophisticated multi-environment deployment strategy with n8n webhook orchestration for domain management and Discord notifications. The frontend communicates with a separate backend API for all data operations. The project emphasizes accessibility through Radix UI primitives and maintains comprehensive internationalization support.

Pages you might want to explore:

- [NYCU Software Development Club](https://sdc.nycu.club)
- [NYCU Software Development Club GitHub](https://github.com/NYCU-SDC)
- [Clustron Backend](https://deepwiki.com/NYCU-SDC/clustron-backend/)
