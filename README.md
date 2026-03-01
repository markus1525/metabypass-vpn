# MetaBypass VPN

MetaBypass VPN is a single‑page React UI that simulates a full mobile VPN experience, including onboarding, permission dialogs, auto server scanning, and connection status. The entire experience is implemented in [App.js](file:///Users/minthukyawkhaung/Documents/Sem2/personal/metabypass-vpn/metabypass-vpn/src/App.js).

Developer: Min Thu Kyaw Khaung (Markus)

## Features

- iOS‑style onboarding flow with permissions and profile install sheet
- Auto server scanner with dynamic latency results
- Manual server selection with region filters
- Split‑tunnel toggle for Meta apps
- Animated connection states and status indicators

## Project Structure

- [src/App.js](file:///Users/minthukyawkhaung/Documents/Sem2/personal/metabypass-vpn/metabypass-vpn/src/App.js) — main UI and state logic
- [src/index.js](file:///Users/minthukyawkhaung/Documents/Sem2/personal/metabypass-vpn/metabypass-vpn/src/index.js) — app entry point
- [public/index.html](file:///Users/minthukyawkhaung/Documents/Sem2/personal/metabypass-vpn/metabypass-vpn/public/index.html) — HTML shell and favicon tags
- [public/manifest.json](file:///Users/minthukyawkhaung/Documents/Sem2/personal/metabypass-vpn/metabypass-vpn/public/manifest.json) — PWA metadata and icons

## Scripts

- `npm start` — run the development server
- `npm run build` — create a production build
- `npm run deploy` — deploy the build to GitHub Pages
- `npm run generate:favicons` — generate favicon assets from a master icon

## Favicon Workflow

1. Place a master icon at `public/master-icon.png` (or pass a custom path).
2. Generate favicon files:

```bash
npm run generate:favicons
```

3. Use the generated files referenced by [manifest.json](file:///Users/minthukyawkhaung/Documents/Sem2/personal/metabypass-vpn/metabypass-vpn/public/manifest.json) and [index.html](file:///Users/minthukyawkhaung/Documents/Sem2/personal/metabypass-vpn/metabypass-vpn/public/index.html).

## Notes

- This project focuses on UI/UX simulation. It does not establish real VPN connections.
