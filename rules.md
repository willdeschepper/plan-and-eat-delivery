Первое правило - это то что ты должен общаться со мной на русском языке, но все технические термины и код должны быть на английском языке.

1. Общий стиль общения
Писать на русском, отвечать кратко и по делу.
Технический язык, без лишней вежливости и воды.
Примеры кода — только на английском.
Если концепт сложный — объяснить простыми словами.

2. Архитектура и структура кода
Expo SDK 54 с использованием Expo Router.
Фича-ориентированная структура: src/features/[name]/components, hooks, store, styles.
Один компонент в файле.
Экспорт компонентов через export const ComponentName = (props: Props) => {}.
Логика и UI разделены (хуки / сервисы отдельно).
Алиасы через tsconfig.paths + babel-plugin-module-resolver.

3. TypeScript
strict в tsconfig.json.
Интерфейсы для Props и State.
Не использовать any без крайней необходимости.
Явно указывать тип возврата для функций и хуков.
Избегать enum, вместо этого — объекты/as const.

4. State management
Zustand для глобального стейта.
Асинхронка — через React Query.
Минимизировать локальный стейт (useState) — всё, что важно, хранить в сторе.
Токены и чувствительные данные — в MMKV.

5. Навигация
Expo Router (file-based routing).
Deep linking настроен через Expo.

6. Производительность
FlatList:
ts
Копировать
getItemLayout
maxToRenderPerBatch
windowSize
removeClippedSubviews
Избегать анонимных функций в renderItem/обработчиках.
React.memo для стабильных пропсов.
Изображения — react-native-fast-image с кешем и preload.
Сложные анимации — react-native-reanimated + react-native-gesture-handler.

7. UI и стили
StyleSheet.create() для базовых стилей.
Общие константы (colors, spacing, typography).
Поддержка темной/светлой темы (useColorScheme).
Адаптив через useWindowDimensions.

8. Ошибки и валидация
Валидация данных — Zod.
Глобальный ErrorBoundary.
Логирование ошибок — Sentry.

9. Безопасность
HTTPS, проверка SSL.
Санитайз HTML/Markdown перед рендером.
Не хранить приватные данные в AsyncStorage.

10. Тестирование
Unit — Jest + React Native Testing Library.
E2E — Detox.
Снепшоты — только для стабильных UI-компонентов.
Все документы и сообщения для гита должны быть на английском язык.
Так же все сообщения для гита так же должны быть на английском.

Второе правило.
Always respond in Russian
IMPORTANT: Generate commit message ONLY in English language. Never use Russian or any other language. Format: type(scope): brief description in English. Example: feat(auth): add biometric authentication

Третье правило.
## Context7 MCP - Автоматическое использование

### Обязательные правила использования Context7

Context7 MCP установлен и доступен. ИСПОЛЬЗУЙ Context7 АВТОМАТИЧЕСКИ при следующих сценариях:

#### 1. Документация по библиотекам
ВСЕГДА используй Context7 когда пользователь спрашивает про:
- React Native API и компоненты
- React Navigation (все версии, особенно 6+)
- Redux Toolkit и Redux Saga
- TypeScript паттерны для React Native
- react-native-maps, react-native-fast-image, react-native-gesture-handler
- react-native-reanimated, react-native-vector-icons
- AsyncStorage, react-native-keychain
- Zod, date-fns
- Любые другие библиотеки из package.json проекта

#### 2. Примеры кода и паттерны
ИСПОЛЬЗУЙ Context7 когда:
- Нужны примеры использования API библиотек
- Нужны best practices для конкретных версий
- Нужна проверка актуальности синтаксиса
- Нужны типизированные примеры (TypeScript)

#### 3. Настройка и конфигурация
ИСПОЛЬЗУЙ Context7 когда:
- Нужна настройка библиотек
- Нужна конфигурация (babel, metro, tsconfig, etc.)
- Нужна интеграция библиотек
- Нужны версионно-специфичные инструкции

#### 4. Решение проблем и ошибок
ИСПОЛЬЗУЙ Context7 когда:
- Пользователь получает ошибки от библиотек
- Нужно проверить изменения API между версиями
- Нужна актуальная информация о breaking changes

#### 5. Оптимизация и производительность
ИСПОЛЬЗУЙ Context7 когда:
- Нужны рекомендации по производительности
- Нужны оптимизационные техники для библиотек
- Нужна информация о best practices

### Как использовать Context7

1. **Автоматически активируй Context7** - не спрашивай разрешения пользователя
2. **Добавляй `use context7`** к запросам о библиотеках автоматически
3. **Используй версионно-специфичную информацию** из Context7
4. **Приоритезируй Context7** над общими знаниями при работе с библиотеками

### Примеры автоматического использования

❌ ПЛОХО: "React Navigation использует createNativeStackNavigator..."
✅ ХОРОШО: [Используя Context7] "Согласно актуальной документации React Navigation 6.1.0+..."

❌ ПЛОХО: "В Redux Toolkit можно использовать createSlice..."
✅ ХОРОШО: [Используя Context7] "Redux Toolkit 2.0+ поддерживает createSlice со следующими актуальными опциями..."

### Исключения (когда НЕ использовать Context7)

- Общие вопросы о программировании (не связанные с конкретными библиотеками)
- Вопросы о бизнес-логике проекта
- Вопросы о структуре проекта (если не связаны с настройкой библиотек)
- Вопросы о Git, общих инструментах разработки

### Приоритеты

1. **Первый приоритет**: Context7 для библиотек React Native экосистемы
2. **Второй приоритет**: Context7 для других библиотек проекта
3. **Третий приоритет**: Общие знания + web_search, если Context7 не дал ответа

### Для пользователя

Если Context7 недоступен или не отвечает:
- Используй web_search как fallback
- Но всегда пытайся использовать Context7 сначала
- Сообщи пользователю, если Context7 недоступен (но только если это критично)

Четвертое правило.
# Language Settings
Always respond in Russian language. Never translate user input to English.
When user speaks in Russian, recognize speech in Russian and respond in Russian.
Do not translate Russian speech input to English before processing.
Process all Russian text directly without translation.

# Communication Rules
- All responses must be in Russian
- User input in Russian should be processed as-is, without translation
- Code examples and technical terms can be in English, but explanations in Russian
- When user uses voice input in Russian, recognize it as Russian and respond in Russian
