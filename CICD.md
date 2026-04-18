# CI/CD Setup — Finance Mobile

## Flow

```
PR to main ──▶ CI (lint, typecheck, test, expo-doctor)
   │
main (push) ──▶ CI
   │
   └─ merge into release ──▶ CI ──▶ EAS preview build (iOS internal)
                                       │
                                       └─ tag v*.*.* ──▶ EAS production build
                                                           │
                                                           ├─ GitHub Release with changelog
                                                           └─ TestFlight submit (when enabled)
```

## What CI does (`.github/workflows/ci.yml`)

Runs on every push/PR to `main` and `release`:

| Job           | What it checks                          |
|---------------|-----------------------------------------|
| Lint & Format | ESLint + Prettier (no-fix, CI mode)     |
| Typecheck     | `tsc --noEmit`                          |
| Unit Tests    | Jest (skipped if no test files found)   |
| Expo Doctor   | `npx expo-doctor` — config sanity check |

## What EAS Preview does (`.github/workflows/eas-preview.yml`)

Triggered on PRs to `release`:

1. Kicks off an EAS iOS build with profile `preview` (internal distribution)
2. Comments on the PR with a link to the EAS dashboard
3. Build is downloadable as a QR code from EAS once complete

## What EAS Release does (`.github/workflows/eas-release.yml`)

Triggered when a tag matching `v*.*.*` is pushed:

1. Validates the tag is on the `release` branch
2. Triggers EAS iOS build with profile `production`
3. If `ENABLE_STORE_SUBMIT` variable is `true`, automatically submits to TestFlight
4. Creates a GitHub Release with auto-generated changelog from commits

## GitHub setup — one time

### 1. Branch protection

**Settings → Branches → Add branch ruleset**

**`main`**:

- ✅ Require a pull request before merging (1 approval)
- ✅ Require status checks:
    - `Lint & Format`
    - `Typecheck`
    - `Unit Tests`
    - `Expo Doctor`
- ✅ Require branches to be up to date
- ✅ Block force pushes

**`release`**:

- ✅ All of the above
- ✅ Also require: `Build iOS Preview`
- ✅ Restrict who can push: only you

### 2. Environment with manual gate

**Settings → Environments → New environment** → name: `production`

- ✅ Required reviewers → add yourself
- ✅ Deployment branches and tags → "Selected branches and tags" → add tag pattern `v*.*.*`

This adds a manual approval step before the production EAS build starts.

### 3. Secrets

**Settings → Secrets and variables → Actions → Secrets**

| Name         | Where to get it                                  |
|--------------|--------------------------------------------------|
| `EXPO_TOKEN` | Expo → Account Settings → Access Tokens → Create |

### 4. Variables

**Settings → Secrets and variables → Actions → Variables**

| Name                  | Value               | Purpose                                  |
|-----------------------|---------------------|------------------------------------------|
| `EXPO_ACCOUNT`        | `mora2297`          | Your Expo account slug                   |
| `EXPO_PROJECT`        | `finance-mobile`    | Expo project slug                        |
| `ENABLE_STORE_SUBMIT` | `false` (initially) | Set to `true` when Apple Developer ready |

### 5. Security settings

**Settings → Code security and analysis**:

- ✅ Dependabot alerts
- ✅ Dependabot security updates
- ✅ Private vulnerability reporting

## EAS setup — one time

### Initial configuration

```bash
npm install -g eas-cli
eas login
eas init                # creates project on expo.dev
```

This links your local project to an EAS project. The `projectId` gets added to `app.config.ts`.

### Build credentials (iOS)

Before the first production build:

```bash
eas credentials
```

- Select iOS → Production → "Build Credentials"
- Let EAS manage everything (recommended) — it will create Distribution Certificate + Provisioning Profile
- For preview builds (internal), EAS uses Ad Hoc distribution

### When you have Apple Developer account

Once your Apple Developer account is active ($99/year):

1. Create the app in [App Store Connect](https://appstoreconnect.apple.com/)
2. Grab the credentials and update `eas.json`:
   ```json
   "submit": {
     "production": {
       "ios": {
         "appleId": "your@email.com",
         "ascAppId": "1234567890",
         "appleTeamId": "ABCDE12345"
       }
     }
   }
   ```
3. In GitHub → Variables → set `ENABLE_STORE_SUBMIT` → `true`

From the next tag push, TestFlight submit will be automatic.

## Daily workflow

### Development

```bash
git checkout main && git pull
git checkout -b feat/something
# ...work...
git push -u origin feat/something
# open PR to main → CI runs
# merge → CI runs again on main
```

### Releasing

```bash
# 1. Merge main into release
git checkout release && git pull
git merge main
git push
# → CI + EAS preview build run (if you opened a PR) or just CI (if direct merge)

# 2. Bump version + create tag
npm version patch           # patch / minor / major
# This updates package.json and creates a git tag v0.1.1

# 3. Push tag to trigger production build
git push --follow-tags
# → validate-tag → environment approval → EAS build → GitHub Release
```

## Version management

- `version` in `package.json` is the **user-facing version** (e.g. `0.1.2`)
- `autoIncrement: true` in `eas.json` makes EAS automatically bump `buildNumber` (iOS)
- Your `app.config.ts` should read `version` from `package.json`:

```typescript
import {version} from './package.json';

export default {
    expo: {
        version,
        // ...
    },
};
```

## Costs

### EAS (Expo)

- **Free tier**: 30 iOS builds/month
- **Production plan**: $19/month for unlimited builds + priority queue

For portfolio/personal use, free tier is usually enough.

### Apple Developer

- **Individual**: $99/year
- **Organization**: $99/year (requires D-U-N-S number)

### GitHub Actions

- **Public repo**: unlimited minutes (free)
- **Private repo**: 2,000 min/month free on Free plan

## Troubleshooting

**`eas build` fails with "No bundle identifier"**
Make sure `ios.bundleIdentifier` is set in `app.config.ts` (e.g. `com.mora2297.finance`).

**Preview build installs but won't open**
Internal distribution requires the device UDID to be registered in your provisioning profile. Run `eas device:create`
and have the tester register their device.

**Tag push doesn't trigger production workflow**
The tag must be on the `release` branch. Check with:

```bash
git branch -r --contains v0.1.0
# should include origin/release
```

**Production build fails because of missing credentials**
Run `eas credentials` and select the `production` profile to generate/inspect credentials.

**Submit fails with "App not found"**
You need to create the app in App Store Connect first, **before** the first submit. EAS can't create new App Store
listings.
