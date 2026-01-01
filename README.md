# LocalSnips — Preview

<p align="center">
  <img src="logo.png" alt="LocalSnips Logo" width="120" height="120">
</p>

<p align="center">
  <strong>High‑fidelity browser preview of the LocalSnips UI/UX</strong><br/>
  <sub>This repository contains build artifacts only (HTML/CSS/JS). No source code is included.</sub>
</p>

<p align="center">
  <a href="https://yeraylois.github.io/localsnips-preview/"><strong>▶ View Live Demo</strong></a>
</p>

---

## What this repository is

This repo hosts **only the static export output** of LocalSnips (the compiled web UI).  
It exists exclusively to provide a **public, zero‑setup preview** of the product experience.

✅ Includes:

- Static build artifacts (HTML/CSS/JS) for the preview site
- UI/UX flows and interactions designed to showcase the app

❌ Does **not** include:

- The LocalSnips source code
- Backend services, Docker stack, database, or worker logic
- Any private data or production configuration

> The demo uses **simulated data** and runs entirely client‑side.

---

## Mobile-friendly preview (new)

This preview now includes a **minimal responsive layout** so it **doesn’t break on phones/tablets** (e.g., iPhone 11+).  
It’s still a **macOS‑first product**, so mobile is intentionally simplified.

On mobile you can expect:

- A simplified single‑column flow (Menu / List / Detail)
- A banner/message indicating it’s a macOS‑optimized experience

> Note: Because this is a static preview and the mobile layer is intentionally minimal, you may encounter minor UI glitches or layout edge cases. If something looks off, please try refreshing or opening on desktop.

---

## Live demo

- **Preview URL:** https://yeraylois.github.io/localsnips-preview/
- **Contact (licensing / access to full macOS app):** yerayloissanchez@gmail.com

---

## What you can try in the preview

### 🧠 Knowledge exploration

- Browse snippets, collections, and tags
- Navigate the UI and inspect detailed snippet views

### 🔎 Search & filtering

- Client‑side search across demo items
- Filters for collections/tags and “recent” style views

### 🎨 Dynamic theming

- Explore Light / Dark / System modes
- Try **Custom** mode to preview palette controls and tint behavior

### 🛠️ Service Manager (simulation)

A pixel‑accurate recreation of the native macOS control panel UX used to manage the local stack in the real app (states and transitions are simulated in the preview).

---

## Navigation hints

- **Dashboard:** main hub for snippets and recent activity
- **Graph View:** interactive knowledge graph exploration (demo dataset)
- **Service Manager:** infrastructure control panel simulation

---

## Limitations (important)

Because this is a static preview build:

- No persistent storage (refresh may reset demo state)
- No real AI processing or background indexing
- No real Docker / PostgreSQL / Redis interactions
- No authentication / user accounts

If you want to evaluate the full macOS app (native wrapper + local services), request access via email.

---

## Ownership and license

**Copyright © 2025 Yeray Lois Sánchez. All rights reserved.**

This repository is **proprietary**.  
**No license is granted** to use, copy, modify, distribute, sublicense, or create derivative works from this repository or its contents.

If you want a commercial license, partnership, or evaluation access to the full product, contact:

- **yerayloissanchez@gmail.com**

---

## Brand notice

“LocalSnips” and associated names, UI/UX designs, and assets are part of the LocalSnips project identity.  
Unauthorized reuse of branding or derivative works is not permitted.

---

<p align="center">
  <sub>LocalSnips © 2025 Yeray Lois Sánchez — Proprietary preview build. All Rights Reserved.</sub>
</p>
