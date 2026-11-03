# PTO tech stack

This document describes the technical decisions that apply across the PTO
frontend.

Note that the source code for the backend is elsewhere and so technical
decisions for the backend are out of scope for this document.

## Requirements

- The frontend integrates with the PTO API (see the [OpenAPI
  contract](./api/pto.openapi.json)).
- The user base is small; fewer than 100 users.
- Hosting should be free or very low-cost.
- Most pages are only accessible when logged in; the exception is the home page,
  which gives information about the site and directs users to register or log
  in.
- SEO is not required.

## Decisions

- **UI:** React, TypeScript, and Tailwind CSS.
- **Architecture:** A static single-page application (SPA) built using Vite.
- **API client:** A thin, typed client that follows the OpenAPI contract rather
  than generating a full client.
- **Identity:** Players register and sign in through the AWS Cognito Hosted UI,
  managed in the PTO frontend using oidc-client-ts.
- **Hosting:** Cloudflare Pages.
- **Testing:** Vitest and React Testing Library.
- **Routing:** React Router.
