# SN Client

A modern desktop application built with React, TypeScript, and Tauri, following Clean Architecture principles.

## 🚀 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Desktop Framework**: Tauri 2.0
- **State Management**: Redux Toolkit with Redux Persist
- **Authentication**: Keycloak
- **Routing**: React Router v6
- **Styling**: TailwindCSS with Pico CSS
- **Build Tool**: Vite
- **Package Manager**: npm

## 📁 Project Structure

The project follows Clean Architecture principles with the following directory structure:

```
src/
├── application/     # Application business logic and use cases
├── domain/         # Core business entities and interfaces
├── infrastructure/ # External services and implementations
├── presentation/   # UI components and pages
└── common/         # Shared utilities and types
```

### Architecture Overview

1. **Domain Layer** (`/domain`)
   - Contains core business entities and interfaces
   - Defines the business rules and models
   - Independent of other layers

2. **Application Layer** (`/application`)
   - Implements use cases and business logic
   - Orchestrates the flow of data
   - Contains Redux store configuration and slices

3. **Infrastructure Layer** (`/infrastructure`)
   - Implements external services (Keycloak, API calls)
   - Handles data persistence and external communication
   - Contains service implementations

4. **Presentation Layer** (`/presentation`)
   - UI components and pages
   - React components and routing
   - Handles user interactions

## 🛠️ Setup and Development

1. **Prerequisites**
   - Node.js (v18 or higher)
   - Rust (for Tauri development)
   - Keycloak server (for authentication)

2. **Installation**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env_example` to `.env`
   - Configure Keycloak settings in `.env`

4. **Development**
   ```bash
   npm run dev
   ```

5. **Build**
   ```bash
   npm run build
   ```

## 🔐 Authentication

The application uses Keycloak for authentication. The authentication flow is handled by the `@react-keycloak/web` package, with configuration in the infrastructure layer.

## 📦 Dependencies

- **UI Components**: Heroicons, Pico CSS
- **State Management**: Redux Toolkit, Redux Persist
- **API Communication**: Axios
- **Media**: React Player
- **Time Handling**: React Timeago

## 🧪 Testing

(Add testing information here)

## 📝 Documentation

Additional documentation can be found in the `docs/` directory.

## 🤝 Contributing

(Add contribution guidelines here)

## 📄 License

(Add license information here)

```shell
npm run tauri dev
```

## storybook

install
```shell
npx storybook@latest init
```

run
```shell
npm run storybook
```