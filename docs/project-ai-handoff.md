# AI Handoff Document: `plan-and-eat-delivery`

Ниже — структурированный бриф, который можно напрямую отдавать другому ИИ как контекст проекта.

---

## 1) Метаданные проекта

- **Repo:** `plan-and-eat-delivery`
- **Тип:** мобильное приложение курьера (React Native + Expo)
- **OS у текущей среды:** macOS (`darwin 25.3.0`)
- **Пакетный менеджер:** `pnpm` (`packageManager: pnpm@10.12.3`)
- **Текущее состояние Git:** рабочее дерево грязное, неотслеживаемые директории `android/` и `.expo/`
- **Источник шаблона:** Obytes RN template (указано в `README.md` и `claude.md`)

---

## 2) Назначение проекта (по коду)

Проект — courier-приложение для Plan&Eat с базовыми потоками:

- онбординг;
- аутентификация (login/sign-up/OTP/forgot password);
- tab-навигация внутри авторизованной зоны;
- заготовки под `orders`, `delivery`, `route-map`, `profile`;
- `settings` с языком/темой/logout.

Факт: функциональность auth/infra заметно глубже, чем бизнес-экраны доставки (часть экранов пока placeholders).

---

## 3) Реальный стек (фактический, из `package.json`)

- **Core:** `expo ~54`, `react-native 0.81.5`, `react 19.1.0`
- **Routing:** `expo-router ~6`
- **State:** `zustand`
- **Server state:** `@tanstack/react-query` + `react-query-kit`
- **Forms/validation:** `@tanstack/react-form` + `zod`
- **Networking:** `axios`
- **Storage/Security:** `react-native-mmkv`, `react-native-keychain`
- **Maps/location:** `react-native-maps`, `expo-location`
- **UI/animation:** `uniwind`, `tailwind-variants`, `react-native-reanimated`, `@gorhom/bottom-sheet`, `moti`
- **i18n:** `i18next`, `react-i18next`, `expo-localization`
- **Tests:** `jest`, `jest-expo`, `@testing-library/react-native`
- **Lint/tooling:** ESLint flat config (`@antfu/eslint-config`), Husky, lint-staged, commitlint, TypeScript strict

---

## 4) Архитектура и структура

### Топ-уровень

- Основные конфиги: `app.config.ts`, `env.ts`, `eas.json`, `babel.config.js`, `metro.config.js`, `tsconfig.json`
- Основной код: `src/`
- Нативная Android-папка уже сгенерирована: `android/` (untracked сейчас)

### `src/` структура

- `src/app` — маршруты Expo Router (file-based routing)
- `src/features` — feature-модули (`auth`, `orders`, `delivery`, `route-map`, `profile`, `settings`, `onboarding`)
- `src/components/ui` — переиспользуемые UI-примитивы
- `src/lib` — API, auth, storage, i18n, network, hooks
- `src/translations` — `en`, `ru`, `az`

### Навигация

- Root stack в `src/app/_layout.tsx`
- Внутри `(app)` используется `expo-router/ui` tabs в `src/app/(app)/_layout.tsx`
- Защита входа:
  - если first launch -> `/onboarding`
  - если signOut -> `/login`
  - default в app -> `/orders`

---

## 5) Auth, API, session lifecycle

### Auth flow

- Bootstrap при старте: `runAuthBootstrap()` в `src/lib/auth/bootstrap-auth.ts`
  - миграция legacy token из MMKV
  - чтение token pair из Keychain
  - `restoreSession` или `signOut`

### Token storage strategy

- **Основное хранилище токена:** Keychain (`src/lib/auth/token-keychain.ts`)
- **MMKV:** используется как app storage + cleanup legacy token key
- `use-auth-store` (`src/lib/hooks/use-auth-store.tsx`) хранит `status` (`idle|signOut|signIn`) и token в Zustand

### API client

- `axios` клиент в `src/lib/api/client.tsx`
- `baseURL` берется из `Env.EXPO_PUBLIC_API_URL`
- request interceptor добавляет Bearer token
- response interceptor:
  - ловит `401`
  - делает refresh `/api/customers/refresh/`
  - повторяет исходный запрос
  - при фейле refresh -> `signOut`

### Auth endpoints (факт по `src/features/auth/api.ts`)

- `/api/customers/register/`
- `/api/customers/verify/`
- `/api/customers/resend-otp/`
- `/api/customers/login/`
- `/api/customers/refresh/`
- `/api/customers/forgot-password/`
- `/api/customers/verify-forgot-password/`
- `/api/customers/set-password/`
- `/api/customers/logout/`

---

## 6) Environment и release модель

### `env.ts`

- Zod-схема с валидацией env
- среды: `development | preview | production`
- URL выбирается между `EXPO_PUBLIC_API_URL_DEVELOPMENT` и `EXPO_PUBLIC_API_URL_PRODUCTION`
- при `STRICT_ENV_VALIDATION=1` — ошибка при невалидных env
- в runtime экспортируется объект `Env`

### `app.config.ts`

- Expo config динамически из `Env`
- `newArchEnabled: true`
- iOS/Android Google Maps API keys через env
- permissions Android: coarse/fine location
- plugins: `expo-splash-screen`, `expo-font`, `expo-localization`, `expo-router`, `app-icon-badge`, `react-native-edge-to-edge`

### `eas.json`

- профили: `development`, `preview`, `production`, `simulator`
- каналы updates: `preview`, `production`
- production Android buildType: `app-bundle`; preview: `apk`

---

## 7) Network/offline стратегия

- `network-status` (`src/lib/network/network-status.ts`):
  - online/offline детекция через `@react-native-community/netinfo`
  - debounce 500ms для устранения дребезга сети
- `APIProvider` (`src/lib/api/provider.tsx`):
  - связывает onlineManager React Query с netinfo
  - invalidate queries при восстановлении сети
  - refetch active queries при возврате app из background (с debounce)

---

## 8) Текущее состояние функциональности

- **Готово/проработано:**
  - auth flow, token lifecycle, refresh logic
  - env + release pipeline
  - i18n и theme foundation
  - сетевой/offline слой
  - базовая routing-архитектура

- **Черновое/placeholder:**
  - `orders`, `delivery`, `route-map`, `profile` экраны пока с заглушками
  - API слои `orders`/`profile` содержат только scope-константы

---

## 9) Локализация

- Языки: `en`, `ru`, `az` (`src/lib/i18n/resources.ts`)
- автоопределение языка из locale с fallback в `en`
- RTL пока фактически не покрыт (комментарий в `src/lib/i18n/index.tsx`)

---

## 10) Качество и тесты

- Jest + RTL configured (`jest.config.js`)
- есть unit tests в `src/lib` и `src/features/auth` + некоторые UI tests
- `check-all` = lint + type-check + translations lint + tests
- ESLint строгий, но с осознанными послаблениями для RN/практики проекта

---

## 11) Важные несоответствия/риски

- В пользовательских правилах в чате встречается противоречие:
  - часть инструкций говорит "React Native CLI без Expo";
  - фактический проект и внутренние правила (`rules.md`, `claude.md`) — **Expo SDK 54 + Expo Router**.
- В git сейчас untracked `android/` и `.expo/`:
  - `.expo/` обычно не коммитят;
  - `android/` нужно решить стратегически: managed-only vs prebuild-committed workflow.
- В `app.config.ts` стоит placeholder `EAS_PROJECT_ID` (`courier-project-id-replace-me`) — если не заменить, могут быть проблемы с updates/build pipeline.

---

## 12) Что передать другому ИИ как цель работы

Использовать этот проект как:

- базу для полноценного courier-приложения Plan&Eat;
- точку интеграции backend API курьера (orders, active delivery, route map, profile);
- платформу для production mobile CI/CD (EAS);
- шаблон для синхронного развития двух приложений (customer/courier) с общей архитектурой.

---

## 13) Готовый prompt-блок для другого ИИ

```text
Project: plan-and-eat-delivery

Stack:
- Expo SDK 54, React Native 0.81.5, React 19
- Expo Router (file-based routes)
- TypeScript strict
- Zustand (auth/global local state)
- React Query + react-query-kit (server state)
- Axios client with token refresh interceptor
- Zod env validation + TanStack Form
- MMKV + Keychain token persistence
- i18next (en/ru/az)
- Jest + RTL

Architecture:
- src/app routes/layouts
- src/features/{auth,orders,delivery,route-map,profile,settings,onboarding}
- src/components/ui shared primitives
- src/lib for api/auth/network/storage/i18n/hooks

Current status:
- Auth flow is implemented (login/register/otp/forgot + refresh token + bootstrap)
- Offline/network handling is implemented
- Orders, Delivery, Route-map, Profile are mostly placeholder screens
- Git tree has untracked android/ and .expo/

Key files:
- app config: app.config.ts
- env model: env.ts
- root nav/providers: src/app/_layout.tsx
- app tabs/auth guard: src/app/(app)/_layout.tsx
- auth store: src/lib/hooks/use-auth-store.tsx
- api client: src/lib/api/client.tsx
- query provider: src/lib/api/provider.tsx
- auth endpoints: src/features/auth/api.ts
- translations: src/translations/{en,ru,az}.json

Primary objective:
Implement business-complete courier flows for orders, active deliveries, profile, and map/navigation while preserving existing architecture and tooling conventions.
```
