# Contributing to Finance Mobile

Thanks for your interest in contributing! This project is primarily maintained
by [@MoRa2297](https://github.com/MoRa2297), but external contributions are welcome.

> **Note:** All PRs require approval from [@MoRa2297](https://github.com/MoRa2297) before merging. CI passing is
> necessary but not sufficient.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Reporting bugs](#reporting-bugs)
- [Requesting features](#requesting-features)
- [Development setup](#development-setup)
- [Project structure](#project-structure)
- [Coding standards](#coding-standards)
- [Commit conventions](#commit-conventions)
- [Pull request process](#pull-request-process)
- [Testing](#testing)
- [Security issues](#security-issues)

## Code of Conduct

This project adheres to a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you're expected to uphold it.

## Reporting bugs

1. **Search existing issues** to avoid duplicates
2. **Verify on the latest `main`** — the bug might already be fixed
3. **Use the bug report template**

Include reproduction steps, iOS version, device (or simulator), app version/commit, logs, and screenshots.

## Requesting features

1. **Open a discussion first** if the feature is large or uncertain
2. **Use the feature request template** for concrete proposals
3. Wait for maintainer feedback before starting large work

## Development setup

### Prerequisites

- Node.js 20.x
- npm 10+
- Xcode (for iOS Simulator) — macOS only
- [Expo Go](https://expo.dev/go) app on a physical device (optional, for quick testing)

### Setup

```bash
# Fork and clone
git clone https://github.com/<your-username>/finance-mobile.git
cd finance-mobile

# Install dependencies
npm install

# Copy env file
cp .env.example .env.development

# Start Metro
npm run start

# In another terminal, run on iOS
npm run ios
```

The app connects to the local API at `http://localhost:3000` by default (configured via `EXPO_PUBLIC_API_URL`).

If you want to test against the production API, copy `.env.production.example` → `.env.production` and start with
`EXPO_PUBLIC_ENV=production npm run start`.

### Keeping your fork in sync

```bash
git remote add upstream https://github.com/MoRa2297/finance-mobile.git
git fetch upstream
git checkout main
git merge upstream/main
```

## Project structure

```
finance-mobile/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/
│   ├── CODEOWNERS
│   └── pull_request_template.md
├── app/                     # Expo Router file-based routes
│   ├── (auth)/              # Auth routes (login, register)
│   ├── (tabs)/              # Main tab navigation
│   └── _layout.tsx
├── src/
│   ├── api/                 # API client (axios/fetch wrappers)
│   ├── components/          # Reusable UI components
│   ├── constants/           # env, colors, config constants
│   ├── hooks/               # Custom React hooks
│   ├── screens/             # Screen components (if not using app/)
│   ├── services/            # External service integrations
│   ├── stores/              # Zustand stores (useAuthStore, useDataStore)
│   ├── types/               # Shared TypeScript types
│   └── utils/               # Pure utilities
├── assets/                  # Images, fonts, icons
├── app.config.ts            # Expo config (dynamic)
├── eas.json                 # EAS build profiles
└── tsconfig.json
```

### Where to put what

- **UI components** reused across screens → `src/components/`
- **Screen-specific components** → co-located with the screen
- **Data fetching** → React Query hooks in `src/hooks/`, API calls in `src/api/`
- **Client state** (auth, UI state) → Zustand stores in `src/stores/`
- **Server state** → React Query (never duplicate server data in Zustand)
- **Pure helpers** (formatting, validation) → `src/utils/`
- **Constants** (API URL, feature flags) → `src/constants/` via `ENV` object

## Coding standards

### TypeScript

- Strict mode — no `any` without a comment explaining why
- Prefer `type` for unions, `interface` for object shapes
- All components must have explicit prop types
- Use path aliases (configured in `tsconfig.json`)

### Style

- **Formatter:** Prettier
- **Linter:** ESLint
- Run `npm run format` and `npm run lint` before committing
- CI will reject PRs that fail `npm run lint:check` or `npm run format:check`

### Naming

- Files: `kebab-case.tsx` for components, `camelCase.ts` for utilities
- Components: `PascalCase`
- Hooks: `useXxx` (e.g. `useTransactions`, `useBankAccounts`)
- Zustand stores: `useXxxStore` (e.g. `useAuthStore`)
- Constants: `SCREAMING_SNAKE_CASE`

### Components

- Use functional components + hooks — no class components
- UI Kitten components for base primitives; custom components only when UI Kitten doesn't fit
- Keep components small — if a file exceeds ~200 lines, split it
- Extract repeated JSX into reusable components

### State management

- **Zustand** for client state (auth, UI state, filters)
- **React Query** for server state (transactions, categories, accounts) — never store server data in Zustand
- **Formik** for forms — handles validation via `validationSchema`
- Never call APIs from components directly — use React Query hooks

### API & network

- All API calls go through the client wrapper — never `fetch` directly from components
- Read `API_URL` from `ENV.API_URL` — **never hardcode**
- Handle errors gracefully — show a toast/alert, don't crash the UI
- Loading states must be visible to the user

### Expo

- Use `expo install` (or `npx expo install`) for Expo SDK deps — not `npm install`
- Don't upgrade `expo`, `react-native`, or `react` manually — use `npx expo install --fix`
- New native modules require a development build rebuild

## Commit conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>
```

### Types

| Type       | Use for                                       |
|------------|-----------------------------------------------|
| `feat`     | New feature                                   |
| `fix`      | Bug fix                                       |
| `refactor` | Code change without new features or bug fixes |
| `perf`     | Performance improvement                       |
| `test`     | Adding/updating tests                         |
| `docs`     | Documentation only                            |
| `chore`    | Build, deps, tooling                          |
| `ci`       | CI/CD changes                                 |
| `style`    | Formatting (no logic change)                  |

### Examples

```
feat(transaction): add swipe-to-delete on list items
fix(auth): handle 401 response by redirecting to login
refactor(stores): split useDataStore into feature-specific stores
perf(transaction-list): memoize FlatList items
chore(deps): bump expo to SDK 51 via expo install
```

## Pull request process

1. **Branch from `main`** — never from `release`
2. **Descriptive branch name**: `feat/swipe-delete`, `fix/jwt-expiry`
3. **One PR = one concern** — large PRs will be asked to split
4. **Include screenshots** for UI changes (before/after)
5. **Write tests** for non-UI logic
6. **Fill in the PR template**
7. **Ensure CI passes** — lint, typecheck, tests, expo-doctor
8. **Request review** from `@MoRa2297` (auto-assigned via CODEOWNERS)

### PR review timeline

- First response: within 1 week
- Stale PRs (no response for 30+ days) may be closed

## Testing

```bash
npm test                    # unit tests (Jest)
npm run test:watch          # watch mode
```

### Writing tests

- **Unit tests** for utilities, hooks, and store logic — co-locate as `*.test.ts`
- **Hooks** can be tested with `@testing-library/react-hooks`
- **Components** can be tested with `@testing-library/react-native` — focus on behavior, not implementation
- **Don't test** third-party libraries (UI Kitten, React Query internals)

## Security issues

**Do not open public issues for security vulnerabilities.** Follow the process in [SECURITY.md](./SECURITY.md).

## Questions

For general questions, open a [Discussion](https://github.com/MoRa2297/finance-mobile/discussions) rather than an issue.

Thanks for contributing! 🙏
