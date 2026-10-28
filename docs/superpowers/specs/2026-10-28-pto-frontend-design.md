# PTO Frontend Design

**Status:** Draft for approval  
**Date:** 2026-10-28

## Intent

Replace the proof-of-concept frontend with a reliable, responsive application
for players and administrators using the existing PTO API. The frontend presents
workflows and validates input; the API remains authoritative for business rules
and authorization.

## Goals and boundaries

- Cover the player and administrative workflows exposed by the API, including
  predictions, results, leaderboards, account/player management, and tournament
  administration.
- Provide consistent authentication, data loading, mutation, validation, and
  error handling across features.
- Keep the app accessible, responsive, and maintainable as API features grow.
- Do not redesign the API. Do not build a mobile-native app. Do not duplicate
  server-side authorization in the browser.
- Do not put secrets in frontend code or trust client-side checks to protect
  administrative operations.

## Approaches

1. **Keep the React + TypeScript + Vite static SPA (selected).** It builds on
   the current app and GitHub Pages deployment, and matches the API's documented
   bearer-token contract. It requires the API to allow browser requests from
   the deployed origin.
2. **Add a backend-for-frontend or move to a full-stack server framework.**
   Server-side sessions and API proxying offer more control over token handling
   and avoid browser-to-API CORS dependence, but require a server runtime,
   hosting, and operational work not needed by the current product.

The static SPA is the chosen direction. Revisit it only if the API cannot
support the required CORS/auth flow or a concrete security requirement calls
for server-side sessions.

## Cross-cutting decisions

### Language and framework

- Use **TypeScript** for the application and **React** for UI, retaining **Vite**
  as the build tool and **React Router** for client-side routes.
- Keep the existing Tailwind CSS, Luxon, and small component utilities where
  they remain useful; build shared accessible UI primitives rather than
  introducing a large component framework without a demonstrated need.
- Organize code by product domain, with shared auth, API, and layout layers.

### API and client state

- Treat `docs/api/pto.openapi.json` as the API contract. Generate TypeScript
  types from it with `openapi-typescript` and use `openapi-fetch` behind a
  shared client that attaches the current ID token and normalizes HTTP errors.
- Use **TanStack Query** for server state, request deduplication, loading/error
  states, and cache invalidation after mutations. Keep transient form state in
  the relevant feature.
- Retain **Zod** for form/input validation and runtime checks where useful;
  avoid maintaining a second hand-written copy of every OpenAPI response
  schema.
- Use **React Hook Form** with Zod for complex forms. Keep simpler inputs
  lightweight.

### Authentication and authorization

- Retain **Amazon Cognito** and the existing `react-oidc-context` /
  `oidc-client-ts` integration. Use Authorization Code with PKCE and the
  library-managed state, nonce, and token lifecycle; do not implement token
  storage or refresh manually.
- Follow the API documentation: send the Cognito **ID token** as
  `Authorization: Bearer <token>`. Keep token handling inside the auth/API
  integration and out of logs and persistent app data.
- Protect authenticated routes declaratively. The UI may hide or show
  administrative navigation for usability, but the API must enforce every
  permission and the UI must handle `401`/`403` responses.
- Use only the minimum Cognito scopes required by the app. Register exact
  production and development callback/logout URLs and confirm API CORS allows
  those app origins before release.

### Testing

- Add **Vitest**, **React Testing Library**, and **MSW** for unit/component
  tests with deterministic API responses, covering validation, loading/error
  states, auth boundaries, and mutation/cache behavior.
- Add **Playwright** smoke tests for the critical player and admin journeys,
  using controlled authentication and API fixtures rather than live
  production services.
- CI must run lint, type-check/build, and unit tests before deployment.
  Exercise the real Cognito/API integration in a non-production staging smoke
  test.

### Deployment and configuration

- Keep the existing **GitHub Pages** static deployment and GitHub Actions
  workflow. Deploy the Vite build from `main` only after CI checks pass.
- Configure API URL and Cognito public client settings per environment; these
  browser-visible values are configuration, not secrets. Never include
  credentials or server secrets in the bundle.
- Preserve and test the current SPA deep-link fallback (`404.html` and
  `index.html` URL restoration), including refreshes on authenticated routes
  and the Cognito callback.

## Constraints and implementation calls

- The API base URL and Cognito pool/client are documented in
  `docs/api/README.md`; production origin registration and API CORS must match
  the deployed site.
- The current API contract expects browser requests carrying ID tokens. If
  that contract or CORS support changes, reassess the selected static
  architecture before release.
- Use a documented API response or Cognito claim to shape admin navigation
  when available. If there is no suitable capability signal, handle API
  `403` responses explicitly rather than guessing permissions. The API remains
  the authority in either case.
- The builder owns page-level layouts, feature sequencing, and detailed
  interaction design within these boundaries.
