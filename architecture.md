# Unified Architecture Governance

## Purpose

This document defines the mandatory architectural contract for both mobile apps:

- `plan-and-eat-customer-mobile`
- `plan-and-eat-courier-mobile`

The projects must remain structurally and technically aligned. Business features are allowed to differ.

## Mandatory Shared Structure

- `src/app`: Expo Router routes and layouts.
- `src/features/<feature>`: feature modules.
- `src/components/ui`: shared UI primitives.
- `src/lib`: platform, api, auth, i18n, storage and cross-feature hooks.
- `src/translations`: i18n resources.

Each feature should follow this skeleton:

- `components`
- `hooks`
- `store`
- `api`
- `styles`

## Mandatory Shared Stack

- Expo SDK 54 and Expo Router.
- TypeScript strict mode.
- Zustand for global store modules.
- TanStack React Query for server state.
- Zod for runtime schema validation.
- MMKV for local persisted app data.

## Mandatory Shared Tooling

- `pnpm` as package manager.
- ESLint flat config (`eslint.config.mjs`).
- Husky + lint-staged.
- Commitlint conventional commits.
- Required scripts:
  - `lint`
  - `type-check`
  - `test`
  - `check-all`

## Environment and Release Rules

- Environment model must be Zod-validated in `env.ts`.
- Public app env vars use `EXPO_PUBLIC_*`.
- EAS profiles keep the same shape across both apps (`development`, `preview`, `production`).

## Allowed Project-Level Differences

- Product domain routes and feature names.
- Translation copy.
- Brand assets.
- App identity:
  - app name
  - bundle id
  - package id
  - URL scheme
  - EAS project id

## Drift Prevention Checklist

Before merge, verify:

1. No cross-domain leftovers from the other app.
2. Feature structure still follows the required skeleton.
3. Shared tooling files remain equivalent unless explicitly approved.
4. `pnpm check-all` passes.
