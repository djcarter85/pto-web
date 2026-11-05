# PTO website MVP roadmap

This roadmap describes the order in which features will be added to the PTO
website in order to create a minimum viable product (MVP).

## Scope

The MVP will include all features described in the [vision
document](./vision.md), except

- any features specific to summer football tournaments, and
- the ability for organisers to manage the game.

## Phase 1: public site and deployment

Publish a basic informational home page that explains the game.

Tech introduced: React, TypeScript, Tailwind CSS, Vite, Cloudflare Pages.

## Phase 2: login and current-gameweek leaderboard

Add login and a protected page which shows the leaderboard for the current
gameweek.

Tech introduced: API client, AWS Cognito Hosted UI, oidc-client-ts.

## Phase 3: entering predictions

Add navigation and a page for making and editing predictions for upcoming
matches.

## Phase 4: gameweek results

Allow users to view their prediction accuracy and points for completed matches.

## Phase 5: improved leaderboards

Support leaderboards for other gameweeks and the entire season.

## Phase 6: other user information

Allow users to view prediction accuracy for other users.
