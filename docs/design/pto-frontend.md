# PTO Web Frontend — Cross-Cutting Design

## Intent

The PTO web frontend will provide a complete interface to the PTO API.
Visitors will see a brief, informational home page and be directed to sign in;
no PTO data will be publicly available. The authenticated application will
cover the API's player, prediction, results, tournament, account, and admin
capabilities.

## Goals and non-goals

- The frontend will establish shared foundations for language, styling,
  routing, authentication, API integration, testing, developer tooling, and
  hosting.
- The informational landing page will remain distinct from authenticated data
  pages.
- This design will cover technical foundations; visual design and page layouts
  will be decided separately.
- The application will cover all API capabilities. Detailed user workflows and
  acceptance criteria will be defined during product and implementation
  planning.
- The selected approach will not require a separate backend.

## Constraints

- **Selected baseline: client-rendered SPA.** This is a user decision.
- The API exposes JSON page data and domain operations. Its OpenAPI contract
  defines numerous read endpoints and mutations.
- The [API README](../api/README.md) specifies Cognito (`eu-west-2`), the API
  base URL, and an ID token in an `Authentication: Bearer …` header.
- The API's CORS configuration will allow the frontend's deployed origin.
- Admin access will be based on Cognito user-group membership; the API may
  expose this information to the frontend.
- The [OpenAPI contract](../api/pto.openapi.json) does not declare a server
  URL or security requirements. Protected-route behavior and browser preflight
  behavior will be verified against the running API before release.

## Approaches considered

1. **Client-rendered SPA — selected.** A static frontend will authenticate with
   Cognito and call the JSON API. It will fit an authenticated application
   with little public content and will not require a web server. The browser
   will manage the Cognito session, and the API's CORS configuration will allow
   the deployed origin.
2. **Server-rendered app with a backend-for-frontend (BFF) — not selected.**
   A server would manage sessions and proxy API calls, keeping tokens out of
   browser JavaScript. This approach would add server hosting and auth/session
   integration, while public-data rendering would provide little benefit for
   this application.

## Technology options

Recommendations below are proposals rather than final technology selections.
The selected technologies will be recorded here once the owner has chosen them.

### Language and frontend framework

- **TypeScript with React (recommended):** this option will provide a broad
  ecosystem and strong support for typed API clients and routing. It will
  require compile-time and type-generation setup.
- **TypeScript with Vue:** this option will retain static typing with a
  different, cohesive component model. Library choices and patterns will
  differ from the React options below.
- **JavaScript with React:** this option will require less setup and no
  compile-time type handling, but API contract mismatches and many errors will
  only surface at runtime.

### Styling library

- **CSS Modules and CSS variables:** this option will use native CSS and
  locally scoped styles with minimal dependency overhead. The project will
  maintain shared conventions and components.
- **Tailwind CSS:** utility classes will support consistent styling and quick
  iteration. Markup may become class-heavy, and developers will need to learn
  its conventions.
- **Component library (for example, MUI):** this option will provide
  accessible, maintained components, with added dependency and customization
  constraints. Its selection will not determine the visual design.

### Page routing

- **React Router (recommended if React is selected):** this option will
  provide established routing and nested layouts. Route types and
  search-parameter validation will be less integrated.
- **TanStack Router:** this option will provide strong TypeScript support for
  route parameters and search state, though it may be less familiar to some
  teams.
- The selected router will keep the informational landing route public and
  protect application routes behind authentication.

### Authentication

- **Cognito Hosted UI with Amplify Auth (recommended):** this option will
  delegate sign-in and token lifecycle to AWS's client library, with added
  Amplify conventions and dependency weight.
- **Cognito OAuth authorization-code flow with PKCE and `oidc-client-ts`:**
  this option will use standard OIDC flows with less AWS-specific coupling,
  while requiring more explicit configuration and integration.
- The SPA will contain no client secret. It will send the ID token using the
  API's documented authentication header, and the API will enforce
  authorization. Sign-in persistence—limited to a browser session or retained
  across browser restarts—will be decided with the SDK selection; token
  storage will be managed by the SDK.
- Admin UI access will be based either on the Cognito group claim in the
  session or on a capability such as `isAdmin` returned by an authenticated API
  response. **Recommendation:** the API response will supply this capability
  to avoid coupling UI logic to token claims. The API will remain authoritative;
  admin navigation will be hidden for non-admins, and direct visits will show
  an access-denied state.

### API calling pattern

- **Generated TypeScript client and centralized request/query layer
  (recommended):** this option will generate types and client functions from
  OpenAPI and use a query library such as TanStack Query for caching, loading,
  and error state. It will reduce drift across the large contract; generation
  may require configuration because auth and server metadata are absent.
- **Handwritten typed `fetch` wrapper:** this option will use fewer tools and
  provide direct control over requests, but request/response definitions and
  error handling may drift from OpenAPI.
- Authenticated requests will go through a centralized layer that supplies the
  base URL and token header and surfaces API errors; components will not
  construct them independently.

### Testing

- **Vitest + Testing Library, with Playwright for critical end-to-end flows
  (recommended):** this option will provide fast unit/component feedback and
  browser coverage for sign-in, protected routes, predictions, and admin
  tasks. Browser tests will require stable test accounts or a controlled auth
  strategy.
- **Vitest + Testing Library only:** this option will be simpler and faster to
  maintain, but will not catch browser routing, Cognito redirect, or deployment
  integration issues.

### Linting and developer experience

- **ESLint + Prettier (recommended):** this option will provide mature,
  configurable lint and formatting tools with broad editor support, and will
  require separate configuration.
- **Biome:** this option will provide one fast tool for linting and formatting,
  with a smaller plugin and customization ecosystem.
- The project will include type-check, lint, format-check, and test scripts.
  Vite will support local SPA development and builds, a supported Node LTS
  version will be used, and environment variables will supply the API URL and
  public Cognito configuration.

### Deployment

- **AWS S3 + CloudFront (recommended if the project is already AWS-oriented):**
  this option will provide static hosting, a CDN, and close alignment with
  Cognito. It will require AWS setup, SPA route fallback configuration, and
  deployment automation.
- **Managed static hosting (for example, Vercel or Netlify):** this option will
  provide quick setup and preview deployments, while introducing another
  provider and requiring Cognito callback/origin and API CORS configuration.
- Either option will use HTTPS, correct SPA history fallback, and
  environment-specific Cognito redirect URLs and API origins. The selected SPA
  baseline will not require a server runtime.

## Open decisions

The language/framework, styling library, router, Cognito integration and
session persistence, API client strategy, testing depth, lint/format tooling,
and hosting provider will be selected by the owner. API authentication and CORS
preflight behavior will be verified before production configuration is
committed.
