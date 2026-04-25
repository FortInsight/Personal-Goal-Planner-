# Personal Goal Planner

This is a static daily goal dashboard that now supports:

- installable PWA behavior on phone and desktop
- local offline-friendly use on the current device

## Files that matter

- `index.html`
- `styles.css`
- `rebuilt-dashboard.js`
- `manifest.webmanifest`
- `sw.js`

## What works right now

- The planner saves goals in local browser storage on the current phone or computer.
- The installed PWA version and the browser version on the same device use the same local data if they share the same browser storage context.
- Another device will start with its own empty local storage.

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
- `assets/icon.svg`
