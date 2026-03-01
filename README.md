# MetaBypass VPN 🛡️

A mobile-first VPN UI built with React, designed for users in Myanmar to bypass Facebook and Meta app restrictions. Installable on iPhone as a PWA (Progressive Web App) via Safari — no App Store required.

**Developer:** Min Thu Kyaw Khaung (Markus)
**Live Demo:** [markus1525.github.io/metabypass-vpn](https://markus1525.github.io/metabypass-vpn/)

---

## Features

- **iOS-style onboarding** — 4-step intro with permission and profile install flow
- **Auto Best Server Finder** — scans random servers worldwide, measures real-time ping, auto-connects to the fastest
- **Manual server selection** — 20 countries with region filters and search
- **Full Device mode** — routes all device traffic through VPN (default)
- **Split Tunnel mode** — routes only selected Meta apps (Facebook, Messenger, Instagram, WhatsApp)
- **Animated connection states** — globe, radar scan, floating app icons, pulse rings
- **iOS permission dialogs** — realistic VPN config, notification, and profile install prompts
- **PWA installable** — add to iPhone home screen via Safari for a native-like experience

---

## Install on iPhone (Free)

1. Open **Safari** on iPhone
2. Go to [markus1525.github.io/metabypass-vpn](https://markus1525.github.io/metabypass-vpn/)
3. Tap the **Share** button (box with arrow at the bottom)
4. Tap **"Add to Home Screen"**
5. Tap **"Add"**

The app icon will appear on your home screen and open fullscreen like a native app.

> ⚠️ This is a UI prototype. The permission dialogs and connection flow are simulated. Real VPN tunneling requires a backend server and a native iOS app with NetworkExtension entitlement.

---

## Project Structure

```
metabypass-vpn/
├── public/
│   ├── index.html              # HTML shell with PWA meta tags
│   ├── manifest.json           # PWA metadata and icons
│   ├── apple-touch-icon.png    # iPhone home screen icon
│   ├── favicon-96x96.png       # Browser favicon
│   ├── web-app-manifest-192x192.png
│   └── web-app-manifest-512x512.png
├── scripts/
│   └── generate-favicons.mjs   # Auto-generates favicon assets from master icon
├── src/
│   ├── App.js                  # Main UI — all screens, state logic, animations
│   ├── index.js                # React entry point
│   └── index.css               # Base styles
├── package.json
└── README.md
```

---

## Scripts

| Command | Description |
|---|---|
| `npm start` | Run local development server at `localhost:3000` |
| `npm run build` | Create optimised production build in `/build` |
| `npm run deploy` | Build and deploy to GitHub Pages (gh-pages branch) |
| `npm run generate:favicons` | Generate favicon assets from `public/master-icon.svg` |

---

## Deploy to GitHub Pages

This project deploys automatically to the `gh-pages` branch using the `gh-pages` package.

```bash
# Make changes to src/App.js, then:
npm run deploy
```

> **GitHub Pages setting:** Go to repo **Settings → Pages → Branch** and make sure it is set to `gh-pages` (not `main`). This is required for the site to serve the React app instead of the README.

The `gh-pages` branch is auto-generated — never edit it directly.

---

## Favicon Workflow

1. Place your master icon at `public/master-icon.svg` (or `.png`)
2. Run the generator:

```bash
npm run generate:favicons
```

3. All favicon files are written to `public/` and referenced automatically by `index.html` and `manifest.json`

---

## Servers Available

20 countries across Asia, Europe, and the Americas. Meta-optimized servers (best for bypassing Myanmar blocks):

🇸🇬 Singapore · 🇹🇭 Thailand · 🇲🇾 Malaysia · 🇻🇳 Vietnam · 🇮🇩 Indonesia · 🇭🇰 Hong Kong · 🇵🇭 Philippines · 🇯🇵 Japan · 🇹🇼 Taiwan · 🇺🇸 United States

---

## Notes

- This project is a UI/UX simulation only — it does not establish real VPN connections
- To make it a fully functional VPN, a WireGuard backend server and Apple NetworkExtension entitlement are required
- Built with React 19, deployed free via GitHub Pages