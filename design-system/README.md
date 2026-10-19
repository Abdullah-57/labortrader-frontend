# LaborTrader design source of truth

Approved direction: Industrial Glass, October 2, 2026. The visual reference is
`/dev/design-lab`. Its approved source before extraction is preserved in
`design-assets/approved-landing-2026-10-02/` with SHA-256 hashes. That snapshot is
an archive, not a second implementation to edit.

## Ownership

| Concern                                                                     | Canonical implementation                                                                                                 |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Palette, type scale, gutters, spacing, radii, photo strength                | `design-system/tokens.css`                                                                                               |
| Public sections, panels, counters, reading layouts                          | `design-system/site.css`                                                                                                 |
| Compact mobile tiles, metrics, role paths, and desktop expansion            | `design-system/tiles.css`                                                                                                |
| Form spacing, wrapping select values, optional details, vendor state tags   | `design-system/forms.css`, `components/ui/native-select.tsx`                                                             |
| Independent optional email and SMS choices                                  | `components/marketing-consent-fields.tsx`, `components/inquiry-consent-fields.tsx`                                       |
| Interaction states, form values, selected filters, focus and touch feedback | `design-system/interactions.css`                                                                                         |
| Approved landing sections and responsive tile geometry                      | `components/landing-content.tsx`, `components/landing-content-data.ts`, `design-system/landing.module.css`               |
| Shared header, dropdowns, mobile menu                                       | `components/site-header.tsx` and `design-system/navigation.module.css`                                                   |
| Timed signup reminder                                                       | `components/registration-reminder.tsx`, `design-system/registration-reminder.module.css`, `lib/registration-reminder.ts` |
| Shared page background and isolation                                        | `components/site-frame.tsx`, `components/site-backdrop.tsx`                                                              |
| Scroll motion, cleanup, and reduced-motion preference                       | `design-system/use-scroll-background.ts` (also used by the lab)                                                          |
| Page image selection and approval status                                    | `design-system/backgrounds.ts`                                                                                           |
| Audience, trade, legal structure                                            | `components/audience-landing-page.tsx`, `components/specialized-trade-page.tsx`, `components/legal-page.tsx`             |

## Approved visual and interaction rules

- Charcoal, cream, beige, and steel blue; balanced orange `#E76532`. Keep the
  original logo artwork intact. No purple or green theme and no large orange fills.
- Use the shared Inter font. Clear large headings, 15–17px body copy, and 16px
  form values. Keep compact labels distinct from body copy.
- Desktop shell: 1320px maximum with 48px gutters. At 1050px use 28px gutters;
  at 760px use 20px. Standard section spacing is 56px, then 42px on mobile.
- Use one continuous fixed background per page, with restrained scroll motion.
  Respect reduced motion. Do not duplicate photos in separate banners.
- Glass panels use a 16px radius; controls use 5px. Reading pages use denser
  panel opacity and shorter introductions for comfortable reading.
- Orange outlines, accents, and text feedback; text and arrows respond together.
  Controls need keyboard focus and immediate touch press feedback. Hover-only
  behavior is insufficient. Non-clickable information panels should not act like buttons.
- Preserve the landing's compact two-by-two mobile audience cards with the
  Client card spanning the bottom. Keep mobile copy concise and avoid fixed tall cards.
- Support links highlight their words; do not turn the entire support tile orange.
- Entered text and selected dropdown values use the orange. Placeholders stay
  neutral. State/industry fields must retain enough width on phones.
- Remove ornamental counters/numbered badges; preserve real statistics, prices,
  meaningful form progress, and legal text. Public counts remain visible as em
  dashes until data is available, with Signups, States, and Specialties labels.
- Market counters use the shared charcoal glass panel, orange statistics, and
  orange outlined CTA. Keep the photograph visible around the panel; do not
  restore a solid cream counter band. At narrow phone widths, keep all three
  statistic labels visible and put the CTA on its own full-width row.
- Preserve form field names, validation, consent, attribution, submission endpoints,
  confirmation flows, structured data, and URL anchors during visual changes.

## Current rollout

The public homepage now uses the approved landing composition. `app/page.tsx`
supplies the existing real `QuickLaunchForm`, scoped public signup counts, and
compact market notice. The registration payload, consent, attribution, validation,
and submission endpoint are retained. Existing public anchor IDs remain valid.

The lab uses the same `LandingContent`, `LandingSurface`, `SiteHeader`,
`SiteFooter`, and `SignupCounterStrip`. Its demonstration registration and design
controls remain in `app/dev/design-lab/preview.tsx` and cannot submit data. The lab
route remains unavailable in production. Do not copy the lab into another route.

The shared frame covers all 32 rendered public/account routes, the admin entry
screen, and error/not-found views. Redirects and API handlers are not visual pages.
The final audit also reviewed populated account and admin components using an
isolated local fixture with synthetic records, including expanded credential
forms, responsive reporting, and sign-out. This is UI coverage, not proof of
production authentication or database access.

Fourteen primary pages now use distinct photographs through `backgrounds.ts`:
Pro Shop; HVAC; Electrical; Plumbing; Oil & Gas; Other Trades; Workers;
Contractors; Service Businesses; Hiring Organizations; Clients; Partners;
MarketScan; and Investors. Thirteen were newly generated using the supplied real
photography as subject/equipment guidance and the landing photograph as the style
reference. Investors uses an optimized copy of the previously approved image.
The original rejected HVAC sample is not used by the registry.

Delivery assets live in `public/backgrounds/` as 1536×1024 WebP files, approximately
177–292 KB each. Full PNG sources, prompts, reference links, corrections, and crop
positions are retained in `design-assets/background-rollout-2026-10-02/`.
Its `manifest.json` maps every asset to the relevant route and source. No third-party
reference photographs are embedded or hotlinked on the site.

The homepage, design lab, legal, FAQ, access, and other shared information pages
retain the approved landing photograph. All imagery uses the same continuous
backdrop, opacity, overlays, scroll hook, and reduced-motion behavior. Change
page imagery and focal position through `backgrounds.ts`; do not add separate
section backgrounds or duplicate the scroll implementation.

The image rollout's `verification.json` records mobile/desktop/narrow-mobile
checks at 390px, 1440px, and 320px for every updated page, plus observed scrolling
and primary-link navigation. Screenshots live in `qa/page-backgrounds/`.
Partner, investor, and client form controls and Pro Shop category filtering were
also exercised without submitting real records. TypeScript, lint, 212 tests,
and the production build passed after integration.

## Interaction acceptance checklist

- Check text AND arrows together in focus, hover, and pressed states.
- Use orange entered/selected values, neutral placeholders, and 16px fields.
  Check native select chevrons, autofill, textareas, and inputs with leading icons.
- Selected filter and activity buttons retain an orange border/text state.
- Clickable cards have immediate pressed feedback. Informational cards stay still.
  The landing support tiles animate their heading and arrow only.
- Keep mobile dropdown contents scrollable. Escape returns focus to the opener;
  choosing a destination closes the menu. Closed links must remain inert.
- Inspect expanded details, registration role variants, errors, empty states,
  and delayed UI such as the registration reminder, not just initial page load.
- On phones, state and industry fields stack to preserve readable choices.
  Very narrow screens also stack the name fields. Table/filter strips can scroll
  within their own containers; the page itself must not scroll sideways.
- Respect reduced motion. Scroll the shared photo; do not make every content tile
  animate merely because the reader scrolls past it.

The final cleanup and every-page audit are recorded in `RELEASE_QA_REPORT.md`.
All 38 page routes plus 404 recovery were checked at 390px, 1440px, 768px, then
320px. Expanded profile cards, all four participant roles, account corrections,
credential claims, populated admin panels and error recovery received additional
checks. Raw measurements and screenshots remain locally in `qa/final-build/`;
historical design experiments and the temporary fixture server are excluded from
the developer source package. Browser viewport checks are not physical-device
Safari/Android testing.

## Email and text consent

- Use separate optional, initially unchecked email and recurring SMS choices.
  Required Terms/Privacy acknowledgements and service-email notices must not
  grant marketing permission. Declining updates does not affect registration or
  benefit eligibility. Changing a phone number clears its text-update consent.
- Partner and investor inquiries collect email, without a phone field or SMS
  option. The requested email response, privacy acknowledgement, and optional
  email updates are distinct choices.
- Shared SMS wording identifies LaborTrader and the message subjects, recurring
  automated texts, variable frequency, message/data rates, STOP/HELP, and links to
  SMS Terms and Privacy. One-time verification codes have their own disclosure
  beside the explicit request button; they do not subscribe someone to updates.
- The participant storage field `emailConsent` now represents explicit optional
  email marketing permission. `CONSENT_COPY_VERSION = 2026-10-02-v3` identifies
  this choice. Older required launch-email acknowledgements remain preserved but
  are not preselected or included in contactable marketing exports. Service-email
  acknowledgements remain separately available for registration eligibility.
- The Loops intake worker is implemented but FEATURE_EMAIL_DELIVERY remains off.
  Read `EMAIL_IMPLEMENTATION.txt` for templates, confirmation, follow-up,
  suppression and provider acceptance. Broader lifecycle/campaign scheduling,
  real Loops delivery, Twilio and Auth0 are separate staging gates.

Wording references: [Twilio Messaging Policy](https://www.twilio.com/en-us/legal/messaging-policy),
[Twilio A2P onboarding guidance](https://help.twilio.com/articles/11847054539547),
and [Loops transactional guidance](https://loops.so/docs/transactional).

Earlier rollout evidence and limitations are recorded in
`design-assets/site-unification-verification.json`. The earlier
`shared-rollout-verification.json` describes the initial foundation checkpoint.
This remains a local implementation, not a public deployment or new handoff ZIP.

## Checking changes efficiently

Check the affected template at phone and desktop widths, then its unique controls.
For changes to shared styles, sample audience, trade, commercial, reading, and
form pages. Build once for a consolidated batch. Do not run `typecheck` while
`next build` is regenerating `.next/types`. Recheck the lab after changes to its
shared tokens or motion hook. Keep generated artwork and any future handoff
packaging separate from routine visual iterations.
