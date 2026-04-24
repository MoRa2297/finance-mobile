# Finance Mobile

[![CI](https://github.com/MoRa2297/finance-mobile/actions/workflows/ci.yml/badge.svg)](https://github.com/MoRa2297/finance-mobile/actions/workflows/ci.yml)
[![EAS Release](https://github.com/MoRa2297/finance-mobile/actions/workflows/eas-release.yml/badge.svg)](https://github.com/MoRa2297/finance-mobile/actions/workflows/eas-release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Expo](https://img.shields.io/badge/Expo-SDK_51-000020.svg?logo=expo)](https://expo.dev)

iOS app for personal finance management. Track transactions, categories, bank/card accounts, budgets, and recurring
transactions.

Built as a portfolio project — open source, MIT licensed. Companion
to [finance-api](https://github.com/MoRa2297/finance-api).

## Tech stack

- **Framework:** [Expo](https://expo.dev/) + [Expo Router](https://docs.expo.dev/router/introduction/) (file-based
  routing)
- **UI:** [UI Kitten](https://akveo.github.io/react-native-ui-kitten/)
- **State:** [Zustand](https://zustand-demo.pmnd.rs/) (client state) + [React Query](https://tanstack.com/query) (server
  state)
- **Forms:** [Formik](https://formik.org/)
- **Language:** TypeScript (strict mode)
- **Build:** [EAS Build](https://docs.expo.dev/eas/)
- **Platform:** iOS (Android support planned)

## Quick start

### Prerequisites

- Node.js 20.x
- npm 10+
- Xcode with iOS Simulator (macOS required)
- [Expo Go](https://expo.dev/go) app on a physical device (optional)

### Setup

```bash
# Clone and install
git clone https://github.com/MoRa2297/finance-mobile.git
cd finance-mobile
npm install

# Copy env template
cp .env.example .env.development

# Start Metro bundler
npm run start

# In another terminal, run on iOS Simulator
npm run ios
```

By default the app connects to `http://localhost:3000` (the [finance-api](https://github.com/MoRa2297/finance-api)
running locally). Edit `.env.development` to point to a different backend.

## Scripts

| Script               | Description                  |
|----------------------|------------------------------|
| `npm run start`      | Start Metro bundler          |
| `npm run ios`        | Run on iOS Simulator         |
| `npm run lint`       | Lint with auto-fix           |
| `npm run lint:check` | Lint without fix (CI mode)   |
| `npm run format`     | Format with Prettier         |
| `npm run typecheck`  | `tsc --noEmit`               |
| `npm test`           | Unit tests                   |
| `npx expo-doctor`    | Check for Expo config issues |

## Project structure

```
app/                     # Expo Router file-based routes
├── (auth)/              # Login, register
├── (tabs)/              # Main tab navigation
└── _layout.tsx

src/
├── api/                 # API client
├── components/          # Reusable UI components
├── constants/           # env, colors, config
├── hooks/               # Custom hooks
├── stores/              # Zustand stores (useAuthStore, useDataStore)
├── types/               # Shared TS types
└── utils/               # Pure helpers
```

## Environment

Uses `EXPO_PUBLIC_*` env vars (publicly embedded in the bundle — never put secrets here).

```typescript
// src/constants/env.ts
export const ENV = {
    API_URL: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000',
    IS_PRODUCTION: process.env.EXPO_PUBLIC_ENV === 'production',
};
```

## CI/CD

- **PRs to `main`/`release`**: full CI (lint, typecheck, tests, expo-doctor)
- **PRs to `release`**: triggers EAS preview build (internal distribution)
- **Tag `v*.*.*` on `release`**: triggers EAS production build + GitHub Release (+ TestFlight submit when enabled)
- **Security updates**: handled via Dependabot (Expo-related deps must be upgraded manually with `npx expo install`)

Release flow:

```bash
git checkout release && git pull
git merge main
git push

npm version patch           # bumps version + creates vX.Y.Z tag
git push --follow-tags      # triggers production build
```

Full setup details in [CICD.md](./CICD.md).

## Documentation

- [CICD.md](./CICD.md) — CI/CD setup and workflows
- [CONTRIBUTING.md](./CONTRIBUTING.md) — how to contribute
- [SECURITY.md](./SECURITY.md) — how to report vulnerabilities
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) — community guidelines

## Contributing

External contributions are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).

All PRs require approval from [@MoRa2297](https://github.com/MoRa2297).

## License

[MIT](./LICENSE) © 2026 Manuel Morandin ([@MoRa2297](https://github.com/MoRa2297))
