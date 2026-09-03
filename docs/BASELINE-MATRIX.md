# Baseline Matrix

## Source

- Source repository: `plan-and-eat-customer-mobile`
- Baseline strategy: controlled clone with domain replacement
- Target repository: `plan-and-eat-delivery`

## Architecture Invariants

- Runtime: Expo SDK 54 with Expo Router.
- Language: TypeScript with strict mode.
- Structure: `src/app`, `src/features`, `src/components/ui`, `src/lib`, `src/translations`.
- State and data: Zustand for app state, TanStack Query for server state.
- Validation: Zod for schemas and environment validation.
- Storage and auth: MMKV and keychain-based token helpers from `src/lib/auth`.

## Tooling Invariants

- Package manager: `pnpm`.
- Linting: flat ESLint config (`eslint.config.mjs`).
- Commit standard: `@commitlint/config-conventional`.
- Git hooks: Husky + lint-staged.
- Quality scripts:
  - `pnpm lint`
  - `pnpm type-check`
  - `pnpm test`
  - `pnpm check-all`

## Allowed Differences

- Feature domain and route map.
- App identity values (`name`, `bundle id`, `package`, `scheme`, EAS project id).
- Translations and docs content linked to product domain.
