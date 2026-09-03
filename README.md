# Plan & Eat Courier

React Native courier application used as a technical study and modernization case for mobile delivery workflows.

## What the app demonstrates

- Courier authentication with access/refresh token coordination.
- Credentials stored in the platform Keychain, including migration from legacy MMKV storage.
- Delivery assignments, pickup progress and delivery completion.
- Maps, location permissions and delivery destinations.
- Network-aware queries and refresh after connectivity or foreground restoration.
- Persistent completion queue for connectivity loss and uncertain responses.
- Stable idempotency key reused when a completion command is retried.
- Expo Router, development builds, notifications, localization and light/dark themes.

## Reliability model for delivery completion

The client persists a completion command in MMKV **before** trying the network request. Each command receives a stable `operationId`, sent as the `Idempotency-Key` header. If the device is offline, the request times out, or the server returns a retryable error, the command stays in the queue. It is replayed after authentication and connectivity are restored.

A delivery is marked as confirmed in the UI only after the API confirms the command. A lost response leaves it in `awaiting_confirmation`, so the same operation identity is reused during reconciliation.

### Required backend contract

Client-side keys do not provide end-to-end idempotency by themselves. The API must scope and persist the `Idempotency-Key`, associate it with the request payload, and return the original result for a duplicate request. Until the server contract is verified, this repository demonstrates the client side of the design, not an exactly-once guarantee.

## Architecture

| Area | Implementation |
| --- | --- |
| Navigation | Expo Router with typed routes |
| Server state | TanStack Query and query invalidation |
| Local UI state | Zustand |
| Durable local data | MMKV |
| Credentials | Native Keychain |
| Connectivity | NetInfo with a shared debounced status |
| API | Axios with coordinated token refresh |
| Lists and media | FlashList and Expo Image |
| Native UX | Reanimated, Moti, maps and notifications |
| Quality | TypeScript, ESLint, Jest, Testing Library and Maestro |

## Main flow

1. The courier signs in and the token pair is persisted in Keychain.
2. Active assignments are loaded through TanStack Query.
3. The courier records pickup quantities for the stop.
4. On completion, the app persists the command and attempts the API call.
5. A confirmed response removes the command and refreshes active assignments.
6. An offline or uncertain result remains queued for a later replay with the same identity.

## Technology stack

- React Native 0.81 and React 19
- Expo 54, Expo Router and Expo Updates
- TypeScript
- TanStack Query and Zustand
- Axios
- MMKV and React Native Keychain
- NetInfo
- Reanimated, Worklets and Moti
- Jest, Testing Library and Maestro

See [`package.json`](./package.json) for the exact dependency versions.

## Local development

### Requirements

- Node.js LTS
- pnpm 10
- Android Studio or Xcode for native development

```bash
git clone https://github.com/willdeschepper/plan-and-eat-delivery.git
cd plan-and-eat-delivery
pnpm install
```

Configure at least one API URL:

```bash
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_API_URL_DEVELOPMENT=https://api.example.com
EXPO_PUBLIC_API_URL_PRODUCTION=https://api.example.com
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS=
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID=
```

Then run:

```bash
pnpm start
pnpm ios
pnpm android
```

## EAS and OTA configuration

No fake Expo project identifier is committed. Without `EAS_PROJECT_ID`, Expo Updates is disabled in `app.config.ts` and local development remains available.

To connect your own Expo project:

1. Authenticate with Expo and run `eas init`.
2. Obtain the UUID with `eas project:info`.
3. Define `EAS_PROJECT_ID` in the relevant EAS environment or local shell.
4. Re-run `expo config --type public` and confirm the generated Updates URL.

The generated URL follows `https://u.expo.dev/<EAS_PROJECT_ID>`. The project ID is configuration, not a secret, but keeping it environment-driven prevents this portfolio fork from pointing to somebody else's project.

## Quality checks

```bash
pnpm type-check
pnpm lint
pnpm test
pnpm check-all
```

The completion queue includes tests for offline persistence, stable-key replay and uncertain responses. CI or a local run should still be used to verify the current environment before release.

## Origin and attribution

This repository was **studied, adapted and modernized** by [Wiliam De Schepper](https://github.com/willdeschepper). It must not be presented as an application authored from zero.

The starting points were:

- [Obytes React Native template](https://github.com/obytes/react-native-template-obytes), distributed under the MIT License.
- [MirMohsun/plan-and-eat-courier-mobile](https://github.com/MirMohsun/plan-and-eat-courier-mobile), used as the application base. No explicit license was found in that repository when this attribution was written.

Wiliam's work in this fork includes dependency and configuration updates, authentication hardening, network/lifecycle behavior, API integration, delivery UI evolution, and the persistent completion/reconciliation flow. Git history remains the source of truth for individual changes.

See [`NOTICE`](./NOTICE) and [`LICENSE`](./LICENSE) for the scope of the licensing statements.
