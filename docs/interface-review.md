# Puro interface overhaul

Reviewed on 6 October 2026.

## Scope and coverage

Puro at `/Users/rajin/Developer/active/Puro` uses static HTML, CSS and JavaScript. The overhaul covers sign-in, the shared navigation/header/footer, all ten learning routes, settings, and the lesson vocabulary/pattern/dialogue screens. Lesson question, writing and completion branches, word creation, import, and speaking/recording controls were also inspected in source; this review does not claim exhaustive browser coverage of every lesson or every recording state.

There were no repository-specific design or contribution documents. The supplied user instructions prohibit npm and packages newer than seven days. No packages were installed. The existing forest/sage palette and local lake image were retained, and the overlapping stylesheets were consolidated into `public/styles.css`. Supabase configuration, database policies, and real progress were not changed. Browser interaction tests used a separate local SDK fixture with synthetic progress.

| Domain | Evidence inspected | Result |
| --- | --- | --- |
| Layout | Ten routes, sign-in, native dialogs; CSS container queries and five viewport widths | Four systemic spacing/reflow issues fixed |
| Typography | Headings, labels, captions, controls, long names and expanded labels | One shared type-scale issue fixed |
| Colors | Computed foreground/background pairs; control borders; photo scrim bounds | Control contrast corrected; inspected text pairs passed |
| Accessibility | Native semantics, computed accessibility trees, DOM audit, keyboard navigation, errors, dialog notices | Three error/focus issues fixed; assistive-technology limits below |
| UI polish | Surface radii, control sizing, icon alignment, primary actions, loading feedback, reduced-motion code | Two systemic consistency issues fixed |
| Writing | `better-writing` was not available in the supplied skill catalog or local skill directory | Not reviewed; curriculum/prose quality was outside this UI review |

The six requested skills were applied: better-interface orchestrated the review, with better-layout, better-typography, better-colors, better-accessibility and better-ui as domain guidance. Existing course content and the Supabase save model remain intact.

## Findings

All rows below are resolved. Locations refer to the final files; deleted patch stylesheets are named where relevant.

| Severity | Domain | Location | Before | After | Why |
| --- | --- | --- | --- | --- | --- |
| HIGH | Layout | `public/styles.css:3262`, `public/index.html:21` | Sidebar and navigation used different breakpoints; six mobile labels became crowded | One shell breakpoint, five mobile controls, native More disclosure for the other routes | Navigation must remain usable at narrow and intermediate widths |
| HIGH | Accessibility | `public/app.js:22`, `public/styles.css:3215` | Global notices could sit behind a native modal and errors disappeared after a timer | Persistent, dismissible error notices are placed inside the active dialog; dismissal restores focus | An audio failure must remain visible and usable while the lesson is open |
| MEDIUM | Layout | `public/styles.css:373`, `public/styles.css:437` | Header, body and footer accumulated different horizontal padding | Shared gutters and one maximum content width | Common edges make the hierarchy easier to follow |
| MEDIUM | Layout | `public/styles.css:484`, `public/app.js:55` | The daily goal moved far below the learning content when columns collapsed | Goal sits next to the lesson on desktop and follows it in the document/mobile order | Reflow must preserve access to the day's useful information |
| MEDIUM | Layout | `public/styles.css:3227` | Lesson buttons used a manual left margin, which overflowed with expanded labels | A two-column grid positions the lesson number, description and action | Structural alignment must survive longer content |
| MEDIUM | Typography | `public/styles.css:4`, `public/styles.css:437`, `public/styles.css:2937` | Two similar type families, tiny captions, and many per-breakpoint sizes | One UI family, shared heading roles, readable labels/captions, 16px inputs | Text should remain readable without changing its role across screen sizes |
| MEDIUM | Colors | `public/styles.css:4`, `public/styles.css:421` | Faint input/control borders did not provide 3:1 contrast | Semantic control border `#778c7c`; decorative borders keep their lighter role | Essential control outlines require at least 3:1 contrast |
| MEDIUM | Accessibility | `public/cloud.js:63`, `public/cloud.js:86` | Sign-in error was an untied alert; submitting replaced the button label | Bound descriptions, invalid-field state/focus, a stable Sign in label and busy indicator | Validation must identify the field and preserve the control's name |
| MEDIUM | UI polish | `public/styles.css:421`, `public/styles.css:558`, `public/app.js:17` | Small audio/settings targets, inconsistent button spacing and changing save labels | 44px main controls, shared padding/radii, one busy helper and restrained motion | Common interaction states should behave consistently |
| LOW | UI polish | `public/app.js:51` | Every unfinished lesson had the same filled primary action | The next unfinished lesson is primary; peer lessons remain available as secondary actions | Visual emphasis should identify the next useful step |

## Verification

Passed:

- `node check.mjs`: 60 lessons, 300 answer checks, 385 vocabulary entries; course structure, legacy migration, backups, validation, recall/checkpoints, JavaScript syntax and static Vercel configuration.
- `node cloud-check.mjs`: saves, second-device loads, account isolation, failed-save recovery, stale/concurrent revisions, archived conflicts, invalid remote data and storage failures.
- Browser DOM audit of home, path, review, practice, grammar, together, study-plan, missions, checks and resources at **320, 640, 800, 1024 and 1280 CSS pixels**: all 50 page/width combinations had one page h1, named controls, and no horizontal overflow or offscreen content detected. These checks are a focused automated audit, not a full WCAG conformance certification.
- Computed text-contrast audit on the ten routes found no failing inspected opaque-background pairs. The calculation used 4.5:1 for normal text and 3:1 for large text. Photo text was checked separately against the brightest possible image beneath the opaque scrims. Sign-in errors were inspected in the rendered fixture form. The final control border measured 3.60:1 against white, 3.34:1 against paper, and 3.19:1 against the soft accent surface. Muted light photo text has conservative worst-case bounds of 9.20:1 on the lesson hero and 7.08:1 on the sign-in image.
- Expanded action labels on the narrow learning path exposed the manual button offset; after replacing it with a grid the 320px audit passed. A long learner name saved, wrapped in the profile, and truncated within the header chip.
- RTL layout checks on home/together at 320px passed the geometry audit. This checks layout resilience, not a translated Arabic/Hebrew product.
- Settings: Tab visited the native fields and save control; Escape closed the dialog and returned focus to Settings. Inspected field/control focus outlines were visible. At the end of the native tab cycle the browser chrome boundary was observed; no background page control became operable through the modal.
- Mobile More disclosure: Enter opens it, Escape closes it and restores summary focus; selecting a page closes the disclosure. Other study routes remain available from the menu.
- Sign-in: unsupported email produced an inline description, `aria-invalid=true`, and focus on the email field; the button kept its Sign in label. Sign-in with fixture credentials entered the learning UI.
- Lesson: vocabulary/pattern/dialogue reflow, Continue, and Close worked. A simulated missing Finnish voice produced a visible notice inside the lesson; Dismiss returned focus to the audio control.
- Writing: a synthetic Finnish draft saved through the local fixture; the Save draft label stayed stable, its busy state cleared, and the footer reported Saved to your account.
- The actual app at port 4281 rendered the configured sign-in screen with the consolidated stylesheet. New account passwords and live sign-in were not entered during this UI task.
- Source inspection confirmed native controls/labels, reduced-motion guards, no staged page entrance animation, named transition properties, and forced-color overrides.

Not verified:

- VoiceOver/NVDA announcement behavior or a full third-party accessibility-engine audit. The available browser accessibility tree and the focused DOM audit do not replace those checks.
- Actual browser zoom at exactly 200%, operating-system forced-colors rendering, and animation replay at 10% speed in a developer-tools animation panel. Narrow-width reflow and the corresponding CSS were checked.
- Every lesson's full answer/writing/completion flow and microphone permission/recording on every browser or device. Existing data/cloud checks passed, and affected source was reviewed.
- Deployment and production password sign-in in this turn. The user will deploy to Vercel; the static configuration still disables install/build commands and serves `public`.

## Verdict

**Approve for the inspected UI scope.** No confirmed HIGH finding remains. This verdict covers the layout, typography, color, accessibility and polish evidence listed above; it does not claim the missing writing-domain review or the checks explicitly marked Not verified.
