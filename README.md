# Puro

A private Finnish learning app for Rajin and Labbaiqua, focused on study and work in Finland. HTML, CSS, and JavaScript, with Supabase Auth and PostgreSQL for shared progress. No framework or build step.

60 lessons, 300 answer checks, 385 course vocabulary entries, custom words, spaced recall, a mistake notebook, mixed level checks, writing drafts, 12 partner role-plays, and 10 guided missions using real Finnish. A1 and A2 have 18 lessons each; B1 through C2 have six each.

## Account setup

The database, access policies, and public browser configuration are already installed in Supabase project `aabivchuosrzxabfbloe`. No secret key is included in this app. The public publishable key in `public/config.js` is intended for browsers; database permissions protect the data.

Both Auth users are already created and confirmed. Sign in using the passwords you chose. The registered accounts are Rajin’s `rajin.khan2001@gmail.com` and Labbaiqua’s `labbaiquahtabassum2001@gmail.com`.

For reference, a fresh project needs these one-time steps in [Supabase Authentication → Users](https://supabase.com/dashboard/project/aabivchuosrzxabfbloe/auth/users):

1. Add user → Create new user.
2. Use `rajin.khan2001@gmail.com` for Rajin and `labbaiquahtabassum2001@gmail.com` for Labbaiqua.
3. Choose each password yourself. Keep “Auto confirm user?” checked, then Create user. This admin form does not send a confirmation email.
4. Sign in to the app with your own email and password.

Both cloud learner profiles are initialized. No public sign-up form is offered. The database admits only the two confirmed emails, then binds each learner to their Auth user ID. Other signed-in users and anonymous visitors cannot read partner statistics or save progress. Do not delete and recreate an Auth user after starting to learn; its progress belongs to that user ID.

This uses password sign-in, so no custom SMTP, OAuth setup, redirect URLs, or Vercel callback routes are required. Password recovery is through the project owner’s Auth user controls. If you want self-service email resets later, configure production SMTP and add a reset flow before offering it in the app.

## Run locally

With Node 22 or later:

```sh
cd /Users/rajin/Developer/active/Puro
node preview.mjs
```

Open http://127.0.0.1:4280. For another port, use `PORT=3000 node preview.mjs`. Serve the files over HTTP rather than opening the HTML directly. You need an internet connection to sign in and load your cloud progress.

## Deploy to Vercel yourself

Import the folder with `vercel.json` at the project root. Use the Other framework preset. The checked-in configuration skips installation and builds and serves `public/`. No Vercel environment variables are required; the public Supabase URL and publishable key are already in `public/config.js`. No server or service-role key is needed.

The preview and deployed site use the same Supabase project. Signing in to the same account loads the same cloud progress across origins and devices. This copy has not been published.

## Learn together

Each account owns its lessons, word review dates, mistakes, checks, preferences, drafts, and practice logs. The header shows your authenticated learner; sign out to switch accounts on a shared device.

Learn together shows both learners’ lesson and vocabulary totals, study minutes, and logged role-plays. It refreshes every 30 seconds, when the window receives focus, or when you press Refresh progress. Your partner cannot edit your work or read your writing drafts. Refreshing the totals keeps open role cards and selected reflection checks intact.

Start at A1 and follow the sequence. All levels remain available for revisiting or exploring. Read your own role card, exchange information, then swap roles. Each person logs their own practice round in their own account.

## Saving and recovery

Successful saves update your Supabase account. The footer confirms “Saved to your account.” Before sending a save, the app writes a recovery copy under `puro:cloud:v1:<user-id>` in localStorage. A failed save keeps that copy and shows Retry save and Download current work. Reconnecting and retrying syncs the latest work. Reloading with pending work attempts to finish the save first.

Each save includes the cloud revision it started from. An older device or tab cannot overwrite newer cloud data. On a conflict, download your current work, then choose Load latest cloud. Each save is bound to the authenticated user ID that the page loaded. If another tab changes accounts, the page pauses and offers a backup and reload. The database rejects a save with a different user ID.

The app also preserves displaced work as a device recovery copy; Resources & course notes offers Download last device recovery. It never merges writing or review dates silently.

The cloud remains authoritative. Browser storage also holds your sign-in session and device recovery copies. Sign out on shared computers. Clearing site data removes those local copies and signs you out, but does not remove successfully synced progress.

Resources & course notes offers JSON backup download and restore. A restore previews the file and asks before replacing your current account progress. Old Puro local backups remain supported. Old local-only progress is kept under its original keys and is not automatically uploaded. After signing in, choose Import old progress from this device to preview the matching learner’s old local copy and confirm its replacement of cloud progress. If you already have an old JSON backup, use Restore a backup instead.

## Audio and feedback

In-app audio uses an installed Finnish browser or device voice. When none is available, the app explains that and leaves transcripts accessible. Missions link to real Finnish speakers. Microphone recordings are temporary, last at most three minutes, and stay in the open page; they are not uploaded to Supabase or shared with your partner.

Answer checks cover taught examples and accepted forms. Open writing, role-plays, and recordings use self-reflection prompts rather than automatic language grading. A1 through C2 are study labels. Completing these lessons does not certify CEFR proficiency or guarantee fluency. Continued unfamiliar input, live interaction, and feedback from proficient speakers remain part of learning.

## Verification

```sh
node check.mjs
node cloud-check.mjs
```

The first check covers course structure, answer keys, checkpoint coverage, recall scheduling, old local storage, backups, validation, syntax, and hosting configuration. The cloud check exercises account isolation, second-device loads, pending-save recovery, stale and simultaneous saves, archived conflicts, invalid remote data, and storage failures with an isolated SDK mock.

`supabase/verify.sql` was run against the new empty project. It used uncommitted Auth fixtures to test owner saves, partner summaries, private writing, denied outsider and anonymous access, invalid data, and stale revisions. All fixtures were rolled back, leaving zero test users and test progress rows. Both real confirmed accounts were then checked with their actual identities; those temporary test writes were also rolled back before their empty profiles were initialized. The script deliberately refuses to run after the real learner accounts exist. Do not use it as a recurring production test.

`supabase/setup.sql` records the applied setup for review and recovery. It adds the Puro schema and functions. Do not rerun database setup casually against a populated project. The app does not execute migrations on startup.

Research and curriculum decisions are in `RESEARCH.md`. Original lesson examples, dialogues, readings, and model responses are practice material. The Hossa photo is by [Juho Luomala on Unsplash](https://unsplash.com/photos/the-sun-is-setting-over-a-lake-surrounded-by-trees-ZR0TcVk3E6E). `THIRD_PARTY.md` records the pinned Supabase SDK, its release date, license, and checksum. No packages are installed for deployment.

The interface overhaul and its scoped verification are documented in `docs/interface-review.md`. `docs/preview.jpg` shows the configured sign-in page; `docs/interface-preview.jpg` shows a learning preview with synthetic progress. On mobile, More opens grammar, partner practice, weekly planning, missions, checks, and resources.
