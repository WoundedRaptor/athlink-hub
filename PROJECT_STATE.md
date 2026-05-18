# AthLink Hub Project State

## Current Product Direction

AthLink Hub is a youth-athlete support marketplace launching first in Atlantic Canada.

Initial focus:
- Newfoundland & Labrador
- Nova Scotia
- Supporting Atlantic Canada expansion where useful, including New Brunswick and PEI provider leads when relevant.

AthLink Hub helps parents find local support for young athletes, including:
- Hockey development
- Sport-specific coaching
- Strength and conditioning
- Recovery and rehab
- Mental performance
- Gear and equipment
- Camps and clinics
- Facilities and rentals

## Current MVP Scope

The current MVP is a static web app generated in Lovable and synced to GitHub.

Allowed in MVP:
- Static provider data
- Search/filter UI
- Provider cards
- Provider detail pages
- Admin review queue
- Manual lead review workflow
- External provider/contact/booking links

Not allowed yet:
- Real database
- Authentication
- Payments
- Full in-app booking
- Automated scraping
- Auto-publishing provider leads
- Reviews
- Messaging

## Current Data Model

Main file:

`src/data/providers.ts`

Important exports:
- `PROVIDERS`: public/demo providers shown in public search.
- `ADMIN_LEADS`: manual provider leads shown in Admin Portal approval queue.
- `NEEDS_MORE_RESEARCH`: possible providers not ready to add.
- `getProvider(id)`: returns providers from both `PROVIDERS` and `ADMIN_LEADS`.

Important statuses:
- `profileStatus: "claimed" | "unclaimed"`
- `sourceStatus: "verified" | "ai-discovered" | "user-submitted" | "manual-lead"`
- `adminStatus: "Needs Review" | "Duplicate Risk" | "Missing Info" | "Ready to Publish" | "Approved" | "Rejected"`

Important optional fields:
- `sourceUrl?: string`
- `adminNotes?: string`
- `detectedAt?: string`
- `confidence?: number`

## Current Provider Rules

Public search should show:
- `PROVIDERS`

Admin Portal should show:
- `ADMIN_LEADS`

Public search should NOT show:
- `ADMIN_LEADS`
- providers with `adminStatus: "Needs Review"` unless we intentionally build a demo mode later

Manual provider leads must not be described as:
- Verified
- Partnered
- Approved
- Recommended
- Official

Manual provider leads should display as:
- Manual Lead
- Needs Review
- Unclaimed

## Current Real Provider Leads

The real provider leads should be in `ADMIN_LEADS`.

Important expected leads include:
- Jason Cyrus Hypnotherapy
- JAHM Hockey Academy
- East Coast Athlete
- Halifax 902 Elite
- East Coast Ice
- Pro Evolution Hockey
- Atlantic Hockey Group
- Busby Strength & Conditioning
- ADAPT Performance Training
- Impact Performance
- Proedge Elite Training
- Rinkside Hockey
- Andrews Hockey Growth Programs
- Cumberland County Minor Hockey Association
- Truro Area Minor Hockey Association
- HaTha Yoga Room
- O2Max
- Hubletes Hockey

These should all be:
- `profileStatus: "unclaimed"`
- `sourceStatus: "manual-lead"`
- `adminStatus: "Needs Review"`

## Current Known Issue

Lovable publish/preview is failing.

Lovable logs showed:
`Worker bundle not found ... _worker_bundle.json`

This probably means the build failed before Lovable created the worker bundle.

Likely source-code issue:
- TypeScript mismatch or syntax issue in `src/data/providers.ts`, `src/routes/admin.tsx`, or `src/routes/providers.$id.tsx`.
- Confirm `Provider` interface includes optional fields:
  - `sourceUrl?: string`
  - `adminNotes?: string`

Need next:
- Get the real build/typecheck error.
- Fix the smallest code issue required to get Lovable publishing again.

## Current Admin Portal Goal

Admin Portal should show `ADMIN_LEADS` in the approval queue.

Each lead should show:
- Name
- City
- Sports
- Needs
- Services
- Profile status
- Source status
- Admin status
- Confidence
- Source URL
- Admin notes

Admin action buttons can be mock/UI-only for now:
- Review
- Edit
- Approve
- Reject
- Flag Duplicate
- Mark Claimed
- Mark Reviewed
- Mark Verified

Buttons do not need backend persistence yet.

## Current Mobile Issue

The site is not displaying correctly on phone.

Future task:
- Mobile responsiveness pass for header, homepage, search results, provider cards, provider profile, add business page, and admin portal.
- Must be usable at 375px width.
- No horizontal scrolling.
- Header must not overflow.
- Cards and buttons should wrap cleanly.

## Current Agent Rules

Use `AGENTS.md` for coding-agent instructions.

All Codex tasks should:
- Make small focused changes
- Avoid broad refactors
- Avoid adding dependencies unless necessary
- Avoid database/auth/payments/booking logic for now
- Preserve Lovable-generated structure unless there is a clear reason to change it
- Report files changed and why

## Next Recommended Task

Task name:
Fix Lovable build/publish failure

Prompt for Codex:

The Lovable publish is failing and runtime logs show "Worker bundle not found ... _worker_bundle.json", which likely means the build failed before the deployment bundle was created.

Please diagnose and fix the actual build/typecheck failure.

Focus on:
- `src/data/providers.ts`
- `src/routes/admin.tsx`
- `src/routes/providers.$id.tsx`
- imports from `@/data/providers`
- status values such as `"manual-lead"`
- optional fields such as `sourceUrl`, `adminNotes`, `adminStatus`, `detectedAt`, and `confidence`

Requirements:
- Make the smallest fix required for the app to build.
- Do not remove the real provider leads unless absolutely necessary.
- Do not expose ADMIN_LEADS in public search.
- Do not add database, auth, payments, or booking logic.
- Do not refactor unrelated files.

Acceptance criteria:
- Build passes.
- Lovable can publish/preview.
- Jason Cyrus Hypnotherapy remains in `ADMIN_LEADS`.
- Admin Portal renders `ADMIN_LEADS`.
- Public search excludes `ADMIN_LEADS`.

## 2026-05-18 Build/Publish Fix Update

What was broken:
- `src/routes/admin.tsx` had stale variable names from an earlier admin mock (`pending`, `reviewed`, and `statuses`) that no longer matched the current `ADMIN_LEADS`/`AdminStatus` data model.
- Admin action handlers still used lowercase status values (`"approved"` and `"dismissed"`) even though `AdminStatus` only allows title-case values such as `"Approved"` and `"Rejected"`.
- The admin route referenced an undefined `IconBtn` component and used `Link` without importing it.
- `DetailRow` and `ActionBtn` in `src/routes/admin.tsx` had malformed JSX/function closing braces, causing the TypeScript parser to fail before Lovable could create its deployment bundle.
- `PUBLIC_PROVIDERS` included approved `ADMIN_LEADS`, which risked exposing admin-only lead data in public search if a lead status changed.

Files changed:
- `src/routes/admin.tsx`
  - Uses `ADMIN_LEADS` and `adminStatuses` consistently.
  - Uses valid `AdminStatus` values for mock approve/reject actions.
  - Replaces the undefined `IconBtn` usage with the existing `MockAction` component.
  - Imports `Link` and fixes malformed JSX/function closings.
  - Keeps the Admin Portal pointed at `ADMIN_LEADS`.
- `src/data/providers.ts`
  - Keeps `PUBLIC_PROVIDERS` limited to `PROVIDERS` so public search excludes `ADMIN_LEADS`.
  - Updates `getProvider(id)` to find records in both `PROVIDERS` and `ADMIN_LEADS`, preserving admin lead profile lookup for review flows.

Build status:
- Full `npm run build` could not be verified in this local workspace because dependencies are not installed and package installation is blocked by registry/proxy 403 errors.
- A focused Bun transpile check passed for `src/data/providers.ts`, `src/routes/admin.tsx`, and `src/routes/providers.$id.tsx`.
- A focused TypeScript parser check no longer reports the previous `src/routes/admin.tsx` malformed JSX errors; it is blocked locally only by missing dependency type packages such as `vite/client` because `node_modules` is unavailable.

What should be tested next:
- Run the normal Lovable/GitHub build in an environment with dependencies available.
- Open `/admin` and confirm Jason Cyrus Hypnotherapy and the other manual leads render in the Admin Portal queue.
- Open public search and confirm manual leads from `ADMIN_LEADS` do not appear.
- From the Admin Portal, open a lead profile and confirm the provider detail route can load the lead for review context.
