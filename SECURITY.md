# Security Policy

## Supported Versions

Only the latest version published on the App Store and the latest commit on `release` receive security updates.

| Version            | Supported          |
| ------------------ | ------------------ |
| Latest App Store   | ✅                 |
| `release` (latest) | ✅                 |
| `main` (dev)       | ⚠️ Best effort     |
| Older versions     | ❌                 |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.**

Instead, report them privately:

### Preferred: GitHub Private Vulnerability Reporting

1. Go to the [Security tab](https://github.com/MoRa2297/finance-mobile/security) of this repository
2. Click **"Report a vulnerability"**
3. Fill in the form with details

### Alternative: Email

Contact [@MoRa2297](https://github.com/MoRa2297) directly via GitHub. Do **not** include vulnerability details in your first message — just request a secure channel.

## What to include

- **Type of issue** (e.g. token leak, insecure storage, MitM opportunity, injection, privilege escalation)
- **Affected screen / module / API call**
- **Steps to reproduce**
- **Impact** — what can an attacker achieve?
- **Environment** — iOS version, app version/commit, device
- **Suggested fix** (optional)

## Response timeline

Solo-maintained project, best effort:

| Stage                | Target                |
| -------------------- | --------------------- |
| Initial response     | Within 72 hours       |
| Severity assessment  | Within 7 days         |
| Fix for critical     | Within 14 days        |
| Fix for non-critical | Next scheduled release|
| Public disclosure    | After fix is released |

## Disclosure policy

- **Coordinated disclosure**: the vulnerability stays private until a fix is released on the App Store
- Security advisory published via GitHub's Security Advisories after release
- Reporters credited unless they prefer anonymity
- No bug bounty program — personal project

## Out of scope

- Issues requiring physical access to an unlocked device
- Jailbroken / rooted device exploits
- Social engineering
- Vulnerabilities in third-party dependencies without a demonstrated exploit in this project's context — report those upstream
- Issues affecting only Expo Go (non-standalone builds)

## Security best practices for contributors

When contributing code, please:

- **Never commit secrets, API keys, or `.env` files**
- **Never hardcode URLs or credentials** — always use `ENV` constants from `src/constants/env.ts`
- **Never log user credentials, JWTs, or PII** — especially not with `console.log` that ships to production
- **Use `expo-secure-store` for sensitive data** (tokens, credentials) — never `AsyncStorage`
- **Validate all external input** before rendering (deep links, push notifications, clipboard)
- **Don't expose sensitive data in crash reports** or analytics

Thanks for helping keep this project secure.
