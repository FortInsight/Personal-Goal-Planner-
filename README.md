# Personal Goal Planner

This is a static daily goal dashboard that now supports:

- installable PWA behavior on phone and desktop
- local offline-friendly use
- optional Supabase login with email and password
- optional cloud sync so the same user can open the app on another device and see the same data

## Files that matter

- `index.html`
- `styles.css`
- `rebuilt-dashboard.js`
- `manifest.webmanifest`
- `sw.js`
- `supabase-config.js`
- `supabase-setup.sql`

## What works right now

- If `supabase-config.js` is empty, the app still works in local mode on one device.
- If you add Supabase keys and run the SQL setup, users can sign in and sync their planner across devices.

## Supabase setup

1. Create a Supabase project.
2. In the Supabase SQL editor, run the SQL in `supabase-setup.sql`.
3. In `supabase-config.js`, add:

```js
window.SUPABASE_CONFIG = {
  url: "https://YOUR-PROJECT.supabase.co",
  anonKey: "YOUR-ANON-KEY",
  syncTable: "planner_snapshots"
};
```

4. In Supabase Auth, keep email/password sign-in enabled.
5. Deploy the app.

## Temporary passwords

If you want to give a customer a starter password:

1. Create their user in Supabase Auth.
2. Give them the temporary password.
3. They sign in in the app.
4. They use the `Change password` form in the access panel.

## Cross-device data

Yes, the same user data will show on another phone or computer if:

- the user signs into the same account
- Supabase is configured
- the `planner_snapshots` table and policies are created

Without Supabase, data only stays in that one browser.

## PWA notes

- Android and desktop browsers should allow install from the app.
- iPhone support depends on Safari home-screen install behavior.
- The service worker caches the app shell for faster reopen and basic offline use.

## Deploy

For GitHub Pages or other static hosting, upload all project files including:

- `index.html`
- `styles.css`
- `rebuilt-dashboard.js`
- `manifest.webmanifest`
- `sw.js`
- `supabase-config.js`
- `assets/icon.svg`

## Security note

Use one account per customer. Do not share one password between multiple people if you want their data to stay private.
