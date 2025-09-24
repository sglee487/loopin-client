# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (runs on port 11420)
- **Build project**: `npm run build` (TypeScript compilation + Vite build)
- **Preview production build**: `npm run preview`
- **Tauri commands**: `npm run tauri` (for desktop app development)

## Architecture Overview

This is a **Tauri desktop application** built with React, TypeScript, and Tailwind CSS. The app follows a feature-based architecture with Redux Toolkit for state management.

### Key Technologies
- **Desktop Framework**: Tauri 2.0 (Rust backend + web frontend)
- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: Redux Toolkit with RTK Query for API calls
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM

### Project Structure
```
src/
├── app/           # Redux store configuration
├── features/      # Feature modules (auth, player, playlists, theme)
├── components/    # Reusable UI components
├── router/        # Routing configuration
├── hooks/         # Custom React hooks
├── lib/           # Utilities and configurations
└── types/         # TypeScript type definitions
```

### Feature Modules
The app is organized around these main features:
- **auth**: Authentication with Keycloak integration
- **player**: YouTube video player with playback controls
- **playlists**: Playlist management and display
- **streams**: Live streaming with HLS support and quality selection
- **theme**: Dark/light theme switching

### State Management Pattern
- Uses Redux Toolkit with feature-based slices
- RTK Query for API calls (playlistsApi, authApi, playSessionApi, streamsApi)
- Player volume persisted to localStorage
- Store configured in `src/app/store.ts`

### Path Aliases
TypeScript and Vite are configured with `@/` alias pointing to `src/`:
```typescript
"@/*": ["*"]
"@/features/*": ["features/*"]
"@/components/*": ["components/*"]
// etc.
```

### Component Architecture
- Common reusable components in `components/`
- Feature-specific components within each feature module
- Layout components handle overall app structure
- AuthGate component wraps the entire app for authentication

### Development Notes
- Vite dev server runs on port 1420 (configured for Tauri)
- TypeScript strict mode enabled with path mapping
- Uses React 18 features and modern React patterns
- Tailwind CSS for utility-first styling approach
- HLS.js integration for live streaming (requires streaming server at localhost:59103 for API, localhost:59000 for HLS streams)