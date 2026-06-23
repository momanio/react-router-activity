# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Build:** `npm run build`
- **Develop (watch mode):** `npm run dev`
- **Run all tests:** `npm run test`
- **Run tests in watch mode:** `npm run test:watch`
- **Type check:** `npm run typecheck`

## Architecture and Structure

This repository contains a React library, `react-router-activity`, designed to enhance React Router 7+ by preserving route state across navigation, leveraging React 19.2's native `<Activity>` component.

The core components are:

-   **`src/ActivityOutlet.tsx`**: This component acts as a drop-in replacement for `react-router-dom`'s `<Outlet />`. It's responsible for managing the lifecycle of route components, keeping a configurable maximum number of previously visited routes alive in memory. It utilizes React 19.2's `unstable_Activity` feature for efficient visibility management.
-   **`src/useOnActivity.ts`**: A custom React hook that allows route components to react to their active/inactive visibility states, enabling actions like pausing/resuming data fetching or animations when a route is hidden or shown.
-   **`src/ActivityContext.ts`**: Provides a React Context for internal activity management, allowing components within the activity tree to communicate and coordinate their states.

The build process is configured with `tsup` (`tsup.config.ts`), generating both ESM and CommonJS outputs along with TypeScript declaration files. Testing is handled by `vitest` (`vitest.config.ts`), with tests located in the `tests/` directory and utilizing a `jsdom` environment. TypeScript (`tsconfig.json`) is used for type safety across the project.
