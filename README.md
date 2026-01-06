<table width="100%" cellspacing="0" cellpadding="20">
  <tr>
    <td width="22%" valign="middle" align="center">
      <img src="logo.png" alt="LocalSnips" width="140" height="140">
      <br>
      <p align="center">
      <img src="docs/localsnips-title.svg" alt="LocalSnips" width="520">
    </p>
    </td>
    <td width="78%" valign="middle" align="center">
      <p align="center"><strong>PREVIEW BUILD</strong></p>
      <p align="center"><sub>High-fidelity browser preview of the LocalSnips UI/UX — explore the full interface directly in your browser.</sub></p>
      <p align="center">
        <img
          src="https://readme-typing-svg.demolab.com?font=SF+Pro+Display&weight=500&size=16&duration=3000&pause=1000&color=9CA3AF&vCenter=true&center=true&width=520&lines=Static+Export+%E2%80%A2+No+Backend+%E2%80%A2+Client-Side;macOS-First+Design+%E2%80%A2+Proprietary"
          alt="Typing SVG"
        >
      </p>
    </td>
  </tr>
</table>

<br>

---

## Quick Navigation

<p align="center">
  <a href="#features"><img style="border-radius: 8px;" src="https://img.shields.io/badge/📦_Features-blue?style=for-the-badge" alt="Features"></a>
  <a href="#limitations"><img style="border-radius: 8px;" src="https://img.shields.io/badge/⚠️_Limitations-orange?style=for-the-badge" alt="Limitations"></a>
  <a href="#prerequisites"><img style="border-radius: 8px;" src="https://img.shields.io/badge/⚙️_Prerequisites-gray?style=for-the-badge" alt="Prerequisites"></a>
  <a href="#live-demo"><img style="border-radius: 8px;" src="https://img.shields.io/badge/🚀_Live_Demo-green?style=for-the-badge" alt="Live Demo"></a>
</p>

<details>
<summary><strong>📑 Full Table of Contents</strong></summary>

#### Features

- [Quick Navigation](#quick-navigation)
  - [Features](#features)
  - [Technical](#technical)
  - [About](#about)
- [Features](#features-1)
  - [1. Navigation \& Sidebar](#1-navigation--sidebar)
  - [2. Main View (Snippet List)](#2-main-view-snippet-list)
  - [3. Item Detail View](#3-item-detail-view)
  - [4. Visualization (Graph View)](#4-visualization-graph-view)
  - [5. Generators \& Tools](#5-generators--tools)
  - [6. Command Palette (⌘K)](#6-command-palette-k)
  - [7. Appearance Settings](#7-appearance-settings)
  - [8. Service Manager (Preview - Stack Control)](#8-service-manager-preview---stack-control)
  - [9. Conflict Resolution](#9-conflict-resolution)
  - [10. Mobile Support](#10-mobile-support)
- [Limitations](#limitations)
- [Prerequisites](#prerequisites)
- [About This Repository](#about-this-repository)
- [Live Demo](#live-demo)
- [Ownership \& License](#ownership--license)
- [Intellectual Property Notice](#intellectual-property-notice)

#### Technical

- [Limitations](#limitations)
- [Prerequisites](#prerequisites)
  - [System Requirements](#system-requirements)
  - [Network Ports](#network-ports)
  - [AI Provider Configuration](#ai-provider-configuration)

#### About

- [About This Repository](#about-this-repository)
- [Live Demo](#live-demo)
- [Ownership & License](#ownership--license)

</details>

---

## Features

<p align="center" style="margin:0;">
  <img src="docs/screenshots/main_dashboard.png" alt="Main Dashboard" width="800">
</p>
<p align="center" style="margin:6px 0 0;">
  <sub><strong>App Overview</strong> — Main entry point showing the snippet library interface</sub>
</p>

### 1. Navigation & Sidebar

<table align="center">
  <tr>
    <td width="20%" valign="middle" align="center">
      <img src="docs/screenshots/sidebar_navigation.png" alt="Sidebar Navigation" width="140">
    </td>
    <td width="80%" valign="middle" align="center">
      <table
        cellspacing="0"
        cellpadding="0"
        style="
          width:100%;
          margin:0 auto;
          border:1px solid rgba(127,127,127,.35);
          border-radius:12px;
          overflow:hidden;
          border-collapse:separate;
          border-spacing:0;
        "
      >
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            📥 <strong>Inbox</strong>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Items awaiting categorization
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            🕐 <strong>Recent</strong>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Last N items (configurable)
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            📚 <strong>All Items</strong>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Complete snippet database
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            📁 <strong>Collections</strong>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Hierarchical folder view
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            🏷️ <strong>Tags</strong>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Filter by specific tags
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            🎨 <strong>Appearance</strong>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Theme customization panel
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; white-space:nowrap;">
            ⚙️ <strong>Service Manager</strong>
          </td>
          <td style="padding:10px 12px;">
            Stack Control page
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

---

### 2. Main View (Snippet List)

The main view displays your snippet library with quick access tools.

<table>
  <tr>
    <td width="50%" valign="top">
      <img src="docs/screenshots/quick_tools.png" alt="Quick Tools" width="100%" style="border-radius: 12px;">
      <p align="center"><sub><strong>Quick Tools</strong> — Import and image generation</sub></p>
    </td>
    <td width="50%" valign="top">
      <img src="docs/screenshots/snippet_list.png" alt="Snippet List" width="100%" style="border-radius: 12px;">
      <p align="center"><sub><strong>Snippet List</strong> — Status badges and tech icons</sub></p>
    </td>
  </tr>
</table>

<table
  align="center"
  cellspacing="0"
  cellpadding="8"
  style="
    border:1px solid rgba(127,127,127,.35);
    border-radius:12px;
    overflow:hidden;
    border-collapse:separate;
    border-spacing:0;
  "
>
  <tr>
    <th style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.25); text-align:center; vertical-align:middle; white-space:nowrap;">
      Feature
    </th>
    <th style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.25); text-align:center; vertical-align:middle; white-space:nowrap;">
      Description
    </th>
  </tr>

  <tr>
    <td align="center" style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
      <strong>Quick Add</strong>
    </td>
    <td align="center" style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
      Paste code/notes directly or drag &amp; drop files
    </td>
  </tr>

  <tr>
    <td align="center" style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
      <strong>Quick Snippet Image</strong>
    </td>
    <td align="center" style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
      Generate code images without saving to library
    </td>
  </tr>

  <tr>
    <td align="center" style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
      <strong>Status Indicators</strong>
    </td>
    <td align="center" style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
      Conflict, Queued, Processing, Failed
    </td>
  </tr>

  <tr>
    <td align="center" style="padding:10px 12px; white-space:nowrap;">
      <strong>Tech Badges</strong>
    </td>
    <td align="center" style="padding:10px 12px;">
      Auto-detected language/framework icons
    </td>
  </tr>
</table>

---

### 3. Item Detail View

Detailed view for inspecting and editing individual snippets.

<table width="100%" cellspacing="0" cellpadding="6">
  <tr>
    <td width="46%" valign="top" align="center">
      <img src="docs/screenshots/item_detail_header.png" alt="Item Detail Header" width="100%">
      <p align="center" style="margin:8px 0 0;">
        <sub><strong>Header</strong> — Title, Kind, Tech Icon, Collection, AI Confidence</sub>
      </p>
    </td>
    <td width="54%" valign="top">
      <h4 style="margin:0 0 8px;"><strong>Tabs</strong></h4>
      <p align="center" style="margin:0;">
      <img src="docs/screenshots/item_detail_tabs.png" alt="Item Detail Tabs" width="70%">
      </p>
      <br>
      <table
        align="center"
        cellspacing="0"
        cellpadding="8"
        style="
          margin:0 auto;
          border:1px solid rgba(127,127,127,.35);
          border-radius:12px;
          overflow:hidden;
          border-collapse:separate;
          border-spacing:0;
          width:92%;
          max-width:560px;
        "
      >
      <br>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            <strong>Documentation</strong>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Markdown editing with preview
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            <strong>Raw Content</strong>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Read-only code with copy
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; white-space:nowrap;">
            <strong>Metadata</strong>
          </td>
          <td style="padding:10px 12px;">
            Edit tags, collection, technology
          </td>
        </tr>
      </table>
      <br>
      <h4 style="margin:0 0 8px;"><strong>Actions</strong></h4>
      <p align="center" style="margin:0;">
        <img src="docs/screenshots/item_actions_toolbar.png" alt="Actions Toolbar" width="70%">
        <br>
        <sub>Resolve Conflict · Snapshot · Poster · Reprocess · Delete</sub>
      </p>
    </td>
  </tr>
</table>

---

### 4. Visualization (Graph View)

Interactive knowledge graph for exploring relationships between snippets.

<table>
  <tr>
    <td width="60%" valign="top">
      <img src="docs/screenshots/graph_view.png" alt="Graph View" width="100%" style="border-radius: 12px;">
      <p align="center"><sub><strong>Neural Graph</strong> — Force-directed visualization</sub></p>
    </td>
    <td width="40%" valign="top" >
      <h4><strong>View Modes</strong></h4>
      <table
        align="center"
        cellspacing="0"
        cellpadding="8"
        style="
          width:100%;
          margin:0 auto;
          border:1px solid rgba(127,127,127,.35);
          border-radius:12px;
          overflow:hidden;
          border-collapse:separate;
          border-spacing:0;
        "
      >
        <tr><td>🧠 <strong>Neural</strong></td><td>Physics-based graph</td></tr>
        <tr><td>➡️ <strong>Horizontal</strong></td><td>Left-to-right flow</td></tr>
        <tr><td>⬇️ <strong>Hierarchical</strong></td><td>Top-down tree</td></tr>
        <tr><td>⬆️ <strong>Bottom-Up</strong></td><td>Inverted tree</td></tr>
      </table>
      <br>
      <h4><strong>Controls</strong></h4>
      <p align="center" style="margin:0;">
        <img src="docs/screenshots/graph_controls.png" alt="Graph Controls" width="100%">
        <sub>Drill Down · Search · Root Selector</sub>
      </p>
    </td>
  </tr>
</table>

---

### 5. Generators & Tools

<table>
  <tr>
    <td width="50%" valign="top">
      <img src="docs/screenshots/snapshot_studio.png" alt="Snapshot Studio" width="100%" style="border-radius: 12px;">
      <p align="center"><sub><strong>Snapshot Studio</strong> — Code-to-Image Generator</sub></p>
    </td>
    <td width="50%" valign="top">
      <img src="docs/screenshots/poster_modal.png" alt="Poster Modal" width="100%" style="border-radius: 12px;">
      <p align="center"><sub><strong>Poster Modal</strong> — PDF Export</sub></p>
    </td>
  </tr>
</table>

<table
  align="center"
  cellspacing="0"
  cellpadding="8"
  style="
    border:1px solid rgba(127,127,127,.35);
    border-radius:12px;
    overflow:hidden;
    border-collapse:separate;
    border-spacing:0;
  "
>
  <tr>
    <th style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.25); text-align:center; vertical-align:middle;">
      Tool
    </th>
    <th style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.25); text-align:center; vertical-align:middle;">
      Options
    </th>
  </tr>

  <tr>
    <td align="center" style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
      <strong>Backgrounds</strong>
    </td>
    <td align="center" style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
      Candy, Midnight, Sunset, Ocean, Glass, solid colors
    </td>
  </tr>

  <tr>
    <td align="center" style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
      <strong>Window Styles</strong>
    </td>
    <td align="center" style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
      macOS, Windows XP/7/10, Linux, Custom
    </td>
  </tr>

  <tr>
    <td align="center" style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
      <strong>Poster Themes</strong>
    </td>
    <td align="center" style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
      Academic, Modern, Minimal, Terminal, Journal, Bold
    </td>
  </tr>

  <tr>
    <td align="center" style="padding:10px 12px; white-space:nowrap;">
      <strong>Export Formats</strong>
    </td>
    <td align="center" style="padding:10px 12px;">
      PNG (Snapshot), PDF (Poster)
    </td>
  </tr>
</table>

---

### 6. Command Palette (⌘K)

<table>
  <tr>
    <td width="60%" valign="top">
      <img src="docs/screenshots/command_palette.png" alt="Command Palette" width="100%" style="border-radius: 12px;">
      <p align="center"><sub><strong>Command Palette</strong> — Global quick search</sub></p>
    </td>
    <td width="40%" valign="center">
      <blockquote><strong>Core power-user feature</strong></blockquote>
      <br>
      <table
        cellspacing="0"
        cellpadding="8"
        style="
          border:1px solid rgba(127,127,127,.35);
          border-radius:12px;
          overflow:hidden;
          border-collapse:separate;
          border-spacing:0;
        "
      >
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            ⌨️ <strong>Global Access</strong>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            ⌘K anywhere
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            🔍 <strong>Smart Search</strong>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Real-time filtering
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; white-space:nowrap;">
            🚀 <strong>Direct Navigation</strong>
          </td>
          <td style="padding:10px 12px;">
            Jump to any snippet
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

---

### 7. Appearance Settings

<table>
  <tr>
    <td width="60%" valign="top">
      <img src="docs/screenshots/appearance_full.png" alt="Appearance Settings" width="100%" style="border-radius: 12px;">
      <p align="center"><sub><strong>Appearance Panel</strong> — Full customization</sub></p>
    </td>
    <td width="40%" valign="center">
      <table
        cellspacing="0"
        cellpadding="8"
        style="
          border:1px solid rgba(127,127,127,.35);
          border-radius:12px;
          overflow:hidden;
          border-collapse:separate;
          border-spacing:0;
        "
      >
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            🌓 <strong>Theme Modes</strong>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Light, Dark, System
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            🎨 <strong>Brand Color</strong>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Hue/Saturation sliders
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            🖼️ <strong>Surface Color</strong>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Panel backgrounds
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            ✨ <strong>Window Tint</strong>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Brand tint overlay
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; white-space:nowrap;">
            🔢 <strong>Recent Limit</strong>
          </td>
          <td style="padding:10px 12px;">
            Items in Recent view
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

---

### 8. Service Manager (Preview - Stack Control)

<table>
  <tr>
    <td width="60%" valign="top">
      <img src="docs/screenshots/service_manager_full.png" alt="Service Manager" width="100%" style="border-radius: 12px;">
      <p align="center"><sub><strong>Service Manager</strong> — Stack control simulation</sub></p>
    </td>
    <td width="40%" valign="center">
      <table
        cellspacing="0"
        cellpadding="8"
        style="
          border:1px solid rgba(127,127,127,.35);
          border-radius:12px;
          overflow:hidden;
          border-collapse:separate;
          border-spacing:0;
        "
      >
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            ▶️ <strong>Stack Ops</strong>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Start / Stop stack
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            🟢 <strong>Status</strong>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Docker, PostgreSQL, Redis, Web
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; white-space:nowrap;">
            ⚡ <strong>Quick Actions</strong>
          </td>
          <td style="padding:10px 12px;">
            Open App, Restart, Graph
          </td>
        </tr>
      </table>
    </td>

  </tr>
</table>

---

### 9. Conflict Resolution

<table>
  <tr>
    <td width="60%" valign="top">
      <img src="docs/screenshots/conflict_resolution.png" alt="Conflict Resolution" width="100%" style="border-radius: 12px;">
      <p align="center"><sub><strong>Conflict Resolution</strong> — Visual diff interface</sub></p>
    </td>
    <td width="40%" valign="center">
      <table
        align="center"
        cellspacing="0"
        cellpadding="8"
        style="
          margin:0 auto;
          border:1px solid rgba(127,127,127,.35);
          border-radius:12px;
          overflow:hidden;
          border-collapse:separate;
          border-spacing:0;
        "
      >
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            ➕ <strong>Save New</strong>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Keep both items
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            🔗 <strong>Link</strong>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Create reference
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            🔀 <strong>Merge</strong>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Combine with editing
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            🧠 <strong>Smart Resolve</strong>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            AI-assisted merge
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; white-space:nowrap;">
            🗑️ <strong>Discard</strong>
          </td>
          <td style="padding:10px 12px;">
            Delete new item
          </td>
        </tr>
      </table>
      <p style="margin-top:6px; margin-bottom:0;" align="center">
        <sub>Editor: Editable Panel · Diff Preview · Undo</sub>
      </p>
    </td>
  </tr>
</table>

---

### 10. Mobile Support

This preview includes a **minimal responsive layout** optimized for phones and tablets.

<table align="center">
  <tr>
    <td align="center">
      <img src="docs/screenshots/mobile_view-1.png" alt="Mobile Menu" width="180" style="border-radius: 12px;">
      <br/><sub><strong>Main Page</strong></sub>
    </td>
    <td align="center">
      <img src="docs/screenshots/mobile_view-2.png" alt="Mobile List" width="180" style="border-radius: 12px;">
      <br/><sub><strong>Sidebar</strong></sub>
    </td>
    <td align="center">
      <img src="docs/screenshots/mobile_view-3.png" alt="Mobile Detail" width="180" style="border-radius: 12px;">
      <br/><sub><strong>Item Detail</strong></sub>
    </td>
  </tr>
</table>

> **Note:** LocalSnips is a macOS-first product. The mobile view provides a quick overview with a simplified single-column flow and drawer navigation.

---

## Limitations

> [!NOTE]
> This is a **static preview build** designed for demonstration purposes only.

<table width="100%" cellspacing="0" cellpadding="10">
  <tr>
    <td width="72%" valign="middle" align="left">
      <table
        cellspacing="0"
        cellpadding="8"
        style="
          width:100%;
          border:1px solid rgba(127,127,127,.35);
          border-radius:12px;
          overflow:hidden;
          border-collapse:separate;
          border-spacing:0;
        "
      >
        <tr>
          <td align="center" width="80" style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            💾
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            <strong>No Persistence</strong>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Refresh may reset demo state
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            🤖
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            <strong>No AI Processing</strong>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            AI features are simulated with mock data
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:10px 12px;">
            🐳
          </td>
          <td style="padding:10px 12px; white-space:nowrap;">
            <strong>No Backend</strong>
          </td>
          <td style="padding:10px 12px;">
            Docker/PostgreSQL/Redis interactions are simulated
          </td>
        </tr>
      </table>
    </td>
    <td width="28%" valign="middle" align="center">
      <img
        style="border-radius: 10px;"
        src="https://img.shields.io/badge/⚠️_Preview_Mode-Static_Build-orange?style=for-the-badge"
        alt="Preview Mode"
      >
      <br>
      <sub>
        Want to evaluate the full macOS app?<br>
        <a href="mailto:yerayloissanchez@gmail.com"><strong>Request access →</strong></a>
      </sub>
    </td>
  </tr>
</table>

---

## Prerequisites

> [!IMPORTANT]
> These requirements apply to the **full macOS application**, not this static preview.

<p align="center">
  <img style="border-radius: 8px;" src="https://img.shields.io/badge/Platform-macOS_13.0+-black?style=for-the-badge&logo=apple&logoColor=white" alt="macOS 13.0+">
  <img style="border-radius: 8px;" src="https://img.shields.io/badge/Runtime-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img style="border-radius: 8px;" src="https://img.shields.io/badge/AI-Multi--Provider-purple?style=for-the-badge" alt="Multi-Provider AI">
</p>

---

<details open>
<summary><strong>🖥️ System Requirements</strong></summary>
<br>
<table
  align="center"
  cellspacing="0"
  cellpadding="8"
  style="
    border:1px solid rgba(127,127,127,.35);
    border-radius:12px;
    overflow:hidden;
    border-collapse:separate;
    border-spacing:0;
  "
>
  <tr>
    <td align="center" width="60" style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
      🍎
    </td>
    <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
      <strong>OS Version</strong>
    </td>
    <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
      macOS 13.0 (Ventura) or newer
    </td>
  </tr>
  <tr>
    <td align="center" style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
      ⚡
    </td>
    <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
      <strong>Architecture</strong>
    </td>
    <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
      Apple Silicon (M1/M2/M3) or Intel Core
    </td>
  </tr>
  <tr>
    <td align="center" style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
      🧠
    </td>
    <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
      <strong>RAM</strong>
    </td>
    <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
      4GB minimum · 8GB recommended
    </td>
  </tr>
  <tr>
    <td align="center" style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
      💿
    </td>
    <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
      <strong>Disk Space</strong>
    </td>
    <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
      ~2GB free
    </td>
  </tr>
  <tr>
    <td align="center" style="padding:10px 12px;">
      🐳
    </td>
    <td style="padding:10px 12px;">
      <strong>Container Runtime</strong>
    </td>
    <td style="padding:10px 12px;">
      Docker Desktop (required)
    </td>
  </tr>
</table>

</details>

---

<details open>
<summary><strong>🌐 Network Ports</strong></summary>
<br>

<table width="100%" cellspacing="0" cellpadding="10">
  <tr>
    <td width="62%" valign="top" align="left">
      <table
        cellspacing="0"
        cellpadding="8"
        style="
          width:100%;
          border:1px solid rgba(127,127,127,.35);
          border-radius:12px;
          overflow:hidden;
          border-collapse:separate;
          border-spacing:0;
        "
      >
        <tr>
          <th style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.25); text-align:center; vertical-align:middle;">
            Service
          </th>
          <th style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.25); text-align:center; vertical-align:middle;">
            Default Port
          </th>
          <th style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.25); text-align:center; vertical-align:middle;">
            Protocol
          </th>
          <th style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.25); text-align:center; vertical-align:middle;">
            Variable
          </th>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            🌐 Web UI / API
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); text-align:center;">
            <code>3030</code>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); text-align:center;">
            HTTP
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); text-align:center;">
            <code>WEB_PORT</code>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            🐘 PostgreSQL
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); text-align:center;">
            <code>54321</code>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); text-align:center;">
            TCP
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); text-align:center;">
            <code>DB_PORT</code>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; white-space:nowrap;">
            ⚡ Redis
          </td>
          <td style="padding:10px 12px; text-align:center;">
            <code>63791</code>
          </td>
          <td style="padding:10px 12px; text-align:center;">
            TCP
          </td>
          <td style="padding:10px 12px; text-align:center;">
            <code>REDIS_PORT</code>
          </td>
        </tr>
      </table>
    </td>
    <td width="38%" valign="top" align="center">
      <div
        style="
          background:#1e1e1e;
          border-radius:12px;
          padding:14px;
          overflow:hidden;
          width:100%;
          max-width:420px;
          text-align:left;
        "
      >

```env
WEB_PORT=3030      # Web UI / API (HTTP)
DB_PORT=54321      # PostgreSQL (TCP)
REDIS_PORT=63791   # Redis (TCP)
```

  </div>
  <br>
  <sub>All ports are <strong>configurable via <code>.env</code></strong> file</sub>
</td>
</tr>
</table>

</details>

---

<details open>
<summary><strong>🤖 AI Provider Configuration</strong></summary>
<br>

LocalSnips supports **multiple AI providers** with automatic detection:

<table
  align="center"
  cellspacing="0"
  cellpadding="8"
  style="
    border:1px solid rgba(127,127,127,.35);
    border-radius:12px;
    overflow:hidden;
    border-collapse:separate;
    border-spacing:0;
  "
>
  <tr>
    <th style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.25); text-align:center; vertical-align:middle;">
      Provider
    </th>
    <th style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.25); text-align:center; vertical-align:middle;">
      Environment Variable
    </th>
    <th style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.25); text-align:center; vertical-align:middle;">
      Models
    </th>
  </tr>
  <tr>
    <td align="center" style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
      <img style="border-radius: 8px;" src="https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white" alt="OpenAI">
    </td>
    <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); text-align:center;">
      <code>OPENAI_API_KEY</code>
    </td>
    <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
      GPT-4, GPT-4o-mini, text-embedding-3-small
    </td>
  </tr>
  <tr>
    <td align="center" style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
      <img style="border-radius: 8px;" src="https://img.shields.io/badge/Google_Gemini-4285F4?style=flat&logo=google&logoColor=white" alt="Gemini">
    </td>
    <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); text-align:center;">
      <code>GEMINI_API_KEY</code>
    </td>
    <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
      Gemini Pro, Gemini Flash
    </td>
  </tr>
  <tr>
    <td align="center" style="padding:10px 12px;">
      <img style="border-radius: 8px;" src="https://img.shields.io/badge/DeepSeek-00A67E?style=flat" alt="DeepSeek">
    </td>
    <td style="padding:10px 12px; text-align:center;">
      <code>DEEPSEEK_API_KEY</code>
    </td>
    <td style="padding:10px 12px;">
      DeepSeek-V2, DeepSeek-Coder
    </td>
  </tr>
</table>
</details>

---

<details open>
<summary><strong>📋 Additional Environment Variables</strong></summary>
<br>
<div style="background: #1e1e1e; border-radius: 12px; padding: 16px; overflow: hidden;">

```env
# =============================================================================
# DOCKER HOST PORTS (OPTIONAL)
# =============================================================================
# Customize the ports exposed to your host machine.
# If not set, these defaults are used:

WEB_PORT=3030
DB_PORT=54321
REDIS_PORT=63791

# =============================================================================
# DATA CONNECTIONS
# =============================================================================
# DATABASE
# Note: When running with Docker Compose, this is injected automatically.
# Only set this if you are using an external DB or need to override the default.

# Default (Docker): postgresql://localsnips:localsnips@db:5432/localsnips?schema=public
DATABASE_URL="postgresql://localsnips:localsnips@db:5432/localsnips?schema=public"

# REDIS
# Note: When running with Docker Compose, this is injected automatically.

# Default (Docker): redis://redis:6379
REDIS_URL="redis://redis:6379"

# =============================================================================
# AI PROVIDER CONFIGURATION (OPTIONAL)
# =============================================================================
# Set ACTIVE_AI_PROVIDER to choose which provider to use.
# Supported: openai, gemini, deepseek
# If not set, will auto-detect based on which API key is available.

ACTIVE_AI_PROVIDER=openai

# OPENAI
OPENAI_API_KEY=sk-your-openai-key-here

# GOOGLE GEMINI
GEMINI_API_KEY=AIza-your-gemini-key-here

# DEEPSEEK
DEEPSEEK_API_KEY=sk-your-deepseek-key-here

```

</div>
</details>

---

<details open>
<summary><strong>📁 Filesystem & Permissions</strong></summary>
<br>

<table width="100%" cellspacing="0" cellpadding="10">
  <tr>
    <td width="66%" valign="middle" align="left">
      <table
        cellspacing="0"
        cellpadding="8"
        style="
          width:100%;
          border:1px solid rgba(127,127,127,.35);
          border-radius:12px;
          overflow:hidden;
          border-collapse:separate;
          border-spacing:0;
        "
      >
        <tr>
          <th style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.25); text-align:center; vertical-align:middle;">
            Path
          </th>
          <th style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.25); text-align:center; vertical-align:middle;">
            Purpose
          </th>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap; text-align:center;">
            <code>~/Library/Application Support/LocalSnips/stack</code>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); text-align:center;">
            Backend config &amp; Docker context
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; white-space:nowrap; text-align:center;">
            <code>~/.docker/run/docker.sock</code>
          </td>
          <td style="padding:10px 12px; text-align:center;">
            Docker Engine socket
          </td>
        </tr>
      </table>
    </td>
    <td width="34%" valign="middle" align="center">
      <table
        cellspacing="0"
        cellpadding="10"
        style="
          width:100%;
          max-width:420px;
          border:1px solid rgba(127,127,127,.35);
          border-radius:12px;
          overflow:hidden;
          border-collapse:separate;
          border-spacing:0;
        "
      >
        <tr>
          <td align="center" style="padding:12px;">
            <strong>💡 TIP</strong><br>
            <br>
            <sub>
              The app runs entirely within your user scope (<code>~/</code>).<br>
              <strong>No root access required.</strong>
            </sub>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</details>

---

## About This Repository

This repository hosts the **static export build** of LocalSnips — a compiled, client-side-only version of the web UI designed for **public demonstration** without requiring any backend infrastructure.

<table width="100%" cellspacing="0" cellpadding="10">
  <tr>
    <td width="50%" valign="top">
      <table
        cellspacing="0"
        cellpadding="8"
        style="
          width:100%;
          border:1px solid rgba(127,127,127,.35);
          border-radius:12px;
          overflow:hidden;
          border-collapse:separate;
          border-spacing:0;
        "
      >
        <tr>
          <th colspan="2" style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.25); text-align:center;">
            ✅ <strong>Included</strong>
          </th>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">📦 Static Assets</td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">HTML, CSS, JS build artifacts</td>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">🎨 UI/UX Flows</td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">Complete interaction demos</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;">🧪 Mock Data</td>
          <td style="padding:10px 12px;">Simulated snippets & responses</td>
        </tr>
      </table>
    </td>
    <td width="50%" valign="top">
      <table
        cellspacing="0"
        cellpadding="8"
        style="
          width:100%;
          border:1px solid rgba(127,127,127,.35);
          border-radius:12px;
          overflow:hidden;
          border-collapse:separate;
          border-spacing:0;
        "
      >
        <tr>
          <th colspan="2" style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.25); text-align:center;">
            ❌ <strong>Not Included</strong>
          </th>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">🔒 Source Code</td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">Proprietary application logic</td>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">🐳 Backend Stack</td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">Docker, PostgreSQL, Redis</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;">⚙️ Production Config</td>
          <td style="padding:10px 12px;">API keys, secrets, env files</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

> [!NOTE]
> This preview runs **entirely client-side** using simulated data. No backend services, databases, or external APIs are required or contacted.

<p align="center">
  <img style="border-radius: 8px;" src="https://img.shields.io/badge/Type-Static_Preview-blue?style=flat" alt="Static Preview">
  <img style="border-radius: 8px;" src="https://img.shields.io/badge/Purpose-Product_Demo-green?style=flat" alt="Product Demo">
  <img style="border-radius: 8px;" src="https://img.shields.io/badge/Setup-Zero_Config-orange?style=flat" alt="Zero Config">
</p>

---

## Live Demo

<table align="center" width="100%" cellspacing="0" cellpadding="10">
  <tr>
    <td width="66%" valign="middle" align="center">
      <table
        align="center"
        cellspacing="0"
        cellpadding="8"
        style="
          width:100%;
          margin:0 auto;
          border:1px solid rgba(127,127,127,.35);
          border-radius:12px;
          overflow:hidden;
          border-collapse:separate;
          border-spacing:0;
        "
      >
        <tr>
          <td align="center" style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            <strong>🔗 URL</strong>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            <a href="https://yeraylois.github.io/localsnips-preview/">yeraylois.github.io/localsnips-preview</a>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            <strong>📧 Contact</strong>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            <a href="mailto:yerayloissanchez@gmail.com">yerayloissanchez@gmail.com</a>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap;">
            <strong>💼 LinkedIn</strong>
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            <a href="https://linkedin.com/in/yeray-lois">linkedin.com/in/yeray-lois</a>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:10px 12px; white-space:nowrap;">
            <strong>🐙 GitHub</strong>
          </td>
          <td style="padding:10px 12px;">
            <a href="https://github.com/yeraylois">github.com/yeraylois</a>
          </td>
        </tr>
      </table>
    </td>
    <td width="34%" valign="middle" align="center">
      <a href="https://yeraylois.github.io/localsnips-preview/">
        <img
          style="border-radius: 12px;"
          src="https://img.shields.io/badge/🌐_Open_Live_Preview-0066FF?style=for-the-badge&logoColor=white"
          alt="Open Live Preview"
        >
      </a>
      <br>
      <sub>Hosted on GitHub Pages<br>Static build · No backend</sub>
    </td>
  </tr>
</table>

---

## Ownership & License

> [!CAUTION]
> This repository is **proprietary**. No license is granted to use, copy, modify, distribute, sublicense, or create derivative works from this repository or its contents.

<details>
<summary><strong>📜 License Terms</strong></summary>

<table
  align="center"
  cellspacing="0"
  cellpadding="8"
  style="
    border:1px solid rgba(127,127,127,.35);
    border-radius:12px;
    overflow:hidden;
    border-collapse:separate;
    border-spacing:0;
  "
  >
  <tr>
    <th style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.25); text-align:center; vertical-align:middle;">
      Restriction
    </th>
    <th style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.25); text-align:center; vertical-align:middle;">
      Details
    </th>
  </tr>
  <tr>
    <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap; text-align:center;">
      ❌ <strong>No redistribution</strong>
    </td>
    <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
      You may not share or redistribute this software
    </td>
  </tr>
  <tr>
    <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap; text-align:center;">
      ❌ <strong>No modification</strong>
    </td>
    <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
      You may not modify or create derivative works
    </td>
  </tr>
  <tr>
    <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); white-space:nowrap; text-align:center;">
      ❌ <strong>No commercial use</strong>
    </td>
    <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
      Commercial use requires explicit authorization
    </td>
  </tr>
  <tr>
    <td style="padding:10px 12px; white-space:nowrap; text-align:center;">
      ❌ <strong>No sublicensing</strong>
    </td>
    <td style="padding:10px 12px;">
      You may not grant licenses to third parties
    </td>
  </tr>
</table>
<br>
</details>

<p align="center">
  <strong>Interested in licensing, partnership, or evaluation access?</strong>
</p>

<p align="center">
  <a href="mailto:yerayloissanchez@gmail.com">
    <img style="border-radius: 8px;" src="https://img.shields.io/badge/📧_Contact_for_Licensing-yerayloissanchez@gmail.com-0066FF?style=flat" alt="Contact for Licensing">
  </a>
</p>

<table 
  align="center"
  width="100%">
  <tr>
    <td align="center">
      <strong>Copyright © 2026 Yeray Lois Sánchez. All Rights Reserved.</strong>
    </td>
  </tr>
</table>

---

## Intellectual Property Notice

> [!WARNING]<br>
>
> > **LocalSnips** and all associated names, logos, UI/UX designs, source code, and documentation are the **exclusive intellectual property** of Yeray Lois Sánchez. All rights reserved under applicable copyright and intellectual property laws.

<table width="100%" cellspacing="0" cellpadding="10">
  <tr>
    <td width="72%" valign="top" align="left">
      <table
        cellspacing="0"
        cellpadding="8"
        style="
          width:100%;
          border:1px solid rgba(127,127,127,.35);
          border-radius:12px;
          overflow:hidden;
          border-collapse:separate;
          border-spacing:0;
        "
      >
        <tr>
          <th style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.25); text-align:center; vertical-align:middle;">
            Protected Asset
          </th>
          <th style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.25); text-align:center; vertical-align:middle;">
            Protection Type
          </th>
          <th style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.25); text-align:center; vertical-align:middle;">
            Status
          </th>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Product Name &quot;LocalSnips&quot;
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Common Law Rights
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); text-align:center; white-space:nowrap;">
            🔒 Protected
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Logo &amp; Visual Identity
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Copyright
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); text-align:center; white-space:nowrap;">
            🔒 Protected
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            UI/UX Design Patterns
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Copyright / Trade Dress
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); text-align:center; white-space:nowrap;">
            🔒 Protected
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Source Code &amp; Architecture
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18);">
            Copyright
          </td>
          <td style="padding:10px 12px; border-bottom:1px solid rgba(127,127,127,.18); text-align:center; white-space:nowrap;">
            🔒 Protected
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px;">
            Documentation &amp; Screenshots
          </td>
          <td style="padding:10px 12px;">
            Copyright
          </td>
          <td style="padding:10px 12px; text-align:center; white-space:nowrap;">
            🔒 Protected
          </td>
        </tr>
      </table>
    </td>
    <td width="28%" valign="middle" align="center">
      <p align="center" style="margin:0;">
        <img style="border-radius: 8px;" src="https://img.shields.io/badge/©_LocalSnips-Proprietary_IP-8B0000?style=flat" alt="LocalSnips Proprietary IP"><br>
        <br>
        <img style="border-radius: 8px;" src="https://img.shields.io/badge/First_Published-January_2026-555?style=flat" alt="First Published January 2026">
      </p>
    </td>
  </tr>
</table>

<details>
<summary><strong>⚖️ Legal Notice</strong></summary>
<br>

This repository and its contents constitute **prior art** and **evidence of authorship** as of the publication date shown above.

**Prohibited without written authorization:**

- Copying, reproducing, or redistributing any part of this work
- Creating derivative works based on this design or code
- Using "LocalSnips" name or branding for any purpose
- Reverse engineering or decompiling the application
- Commercial exploitation in any form

**Enforcement:**
The author reserves the right to pursue all available legal remedies against unauthorized use, including but not limited to: copyright infringement claims, unfair competition claims, and requests for injunctive relief.

**Evidence Preservation:**
All commits, timestamps, and version history in this repository serve as documentary evidence of authorship and publication dates.

</details>

---

<br>
<p align="center">
  <img style="border-radius: 8px;" src="https://img.shields.io/badge/Made_with_❤️_in_Spain-red?style=flat" alt="Made in Spain">
</p>

<p align="center">
  <sub><strong>LocalSnips © 2026 Yeray Lois Sánchez</strong></sub><br/>
  <sub>Proprietary preview build · All Rights Reserved</sub><br/>
  <sub><em>First published: January 2026 · This document serves as proof of prior art</em></sub>
</p>
