# AthLink Hub Agent Instructions

## Product Direction

AthLink Hub is a youth-athlete support marketplace launching first in Atlantic Canada, focused on Newfoundland & Labrador and Nova Scotia.

The app helps parents find local support for young athletes, including:
- Coaching
- Training and performance
- Gear and equipment
- Recovery and rehab
- Camps and clinics
- Facilities and rentals

## V1 Scope

Build a static MVP prototype first.

Allowed:
- Copy updates
- Sample data updates
- UI component improvements
- Search/filter UI improvements
- Admin review workflow mockups
- External booking/contact links

Not allowed in V1:
- Payments
- Full in-app booking
- Real authentication
- Database integration
- Automatic publishing of AI-discovered providers
- Scraping or social media automation
- Major framework changes

## Brand Rules

Use `AthLink Hub` in title case.

`AthLink` is the main brand. `Hub` is secondary.

Avoid:
- All-caps `ATHLINKHUB`
- Ambiguous monograms
- Childish sports graphics
- Generic fitness-app language

## Region Rules

Launch region:
- Newfoundland & Labrador
- Nova Scotia

Use Atlantic Canada language. Do not use Austin, Texas, ZIP, state, or US-specific language.

## Categories

Use these six parent needs:
- Improve Skills
- Build Strength
- Recover
- Find Gear
- Join Camps
- Find Facilities

## Provider Cards

Provider cards should show:
- Business name
- Category/need
- Sports served
- Age groups
- Key services
- Location/distance
- Claimed/unclaimed status
- Reviewed/verified status
- Source status
- Actions: View Profile, Save, Contact, Request Info, Book Now

`Book Now` should represent an external booking/contact link only.

## Admin Review

Admin/source statuses:
- AI Discovered
- Needs Review
- Duplicate Risk
- Missing Info
- Ready to Publish
- Approved
- Rejected

Human review is required before publishing AI-discovered providers.

## Coding Rules

Make small, focused changes.

Do not refactor unrelated files.

Do not add new dependencies unless absolutely necessary.

Prefer preserving the Lovable-generated structure unless there is a clear reason to change it.

Before opening a PR, confirm:
- No Austin/Texas/ZIP language remains.
- `Find Training` is changed to `Find Support`.
- The app still builds.
