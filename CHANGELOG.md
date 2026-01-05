
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2026-01-05

### Added

- Project scaffolded with Vite (TypeScript + React) and basic `src/main.tsx` entry.
- File-based routing using TanStack Router (generated route tree in `src/routeTree.gen.ts`).
- Tailwind CSS configured and integrated across the app.
- shadcn UI integrated; UI primitives imported into `src/components/ui`.
- Utility helpers and hooks added (`src/components/hooks/use-mobile.ts`, `src/lib/utils.ts`).
- Public assets added: `public/manifest.json`, `public/robots.txt`.

### Components (shadcn UI)

- accordion
- alert-dialog
- alert
- aspect-ratio
- avatar
- badge
- breadcrumb
- button-group
- button
- calendar
- card
- carousel
- chart
- checkbox
- collapsible
- command
- context-menu
- dialog
- drawer
- dropdown-menu
- empty
- field
- form
- hover-card
- input-group
- input-otp
- input
- item
- kbd
- label
- menubar
- navigation-menu
- pagination
- popover
- progress
- radio-group
- resizable
- scroll-area
- select
- separator
- sheet
- sidebar
- skeleton
- slider
- sonner
- spinner
- switch
- table
- tabs
- textarea
- toggle-group
- toggle
- tooltip

### Notes

- This release adds the foundation for the UI system (Tailwind + shadcn) and a file-based routing setup. See the listed files and `src/components/ui` for the component implementations.


