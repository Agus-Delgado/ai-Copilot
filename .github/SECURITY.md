# Security Policy

## Supported Versions
This project is a frontend-only demo/portfolio app. Security fixes are handled on a best-effort basis.

## Reporting a Vulnerability
If you believe you’ve found a security issue:
1. Do not open a public GitHub issue with sensitive details.
2. Prefer contacting the maintainer via LinkedIn (see README Contact section) with:
   - A clear description of the issue
   - Steps to reproduce
   - Impact assessment
   - Proof-of-concept (if applicable)

## Scope notes
- The app supports BYOK (Bring Your Own Key). API keys must never be committed or embedded in build-time VITE_* variables.
- Share links must serialize only non-sensitive state.
- See `docs/SECURITY.md` for technical details and recommendations.
