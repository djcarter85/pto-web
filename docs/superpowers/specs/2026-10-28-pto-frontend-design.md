# PTO Web Frontend — Cross-Cutting Design

## Intent

Build a complete web frontend for the PTO API. Visitors should see a brief,
informational home page and be quickly directed to sign in; there is no public
PTO data. The authenticated application will cover the API's player,
prediction, results, tournament, account, and admin capabilities.

## Goals and non-goals

- Choose the frontend's language, styling approach, routing, authentication,
  API integration, testing, developer tooling, and hosting.
- Keep the informational landing page distinct from authenticated data pages.
- Decide technical foundations only; visual design and page layouts are out of
  scope.
- Cover all API capabilities; detailed user workflows and acceptance criteria
  belong in later product/implementation planning.
- Avoid adding a backend unless it is needed to support the selected approach.

## Constraints

- **Selected baseline: client-rendered SPA.** This is a user decision.
- The API exposes JSON page data and domain operations. Its OpenAPI contract
  defines numerous read endpoints and mutations.
- The [API README](../../api/README.md) specifies Cognito (`eu-west-2`), the API
  base URL, and an ID token in an `Authentication: Bearer …` header.
- The API owner can add CORS origins when the frontend host is selected.
- Admin access is determined by Cognito user-group membership; the API can be
  extended to expose this information to the frontend.
- The [OpenAPI contract](../../api/pto.openapi.json) does not declare a server
  URL or security requirements. Confirm protected-route behavior and browser
  preflight behavior against the running API before release.

## Approaches considered

1. **Client-rendered SPA — selected.** A static frontend authenticates with
   Cognito and calls the JSON API. It fits an authenticated application with
   little public content and avoids operating a web server. The browser handles
   the Cognito session, and the API must allow the deployed origin through CORS.
2. **Server-rendered app with a backend-for-frontend (BFF).** A server manages
   sessions and proxies API calls, which can keep tokens out of browser
   JavaScript. It adds server hosting and auth/session integration; public-data
   rendering provides little benefit for this application.

## Decisions for the owner

Recommendations are proposals, not decisions. Select or revise an option in
each section.

### Language and frontend framework

- **TypeScript with React (recommended):** broad ecosystem and strong support
  for typed API clients and routing. Adds compile-time and type-generation
  setup.
- **TypeScript with Vue:** keeps static typing while offering a different,
  cohesive component model. Some library choices and patterns differ from the
  React examples below.
- **JavaScript with React:** lowest setup and no compile-time type overhead;
  API contract mismatches and many errors surface only at runtime.

### Styling library

- **CSS Modules and CSS variables:** native CSS, locally scoped styles, and
  minimal dependency overhead; shared conventions and components need to be
  maintained by the project.
- **Tailwind CSS:** utility classes make styling consistent and quick to
  iterate; markup can become class-heavy and requires learning its conventions.
- **Component library (for example, MUI):** provides accessible, maintained
  components; adds dependency and customization constraints. Choosing one does
  not decide the visual design.

### Page routing

- **React Router (recommended if using React):** established routing and
  nested layouts; route types and search-parameter validation are less
  integrated.
- **TanStack Router:** strong TypeScript support for route parameters and
  search state; newer and less familiar to some teams.
- Either approach should keep the informational landing route public and
  protect application routes behind authentication.

### Authentication

- **Cognito Hosted UI with Amplify Auth (recommended):** delegates sign-in and
  token lifecycle to AWS's client library; adds Amplify conventions and
  dependency weight.
- **Cognito OAuth authorization-code flow with PKCE and `oidc-client-ts`:**
  uses standard OIDC flows with less AWS-specific coupling; requires more
  explicit configuration and integration.
- In either case, do not embed a client secret in the SPA. Send the ID token
  using the API's documented `Authentication` header, and let the API enforce
  authorization. Decide whether sign-in persistence should last for the
  browser session or survive browser restarts; use the SDK rather than
  hand-rolling token storage.
- For admin UI gating, either read the Cognito group claim from the session or
  have an authenticated API response expose a capability such as `isAdmin`.
  **Recommendation:** use the API response to avoid coupling UI logic to token
  claims. In both cases the API remains authoritative; hide admin navigation
  for non-admins and show a clear access-denied state for direct visits.

### API calling pattern

- **Generated TypeScript client and centralized request/query layer
  (recommended):** generate types/client functions from OpenAPI and use a
  query library such as TanStack Query for caching, loading, and error state.
  Reduces drift across the large contract; generation may need configuration
  because auth and server metadata are absent from the spec.
- **Handwritten typed `fetch` wrapper:** fewer tools and direct control over
  requests; request/response definitions and error handling can drift from
  OpenAPI.
- Components should not construct authenticated requests independently.
  Centralize base URL, token/header injection, and surfaced API errors.

### Testing

- **Vitest + Testing Library, with Playwright for critical end-to-end flows
  (recommended):** fast unit/component feedback plus browser coverage for
  sign-in, protected routes, predictions, and admin tasks; browser tests need
  stable test accounts or a controlled auth strategy.
- **Vitest + Testing Library only:** simpler and faster to maintain; will not
  catch browser routing, Cognito redirect, or deployment integration issues.

### Linting and developer experience

- **ESLint + Prettier (recommended):** mature, configurable lint and formatting
  tools with broad editor support; requires separate configuration.
- **Biome:** one fast tool for linting and formatting; smaller plugin and
  customization ecosystem.
- Either way, include type-check, lint, format-check, and test scripts; use
  Vite for local SPA development/builds, a supported Node LTS version, and
  environment variables for the API URL and Cognito public configuration.

### Deployment

- **AWS S3 + CloudFront (recommended if the project is already AWS-oriented):**
  static hosting, CDN, and close alignment with Cognito; requires AWS setup,
  SPA route fallback configuration, and deployment automation.
- **Managed static hosting (for example, Vercel or Netlify):** quick setup and
  preview deployments; introduces another provider and requires Cognito
  callback/origin and API CORS configuration.
- Both require HTTPS, correct SPA history fallback, and environment-specific
  Cognito redirect URLs and API origins. No server runtime is needed for the
  selected SPA baseline.

## Open decisions

The owner still needs to choose the language/framework, styling library,
router, Cognito integration and session persistence, API client strategy,
testing depth, lint/format tooling, and hosting provider. Verify API auth and
CORS preflight behavior before committing to production configuration.
