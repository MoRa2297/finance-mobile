<!--
  Fill out all relevant sections.
  Unchecked boxes don't block the merge but serve as reminders.
-->

## 📝 Description

<!-- What does this PR do? Why is it needed? Link to issue if any (Closes #123). -->

## 🎯 Type of change

- [ ] 🚀 `feat` — new feature
- [ ] 🐛 `fix` — bug fix
- [ ] ♻️ `refactor` — refactoring with no functional changes
- [ ] 🎨 `style` — formatting, no logic
- [ ] ⚡ `perf` — performance
- [ ] ✅ `test` — adding/updating tests
- [ ] 📝 `docs` — docs only
- [ ] 🔧 `chore` — build, deps, config
- [ ] 💥 **BREAKING CHANGE**

## 🔍 How to test

<!--
  Steps to reproduce/verify. e.g.:
  1. `npm run start`
  2. Open Expo Go / iOS Simulator
  3. Navigate to Transactions, tap "+", verify new form field appears
-->

## 📱 Visual changes

<!--
  Before/after screenshots or screen recordings for UI changes.
  For navigation/flow changes, describe the new flow in words.
-->

- [ ] No visual changes
- [ ] Screenshots below:

| Before | After |
|--------|-------|
|        |       |

## 🧠 State / Data

- [ ] Touches `useAuthStore`
- [ ] Touches `useDataStore`
- [ ] Adds/changes React Query queries or mutations
- [ ] Changes AsyncStorage usage
- [ ] No state/data impact

## ✅ Checklist

- [ ] Tested on iOS Simulator
- [ ] `npm run lint:check` passes
- [ ] `npm run typecheck` passes
- [ ] `npx expo-doctor` passes
- [ ] No `console.log` left in the code
- [ ] New env variables added to `.env.example` + `app.config.ts`
- [ ] No hardcoded API URLs — use `ENV.API_URL`

## 📦 Build impact

- [ ] No new native dependencies
- [ ] Adds new Expo config plugin (specify: ___)
- [ ] Adds native module (requires dev client rebuild)

## 🚀 Release notes

<!--
  If this PR should produce a user-facing note in the next release,
  write a one-line summary here. Otherwise write "internal only".
-->
