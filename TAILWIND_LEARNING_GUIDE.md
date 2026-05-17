# Tailwind CSS Complete Walkthrough
## Project: `tailwind-shoes` — A Full Reverse-Engineering Guide

> **How to use this document:** This is a project-driven learning document. Every concept, class, and configuration explained here is directly derived from the code in this project. Nothing is theoretical. Read it as a reverse-engineering tour of how Tailwind CSS is actually applied in a real React application.

---

## Table of Contents

- [**PART 1 — Installation & Configuration**](#part-1--installation--configuration)
  - [1.0 Step-by-Step Installation Commands](#10-step-by-step-installation-commands)
  - [1.1 What Version of Tailwind Is This?](#11-what-version-of-tailwind-is-this)
  - [1.2 NPM Packages](#12-npm-packages)
  - [1.3 Vite Configuration (`vite.config.js`)](#13-vite-configuration-viteconfigjs)
  - [1.4 The Global CSS File (`src/index.css`)](#14-the-global-css-file-srcindexcss--full-explanation)
  - [1.5 How `index.css` Enters the App](#15-how-indexcss-enters-the-app-srcmainjsx)
  - [1.6 `index.html`](#16-indexhtml)
  - [1.7 Files That Do NOT Exist (and Why)](#17-files-that-do-not-exist-and-why)
  - [1.8 Environment Variables (.env)](#18-environment-variables-env)
- [**PART 2 — Global Tailwind Features**](#part-2--global-tailwind-features)
  - [2.1 Custom Color Tokens](#21-custom-color-tokens)
  - [2.2 Custom Animations](#22-custom-animations)
  - [2.3 Custom Utility: `.flex-center`](#23-custom-utility-flex-center)
  - [2.4 Dark Mode System](#24-dark-mode-system)
- [**PART 3 — Component Walkthroughs**](#part-3--component-walkthroughs)
  - [3.1 `src/constants.js`](#31-srcconstantsjs)
  - [3.2 `src/App.jsx`](#32-srcappjsx)
  - [3.3 `src/components/Nav.jsx`](#33-srccomponentsnavjsx)
  - [3.4 `src/components/ShoeDetail.jsx`](#34-srccomponentsshoedetailjsx)
  - [3.5 `src/components/NewArrivalsSection.jsx`](#35-srccomponentsnewarrivalssectionjsx)
  - [3.6 `src/components/Card.jsx`](#36-srccomponentscardjsx)
  - [3.7 `src/components/Sidebar.jsx`](#37-srccomponentssidebarjsx)
  - [3.8 `src/components/Cart.jsx`](#38-srccomponentscartjsx)
  - [3.9 `src/components/CartItem.jsx`](#39-srccomponentscartitemjsx)
  - [3.10 `src/components/Select.jsx`](#310-srccomponentsselectjsx)
- [**PART 4 — Cross-Cutting Patterns**](#part-4--cross-cutting-patterns)
  - [4.1 Responsive Design System](#41-responsive-design-system)
  - [4.2 Flex Layout Patterns](#42-flex-layout-patterns)
  - [4.3 Positioning Patterns](#43-positioning-patterns)
  - [4.4 Spacing Patterns](#44-spacing-patterns)
  - [4.5 Typography Patterns](#45-typography-patterns)
  - [4.6 Arbitrary Values Summary](#46-arbitrary-values-summary)
  - [4.7 State Variant Patterns](#47-state-variant-patterns)
  - [4.8 Animation Patterns](#48-animation-patterns)
- [**PART 5 — Quick Reference**](#part-5--quick-reference)
  - [5.1 All Files and Their Tailwind Role](#51-all-files-and-their-tailwind-role)
  - [5.2 Tailwind v4 Features Used in This Project](#52-tailwind-v4-features-used-in-this-project)

---

---

# PART 1 — INSTALLATION & CONFIGURATION

---

## 1.0 Step-by-Step Installation Commands

This section shows the exact commands needed to reproduce the Tailwind v4 + Vite setup used in this project from scratch.

---

### Step 1 — Create a new Vite + React project

```bash
npm create vite@latest tailwind-shoes -- --template react
cd tailwind-shoes
```

This scaffolds a standard Vite project with React. You get `src/main.jsx`, `src/App.jsx`, and `vite.config.js` out of the box.

---

### Step 2 — Install Tailwind CSS v4 and the official Vite plugin

```bash
npm install tailwindcss @tailwindcss/vite
```

| Package | What it does |
|---|---|
| `tailwindcss` | The core Tailwind CSS v4 framework |
| `@tailwindcss/vite` | Official Vite plugin — integrates Tailwind directly into Vite's pipeline without PostCSS |

> **Why no `postcss` or `autoprefixer`?** In Tailwind v4, the `@tailwindcss/vite` plugin handles all CSS transformation internally. PostCSS is no longer needed.

> **Why no `tailwind.config.js`?** In Tailwind v4, all configuration (theme, dark mode, plugins) is done in CSS using `@theme`, `@custom-variant`, and `@layer` directives directly in your CSS file. No JavaScript config file is needed.

---

### Step 3 — Register the Tailwind plugin in `vite.config.js`

Open `vite.config.js` and add `tailwindcss()` to the plugins array:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";   // ← import

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),   // ← register plugin
  ],
});
```

This is the only change needed in `vite.config.js`. Tailwind is now wired into Vite's build pipeline.

---

### Step 4 — Configure `src/index.css`

Replace the default contents of `src/index.css` with the Tailwind v4 import:

```css
@import "tailwindcss";
```

This single line replaces the three directives from Tailwind v3 (`@tailwind base`, `@tailwind components`, `@tailwind utilities`). It loads the full Tailwind framework.

**This is the minimum required setup.** This project extends it further — see [Section 1.4](#14-the-global-css-file-srcindexcss--full-explanation) for the full `index.css` with custom theme, dark mode, and utilities.

---

### Step 5 — Make sure `index.css` is imported in `src/main.jsx`

```jsx
import "./index.css";   // ← this line must exist
```

Vite detects this import and runs the `@tailwindcss/vite` plugin on it, compiling all Tailwind classes used in your components into the output CSS. If this import is missing, no Tailwind styles will load.

---

### Step 6 — Start the dev server

```bash
npm run dev
```

Tailwind is now active. Any utility class you add to your JSX components will be compiled and applied automatically.

---

### Additional packages used in this project

These packages are not required for Tailwind to work, but are used in this project:

```bash
# Variable font (loaded via npm instead of Google Fonts CDN)
npm install @fontsource-variable/nunito-sans

# Icon library used for nav, cart, and UI icons
npm install react-icons

# Merges conflicting Tailwind classes intelligently (used in Select.jsx)
npm install tw-merge
```

```bash
# Dev tools: auto-sorts Tailwind classes in Prettier
npm install --save-dev prettier prettier-plugin-tailwindcss
```

To activate `prettier-plugin-tailwindcss`, add this to your `.prettierrc`:

```json
{
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

### Full setup summary

| Step | Command / File | What it does |
|---|---|---|
| 1 | `npm create vite@latest ... --template react` | Scaffolds the project |
| 2 | `npm install tailwindcss @tailwindcss/vite` | Installs Tailwind v4 |
| 3 | Add `tailwindcss()` to `vite.config.js` plugins | Wires Tailwind into Vite |
| 4 | Add `@import "tailwindcss"` to `index.css` | Activates all Tailwind utilities |
| 5 | `import "./index.css"` in `main.jsx` | Ensures Vite processes the CSS |
| 6 | `npm run dev` | Start development |

---

## 1.1 What Version of Tailwind Is This?

This project uses **Tailwind CSS v4** (specifically `^4.3.0`).

Tailwind v4 is a major evolution from v3. The biggest changes that affect this project:

| Feature | Tailwind v3 | Tailwind v4 (this project) |
|---|---|---|
| Config file | `tailwind.config.js` required | No `tailwind.config.js` at all |
| CSS entry point | `@tailwind base/components/utilities` | Single `@import "tailwindcss"` |
| Theme customization | JS config file | `@theme {}` block in CSS |
| Dark mode config | `darkMode: 'class'` in config | `@custom-variant dark (...)` in CSS |
| Vite integration | PostCSS plugin | Official `@tailwindcss/vite` plugin |
| PostCSS needed? | Yes | No |

This matters because if you have previously used Tailwind v3, **you will not find a `tailwind.config.js` or `postcss.config.js` in this project** — and that is intentional.

---

## 1.2 NPM Packages

From `package.json`:

```json
{
  "dependencies": {
    "@fontsource-variable/nunito-sans": "^5.2.7",
    "@tailwindcss/vite": "^4.3.0",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "react-icons": "^5.6.0",
    "tailwindcss": "^4.3.0",
    "tw-merge": "^0.0.1-alpha.3"
  },
  "devDependencies": {
    "prettier-plugin-tailwindcss": "^0.8.0",
    "vite": "^8.0.12",
    ...
  }
}
```

### Tailwind-related packages explained:

| Package | Version | Type | Purpose |
|---|---|---|---|
| `tailwindcss` | `^4.3.0` | dependency | The core Tailwind CSS framework |
| `@tailwindcss/vite` | `^4.3.0` | dependency | Official Vite plugin for Tailwind v4 — replaces PostCSS |
| `tw-merge` | `^0.0.1-alpha.3` | dependency | Merges conflicting Tailwind classes intelligently at runtime |
| `prettier-plugin-tailwindcss` | `^0.8.0` | devDependency | Auto-sorts Tailwind class names in a consistent order when Prettier formats code |

### Other notable packages:

- **`@fontsource-variable/nunito-sans`** — The Nunito Sans variable font loaded from npm (not Google Fonts CDN). This is how the project loads a custom font without any external CDN dependency.
- **`react-icons`** — Provides `RxHamburgerMenu`, `TbShoppingBag`, `CiTrash`, `BiSun`, `BiMoon`, `IoIosArrowDown` icons used throughout the UI.

---

## 1.3 Vite Configuration (`vite.config.js`)

```js
import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    svgr(),
  ],
  server: {
    port: 3000,
  },
});
```

### How Tailwind connects to Vite:

```js
import tailwindcss from "@tailwindcss/vite";
// ...
plugins: [tailwindcss()]
```

This single line is the **entire Tailwind integration**. The `@tailwindcss/vite` plugin intercepts CSS files processed by Vite and runs the Tailwind compiler on them. No PostCSS, no separate config — Vite handles everything.

**Why no PostCSS?** In Tailwind v4, the `@tailwindcss/vite` plugin talks directly to Vite's transform pipeline. PostCSS was the integration mechanism in v3, but v4 has a native Vite plugin that is faster and simpler.

**`tailwindcss()` is called with no arguments** because all configuration lives inside `src/index.css` using the `@theme` block — the CSS file itself is the configuration.

### Other plugins:
- `react()` — Enables JSX transform for React components
- `babel({ presets: [reactCompilerPreset()] })` — Enables the experimental React Compiler (auto-memoization)
- `svgr()` — Enables SVG files to be imported as React components (`NikeLogo.svg?react`)

---

## 1.4 The Global CSS File (`src/index.css`) — Full Explanation

This is the most important file for understanding how Tailwind is configured in this project. **Everything that in Tailwind v3 would have lived in `tailwind.config.js` now lives here.**

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@layer base {
  body {
    font-family: "Nunito Sans Variable", sans-serif;
  }
}

@layer utilities {
  .flex-center {
    @apply flex items-center justify-center;
  }
}

@theme {
  --color-night: #0d1120;
  --color-night-50: #171e2c;
  --color-night-500: #0d1120;

  --animate-wiggle: wiggle 1s ease-in-out infinite;
  @keyframes wiggle {
    0%   { transform: rotate(-3deg); }
    50%  { transform: rotate(3deg); }
    100% { transform: rotate(-3deg); }
  }

  --animate-float: float 4s ease-in-out infinite;
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-10px); }
  }

  --animate-fadeIn: fadeIn 1s ease-in-out;
  @keyframes fadeIn {
    0%   { opacity: 0; }
    100% { opacity: 1; }
  }
}
```

### Directive-by-Directive Explanation:

---

### `@import "tailwindcss"`

```css
@import "tailwindcss";
```

**What it does:** This single line imports the entire Tailwind CSS framework into your stylesheet.

**In Tailwind v3**, you needed three separate lines:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**In Tailwind v4** (this project), `@import "tailwindcss"` replaces all three at once. It loads Tailwind's reset/normalize styles (base), component defaults, and all utility classes in one import.

The `@tailwindcss/vite` plugin resolves this import and compiles only the utility classes actually used in the project — unused classes are removed from the final CSS output.

---

### `@custom-variant dark`

```css
@custom-variant dark (&:where(.dark, .dark *));
```

**What it does:** Defines how the `dark:` prefix works in this project.

**Breaking down the syntax:**
- `@custom-variant dark` — registers a new variant named `dark`
- `(&:where(.dark, .dark *))` — defines the CSS selector condition: applies when the element itself OR any of its ancestors has the `.dark` class

**What this means in practice:** When you write a class like `dark:bg-night`, Tailwind generates this CSS:
```css
:where(.dark, .dark *) .dark\:bg-night {
  background-color: #0d1120;
}
```

**In Tailwind v3**, this was configured in JavaScript:
```js
// tailwind.config.js (v3 approach — NOT used in this project)
module.exports = {
  darkMode: 'class',
}
```

**In this project (v4)**, it's done in CSS with `@custom-variant`. The dark mode is toggled by adding/removing the `dark` class on `<html>` — which is exactly what `App.jsx` does via `document.documentElement.classList.toggle("dark")`.

---

### `@layer base`

```css
@layer base {
  body {
    font-family: "Nunito Sans Variable", sans-serif;
  }
}
```

**What it does:** Adds CSS rules to Tailwind's "base" layer — the layer that contains resets and foundational HTML element styles.

**Why `@layer base` instead of just writing the CSS directly?** Tailwind processes CSS in three layers: `base`, `components`, `utilities`. By putting global element styles in `@layer base`, you ensure they load in the correct cascade order and can be overridden by utility classes when needed.

**Effect:** Every `<body>` element in the app uses the Nunito Sans Variable font instead of the browser default (Times New Roman, sans-serif, etc.). The `@fontsource-variable/nunito-sans` package provides the actual font files — it's imported in `main.jsx` to make the font available.

---

### `@layer utilities`

```css
@layer utilities {
  .flex-center {
    @apply flex items-center justify-center;
  }
}
```

**What it does:** Creates a custom reusable utility class named `.flex-center`.

**`@apply`** is a Tailwind directive that composes existing utility classes into a new rule. So `.flex-center` compiles to:
```css
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

**Why create this?** The combination of `flex items-center justify-center` is used many times across the project (Nav cart icon, CartItem rows, Select arrow, NewArrivalsSection heading, ShoeDetail gradient div). Rather than repeating all three classes every time, `.flex-center` is a DRY shorthand.

**Using `@layer utilities`** ensures this custom class participates in Tailwind's utility layer — it can be overridden by responsive prefixes and state variants just like any built-in utility.

---

### `@theme`

```css
@theme {
  --color-night: #0d1120;
  --color-night-50: #171e2c;
  --color-night-500: #0d1120;

  --animate-wiggle: wiggle 1s ease-in-out infinite;
  @keyframes wiggle { ... }

  --animate-float: float 4s ease-in-out infinite;
  @keyframes float { ... }

  --animate-fadeIn: fadeIn 1s ease-in-out;
  @keyframes fadeIn { ... }
}
```

**What it does:** The `@theme` block is Tailwind v4's CSS-first replacement for the `theme.extend` section of `tailwind.config.js`. Any CSS custom property (variable) defined inside `@theme` becomes a Tailwind design token.

**How CSS variables in `@theme` become utility classes:**

Tailwind v4 reads `@theme` and automatically generates utility classes from the variable names using a naming convention:

| Variable in `@theme` | Generated Tailwind classes |
|---|---|
| `--color-night: #0d1120` | `bg-night`, `text-night`, `border-night`, `fill-night`, etc. |
| `--color-night-50: #171e2c` | `bg-night-50`, `text-night-50`, etc. |
| `--color-night-500: #0d1120` | `bg-night-500`, `text-night-500`, etc. |
| `--animate-wiggle: ...` | `animate-wiggle` |
| `--animate-float: ...` | `animate-float` |
| `--animate-fadeIn: ...` | `animate-fadeIn` |

The naming pattern is: `--{category}-{name}` → generates utilities for that category using the name as the suffix.

**`@keyframes` inside `@theme`:** In Tailwind v4, you define animation keyframes directly inside `@theme` alongside the animation variable. This keeps everything in one place.

---

## 1.5 How `index.css` Enters the App (`src/main.jsx`)

```jsx
import "@fontsource-variable/nunito-sans"; // Loads font CSS + font files
import "./index.css";                       // Loads Tailwind + custom theme
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

**The flow:**
1. `@fontsource-variable/nunito-sans` is imported — this side-effect import injects the Nunito Sans font CSS into the page.
2. `./index.css` is imported — Vite processes this through the `@tailwindcss/vite` plugin, which compiles all Tailwind classes used in the project and outputs final CSS.
3. The compiled CSS is automatically injected into the page by Vite during development, and bundled into the output during production build.

---

## 1.6 `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>tailwind-shoes</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**No Tailwind CDN links here** — there are no `<link rel="stylesheet">` tags. All CSS comes through the Vite pipeline via `main.jsx`'s import of `index.css`.

The `<html>` element starts with no `class="dark"` — dark mode is toggled at runtime by `App.jsx` adding the `.dark` class to `document.documentElement`.

---

## 1.7 Files That Do NOT Exist (and Why)

| File | Exists? | Why Not? |
|---|---|---|
| `tailwind.config.js` | ❌ No | Tailwind v4 uses `@theme` in CSS instead |
| `postcss.config.js` | ❌ No | Tailwind v4's Vite plugin makes PostCSS unnecessary |

---

## 1.8 Environment Variables (.env)

Vite has built-in support for `.env` files. This project uses three env files to separate shared config, local overrides, and a committed template.

### The three `.env` files

| File | Committed? | Purpose |
|---|---|---|
| `.env` | ✅ Yes | Shared base variables for all developers |
| `.env.local` | ❌ No (gitignored via `*.local`) | Machine-specific local overrides |
| `.env.example` | ✅ Yes | Documents all required variables — copy to `.env` when onboarding |

### `.env` (base config)

```bash
# Application
VITE_APP_TITLE=Tailwind Shoes

# Development server port
VITE_DEV_PORT=3000
```

### `.env.local` (local overrides — gitignored)

```bash
# Local overrides — never committed to git.
# Values here take precedence over .env.

# Example: run on a different port on this machine
# VITE_DEV_PORT=3001
```

### `.env.example` (committed template)

```bash
# Copy this file to .env and fill in your values.
VITE_APP_TITLE=Tailwind Shoes
VITE_DEV_PORT=3000
```

---

### The `VITE_` prefix rule

Vite exposes environment variables to your React components **only if they start with `VITE_`**. This is a security measure — without it, any `.env` variable (including secrets) would be bundled into the client-side JS.

```js
// In any component or JS file — only works for VITE_ prefixed vars
console.log(import.meta.env.VITE_APP_TITLE); // "Tailwind Shoes"
console.log(import.meta.env.VITE_DEV_PORT);  // "3000" (always a string)
```

Variables used only in `vite.config.js` (like `VITE_DEV_PORT` for the server port) do not need to be `VITE_` prefixed, but using the prefix keeps things consistent and readable.

---

### How `vite.config.js` reads `.env` files

By default, the Vite config file runs in a Node.js context and does not automatically have access to `.env` variables. Vite provides `loadEnv()` to explicitly load them:

```js
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Load all env vars from .env / .env.local / .env.[mode]
  // The third argument "" means: load ALL vars, not just VITE_-prefixed ones
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [...],
    server: {
      port: Number(env.VITE_DEV_PORT) || 3000,
    },
  };
});
```

**`mode`** is the Vite build mode — `"development"` when running `vite` (dev server) or `"production"` when running `vite build`. Vite also loads mode-specific files: `.env.development` or `.env.production` in addition to the base `.env`.

**`process.cwd()`** is the project root directory — where Vite looks for `.env` files.

**`Number(env.VITE_DEV_PORT) || 3000`** — env vars are always strings, so `Number()` converts `"3000"` to the integer `3000`. The `|| 3000` fallback protects against the variable being undefined or empty.

---

### Vite's `.env` file loading priority

When the same variable is defined in multiple files, Vite resolves them in this order (higher = wins):

```
.env.local           ← highest priority (machine-specific, gitignored)
.env.[mode].local    ← e.g. .env.development.local
.env.[mode]          ← e.g. .env.development or .env.production
.env                 ← lowest priority (base, shared)
```

This means `.env.local` always overrides `.env`. That's why a developer can change their local port in `.env.local` without affecting the committed `.env`.

---

---

# PART 2 — GLOBAL TAILWIND FEATURES

---

## 2.1 Custom Color Tokens

Defined in `@theme` inside `index.css`:

```css
@theme {
  --color-night: #0d1120;
  --color-night-50: #171e2c;
  --color-night-500: #0d1120;
}
```

The `night` color family is a near-black dark navy used as the application's dark mode background.

**Where these colors are used:**

| Class | Where Used | Visual Effect |
|---|---|---|
| `dark:bg-night` | `App.jsx` root div, `Sidebar.jsx` panel | Dark navy page background in dark mode |
| `bg-night-50` | `App.jsx` dark mode toggle button | Dark navy button background in light mode |
| `dark:text-night` | `App.jsx` dark mode toggle icon | Dark navy icon color on white button in dark mode |

The `night-50` and `night-500` variants follow Tailwind's standard color scale naming convention (50 = lightest, 500 = medium, 900 = darkest), though in this project `night-500` happens to be the same value as `night`.

---

## 2.2 Custom Animations

Three animations are registered in `@theme`. Each follows the same pattern: a CSS variable defines the animation shorthand, and `@keyframes` defines the motion.

### `animate-float`

```css
--animate-float: float 4s ease-in-out infinite;
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-10px); }
}
```

- **Duration:** 4 seconds
- **Easing:** ease-in-out (starts slow, speeds up, slows down)
- **Repeat:** infinite
- **Motion:** The element floats up 10px at the midpoint, returns to original position
- **Used in:** `ShoeDetail.jsx` — applied to the hero shoe image with `animate-float`

### `animate-fadeIn`

```css
--animate-fadeIn: fadeIn 1s ease-in-out;
@keyframes fadeIn {
  0%   { opacity: 0; }
  100% { opacity: 1; }
}
```

- **Duration:** 1 second
- **Easing:** ease-in-out
- **Repeat:** Once (no `infinite`)
- **Motion:** Fades from invisible to fully visible
- **Used in:** `App.jsx` — applied to the root `<div>` so the entire app fades in on mount

### `animate-wiggle`

```css
--animate-wiggle: wiggle 1s ease-in-out infinite;
@keyframes wiggle {
  0%   { transform: rotate(-3deg); }
  50%  { transform: rotate(3deg); }
  100% { transform: rotate(-3deg); }
}
```

- **Duration:** 1 second
- **Motion:** Rocks left (-3°) to right (3°) to left continuously
- **Used in:** Defined but not applied to any element in the analyzed files — available for future use

---

## 2.3 Custom Utility: `.flex-center`

```css
@layer utilities {
  .flex-center {
    @apply flex items-center justify-center;
  }
}
```

**Used in 5 places across the project:**

| Component | Element | Purpose |
|---|---|---|
| `Nav.jsx` | Cart icon circle | Centers shopping bag icon in circle button |
| `CartItem.jsx` | Product row | Centers image and text in the item row |
| `Select.jsx` | Arrow overlay | Centers dropdown arrow icon |
| `NewArrivalsSection.jsx` | Heading wrapper | Centers "NEW ARRIVALS" title |
| `ShoeDetail.jsx` | Gradient container | Centers floating shoe image |

---

## 2.4 Dark Mode System

**How it works end-to-end:**

1. **Definition** (`index.css`):
   ```css
   @custom-variant dark (&:where(.dark, .dark *));
   ```

2. **Toggle** (`App.jsx`):
   ```js
   const toggleDarkMode = () => {
     document.documentElement.classList.toggle("dark");
     localStorage.setItem("isdarkMode", document.documentElement.classList.contains("dark"));
   };
   ```

3. **Persistence** (`App.jsx` `useEffect`):
   ```js
   useEffect(() => {
     const isdarkMode = localStorage.getItem("isdarkMode");
     if (isdarkMode && isdarkMode === "true") {
       document.documentElement.classList.add("dark");
     }
   }, []);
   ```

4. **UI Toggle** (`App.jsx` — sun/moon icon button):
   - Light mode: Shows moon icon (`BiMoon`), dark button style
   - Dark mode: Shows sun icon (`BiSun`), white button style

**Complete list of `dark:` classes used across the project:**

| Class | File | Effect |
|---|---|---|
| `dark:fill-white` | `Nav.jsx` | Nike logo SVG turns white |
| `dark:text-gray-400` | `Nav.jsx` | Hamburger icon turns gray |
| `dark:hover:bg-gray-700` | `Nav.jsx` | Hamburger hover becomes dark gray |
| `lg:dark:text-white` | `Nav.jsx` | Desktop nav link text turns white |
| `dark:text-white` | `Cart.jsx` | "Cart" heading turns white |
| `dark:text-white` | `CartItem.jsx` | Cart item text turns white |
| `dark:hover:text-black` | `CartItem.jsx` | Text turns black on hover (over amber bg) |
| `dark:bg-night` | `Sidebar.jsx` | Panel background turns dark navy |
| `dark:text-white` | `Sidebar.jsx` | Close button text turns white |
| `dark:text-black` | `Select.jsx` | Select input text forced black |
| `dark:text-black` | `Select.jsx` | Arrow icon forced black |
| `dark:text-white` | `ShoeDetail.jsx` | All hero text turns white |
| `dark:text-white` | `NewArrivalsSection.jsx` | Section heading turns white |
| `dark:bg-night` | `App.jsx` | Page background turns dark navy |
| `dark:bg-white` | `App.jsx` | Toggle button turns white |
| `dark:text-night` | `App.jsx` | Toggle button icon turns dark navy |
| `dark:block` | `App.jsx` | Sun icon shown in dark mode |
| `dark:hidden` | `App.jsx` | Moon icon hidden in dark mode |

---

---

# PART 3 — COMPONENT WALKTHROUGHS

---

## 3.1 `src/constants.js`

```js
export const SHOE_LIST = [
  { id: 1, src: nike1, className: "bg-[#EEFFA4]", title: "Nike Air Max 270", price: 160 },
  { id: 2, src: nike2, className: "bg-[#DDCEFD]", title: "Nike Air Vapor",   price: 100 },
  { id: 3, src: nike3, className: "bg-[#DAFFA2]", title: "Nike Air Max 2090", price: 150 },
  { id: 4, src: nike4, className: "bg-[#FCC4EA]", title: "Nike Air Blazer",  price: 110 },
];
```

### Data-Driven Dynamic Classes

The `className` property on each product object stores a Tailwind class string. The `Card` component receives this and applies it via `className={item.className}`.

| Class | Color | Visual |
|---|---|---|
| `bg-[#EEFFA4]` | `#EEFFA4` — lime yellow | Nike Air Max 270 card |
| `bg-[#DDCEFD]` | `#DDCEFD` — soft lavender | Nike Air Vapor card |
| `bg-[#DAFFA2]` | `#DAFFA2` — light green | Nike Air Max 2090 card |
| `bg-[#FCC4EA]` | `#FCC4EA` — blush pink | Nike Air Blazer card |

**Why arbitrary values (`bg-[#hex]`)?** These exact hex colors do not exist in Tailwind's default color palette. Tailwind's arbitrary value system allows any valid CSS value to be used inside `[square brackets]`, generating a one-off utility class for that exact value.

**Critical Tailwind scanning note:** These class strings are stored as **full string literals** in the data file. Tailwind's content scanner reads all source files and finds complete class names. This works correctly. If the classes were constructed programmatically (e.g., `` `bg-[${hex}]` ``), Tailwind's scanner would miss them and they'd be stripped from the production CSS.

---

## 3.2 `src/App.jsx`

```jsx
export default function App() {
  // dark mode state management via document.documentElement.classList
  // cart state management

  return (
    <div className="animate-fadeIn dark:bg-night p-10 xl:px-24">
      <Nav ... />
      <ShoeDetail ... />
      <NewArrivalsSection ... />
      <Sidebar ...><Cart ... /></Sidebar>
      <div className="fixed right-4 bottom-4">
        <button className="bg-night-50 dark:text-night cursor-pointer rounded-full px-4 py-2 text-white shadow-lg dark:bg-white">
          <BiSun className="hidden dark:block" />
          <BiMoon className="dark:hidden" />
        </button>
      </div>
    </div>
  );
}
```

### Root `<div>` — `animate-fadeIn dark:bg-night p-10 xl:px-24`

**`animate-fadeIn`**
- CSS: `animation: fadeIn 1s ease-in-out`
- The entire application (nav, hero, product grid) fades in from invisible to visible over 1 second when the component mounts.
- Uses the custom animation defined in `@theme`.
- This runs once (no `infinite`), creating a polished app-load experience.

**`dark:bg-night`**
- CSS (dark mode): `background-color: #0d1120`
- The page background becomes deep dark navy in dark mode.
- Uses the custom `--color-night` color token from `@theme`.
- Since this is the root wrapper, it sets the page background for all content.

**`p-10`**
- CSS: `padding: 2.5rem` (40px all sides)
- Creates uniform 40px inset padding on all four edges of the page.
- Mobile baseline: all content has breathing room from the viewport edges.

**`xl:px-24`**
- CSS (at 1280px+): `padding-left: 6rem; padding-right: 6rem` (96px each side)
- On large desktops, horizontal padding grows from 40px to 96px.
- Prevents content from stretching edge-to-edge on very wide monitors.
- Note: `xl:px-24` overrides only horizontal padding (`px`) — vertical padding stays at the `p-10` value.

---

### Dark Mode Toggle `<div>` — `fixed right-4 bottom-4`

**`fixed`** → `position: fixed` — stays at the same viewport position regardless of page scroll.

**`right-4`** → `right: 1rem` (16px) — 16px from the right edge of the viewport.

**`bottom-4`** → `bottom: 1rem` (16px) — 16px from the bottom of the viewport.

Together: creates a Floating Action Button (FAB) pinned to the bottom-right corner of the screen.

---

### Toggle `<button>` — `bg-night-50 dark:text-night cursor-pointer rounded-full px-4 py-2 text-white shadow-lg dark:bg-white`

**`bg-night-50`**
- CSS: `background-color: #171e2c`
- Dark navy background in light mode, creating a visually prominent toggle button.
- Uses the custom `--color-night-50` token.

**`dark:text-night`**
- CSS (dark mode): `color: #0d1120`
- In dark mode, the icon becomes very dark navy — this works because the button's background is `dark:bg-white` in dark mode, so dark text is readable.

**`cursor-pointer`** → `cursor: pointer` — hand cursor on hover.

**`rounded-full`** → `border-radius: 9999px` — creates a pill/circular shape.

**`px-4`** → `padding-left/right: 1rem` (16px each side) — horizontal interior padding.

**`py-2`** → `padding-top/bottom: 0.5rem` (8px each side) — vertical interior padding. The button is wider than tall (pill shape).

**`text-white`**
- CSS: `color: white`
- White icon (`BiMoon`) in light mode against the dark navy button background.

**`shadow-lg`**
- CSS: `box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`
- Prominent shadow that makes the FAB appear elevated above the page.

**`dark:bg-white`**
- CSS (dark mode): `background-color: white`
- Complete inversion in dark mode: white button with dark icon, creating the "switch to light mode" appearance.

---

### Sun/Moon Icon Toggle Pattern

```jsx
<BiSun className="hidden dark:block" />
<BiMoon className="dark:hidden" />
```

**`hidden`** (on BiSun) → `display: none` — Sun is hidden in light mode.

**`dark:block`** (on BiSun) → `display: block` in dark mode — Sun becomes visible.

**`dark:hidden`** (on BiMoon) → `display: none` in dark mode — Moon is hidden.

**The result:**

| Mode | BiSun (☀️) | BiMoon (🌙) |
|---|---|---|
| Light mode | Hidden | Visible |
| Dark mode | Visible | Hidden |

This is a clean, CSS-only icon toggle — no JavaScript conditional rendering needed.

---

## 3.3 `src/components/Nav.jsx`

```jsx
const ROUTES = ["Home", "About", "Services", "Pricing", "Contact"];

export default function Nav({ onClickCart }) {
  const [isMobileMenuShow, setIsMobileMenu] = useState(true);
  return (
    <nav className="relative z-10 flex flex-wrap items-center justify-between">
      <a href="#">
        <NikeLogo className="h-20 w-20 dark:fill-white" />
      </a>
      <button
        onClick={() => setIsMobileMenu(!isMobileMenuShow)}
        className="rounded-lg p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 lg:hidden dark:text-gray-400 dark:hover:bg-gray-700"
      >
        <RxHamburgerMenu size={25} />
      </button>
      <div className={`${isMobileMenuShow && "hidden"} w-full lg:block lg:w-auto`}>
        <ul className="flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 text-lg lg:flex-row lg:space-x-8 lg:border-none lg:bg-transparent">
          {ROUTES.map((route, i) => (
            <li
              className={`cursor-pointer rounded px-3 py-2 lg:hover:bg-transparent lg:hover:text-blue-400 lg:dark:text-white
                ${i === 0 ? "bg-blue-500 text-white lg:bg-transparent lg:text-blue-500" : "hover:bg-gray-100"}
                ${(i === 3 || i === 4) && "lg:text-white"}`}
              key={route}
            >{route}</li>
          ))}
        </ul>
      </div>
      <div onClick={onClickCart} className="fixed bottom-4 left-4 lg:static lg:mr-8">
        <div className="flex-center h-12 w-12 cursor-pointer rounded-full bg-white shadow">
          <TbShoppingBag />
        </div>
      </div>
    </nav>
  );
}
```

---

### `<nav>` — `relative z-10 flex flex-wrap items-center justify-between`

**`relative`** → `position: relative`
- Establishes a positioning context. Any absolutely positioned children are positioned relative to this element.
- Also required for `z-10` to take effect properly in the stacking context.

**`z-10`** → `z-index: 10`
- Places the nav bar above elements with lower z-index values (like background images or hero sections).
- Prevents the nav from being covered by page content that might overlap.

**`flex`** → `display: flex`
- Makes the nav a flex container. Logo, hamburger button, nav items div, and cart icon become flex children arranged horizontally.

**`flex-wrap`** → `flex-wrap: wrap`
- Allows flex children to wrap to a new line.
- On mobile, the nav items div has `w-full`, which causes it to wrap to a second line below the logo and hamburger — creating the mobile stacked layout without a media query on the parent.

**`items-center`** → `align-items: center`
- Vertically centers all nav elements along the cross (vertical) axis.
- Keeps logo, hamburger, and cart icon all at the same vertical midpoint.

**`justify-between`** → `justify-content: space-between`
- Pushes first child (logo) to far left, last child (cart icon on desktop) to far right.
- Creates the canonical nav layout: logo left, content middle/right.

---

### Nike Logo — `h-20 w-20 dark:fill-white`

**`h-20`** → `height: 5rem` (80px) — Sets SVG height to 80px.

**`w-20`** → `width: 5rem` (80px) — Sets SVG width to 80px. Square bounding box.

**`dark:fill-white`**
- CSS (dark mode): `fill: white`
- The Nike logo is an SVG with dark paths. In dark mode this changes the SVG fill to white, making the logo visible against the dark background.
- `fill` is an SVG-specific CSS property that controls the interior color of SVG shapes.

---

### Hamburger Button — `rounded-lg p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 lg:hidden dark:text-gray-400 dark:hover:bg-gray-700`

**`rounded-lg`** → `border-radius: 0.5rem` (8px) — Soft rounded corners on the button.

**`p-2`** → `padding: 0.5rem` (8px all sides) — Expands the clickable area around the icon.

**`hover:bg-gray-100`** → On hover: `background-color: rgb(243 244 246)` — Very light gray hover state.

**`focus:bg-gray-100`** → On keyboard focus: same light gray background. Consistent pointer + keyboard experience.

**`focus:ring-2`** → On focus: draws a 2px focus ring (box-shadow outline). Accessibility feature — restores visible focus indicator for keyboard navigation.

**`lg:hidden`** → At 1024px+: `display: none` — Hamburger disappears on desktop since the full nav menu is always visible there.

**`dark:text-gray-400`** → Dark mode: `color: rgb(156 163 175)` — Icon renders in medium gray on dark backgrounds.

**`dark:hover:bg-gray-700`** → Dark mode + hover: `background-color: rgb(55 65 81)` — Dark gray hover (replacing the light `gray-100` which would look wrong on a dark background).

---

### Nav Items Wrapper — `${isMobileMenuShow && "hidden"} w-full lg:block lg:w-auto`

**`hidden`** (conditional) → `display: none`
- Applied when `isMobileMenuShow === true` (the initial state).
- Hides the dropdown menu on mobile by default.
- Note: The boolean logic here is inverted from the variable name — `isMobileMenuShow = true` means hidden.

**`w-full`** → `width: 100%`
- Makes the nav items wrapper take the full flex parent width.
- Combined with `flex-wrap` on the parent, forces this div onto its own row on mobile.

**`lg:block`** → At 1024px+: `display: block`
- Ensures the nav items are always visible on desktop, overriding any `hidden` class.
- This is the key override — on desktop the hamburger toggle logic is irrelevant.

**`lg:w-auto`** → At 1024px+: `width: auto`
- Overrides `w-full`, allowing the nav items to take only as much width as their content needs.
- On desktop, the items shouldn't stretch full-width since `justify-between` handles distribution.

---

### `<ul>` — `flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 text-lg lg:flex-row lg:space-x-8 lg:border-none lg:bg-transparent`

**`flex flex-col`** → Vertical stack on mobile. Nav items listed top-to-bottom.

**`rounded-lg`** → `border-radius: 0.5rem` — Rounds the mobile dropdown panel corners.

**`border border-gray-100`** → 1px solid very-light-gray border. Gives the mobile panel a defined edge.

**`bg-gray-50`** → `background-color: rgb(249 250 251)` — Near-white background for the mobile panel.

**`p-4`** → `padding: 1rem` (16px) — Interior padding inside the mobile panel.

**`text-lg`** → `font-size: 1.125rem` (18px) — Larger navigation text, comfortable for reading and tapping.

**`lg:flex-row`** → At 1024px+: `flex-direction: row` — Switches to horizontal layout on desktop.

**`lg:space-x-8`** → At 1024px+: `margin-left: 2rem` between each nav item. 32px horizontal gaps between links.

**`lg:border-none`** → At 1024px+: Removes the border. On desktop the `<ul>` is not a visible panel.

**`lg:bg-transparent`** → At 1024px+: Removes the background. On desktop the links float over the page.

---

### `<li>` (nav items) — Dynamic class analysis

Base classes (all items): `cursor-pointer rounded px-3 py-2 lg:hover:bg-transparent lg:hover:text-blue-400 lg:dark:text-white`

**`cursor-pointer`** → `cursor: pointer` — Signals interactivity.

**`rounded`** → `border-radius: 0.25rem` (4px) — Slightly rounds the hover/active background.

**`px-3 py-2`** → `padding: 8px top/bottom, 12px left/right` — Creates a pill-shaped interactive area.

**`lg:hover:bg-transparent`** → At 1024px+, on hover: transparent background. Desktop nav links use text-color changes (not background) as hover indicator.

**`lg:hover:text-blue-400`** → At 1024px+, on hover: `color: rgb(96 165 250)` — Blue text on desktop hover.

**`lg:dark:text-white`** → At 1024px+ in dark mode: white text — ensures readability on dark backgrounds.

---

**Index 0 only ("Home" — active state):**

**`bg-blue-500 text-white`** — Mobile: filled blue background + white text = active state.

**`lg:bg-transparent lg:text-blue-500`** — Desktop: no filled background, just blue text = desktop active state.

---

**Index 1–4 only:**

**`hover:bg-gray-100`** — Light gray hover background on mobile for non-active items.

---

**Index 3–4 ("Pricing", "Contact"):**

**`lg:text-white`** — At 1024px+: white text. These items visually sit over a darker section of the hero background on desktop, requiring white text for readability.

---

### Shopping Bag Outer `<div>` — `fixed bottom-4 left-4 lg:static lg:mr-8`

**`fixed`** → `position: fixed` — On mobile, the cart button is a Floating Action Button (FAB) pinned to the screen.

**`bottom-4`** → `bottom: 1rem` — 16px from screen bottom.

**`left-4`** → `left: 1rem` — 16px from screen left.

**`lg:static`** → At 1024px+: `position: static` — Returns to normal document flow inside the nav bar on desktop.

**`lg:mr-8`** → At 1024px+: `margin-right: 2rem` (32px) — Spacing from the right edge of the nav container.

---

### Shopping Bag Inner `<div>` — `flex-center h-12 w-12 cursor-pointer rounded-full bg-white shadow`

**`flex-center`** → `display: flex; align-items: center; justify-content: center` — Centers the shopping bag icon.

**`h-12 w-12`** → `height: 3rem; width: 3rem` (48px × 48px) — Square that becomes a circle via `rounded-full`. 48px meets minimum touch target size.

**`cursor-pointer`** → Hand cursor on hover.

**`rounded-full`** → `border-radius: 9999px` — Perfect circle.

**`bg-white`** → White circle background — stands out against any page background color.

**`shadow`** → Subtle drop shadow — lifts the FAB off the page, reinforcing the "floating" effect.

---

## 3.4 `src/components/ShoeDetail.jsx`

```jsx
<div className="flex flex-col space-y-4 lg:flex-row-reverse dark:text-white">
  {/* Shoe Image */}
  <div className="flex-1 lg:-mt-32 lg:ml-28">
    <div className="flex-center from- h-full bg-linear-to-br from-[#F637CF] from-5% via-[#E3D876] via-40% to-[#4DD4C6]">
      <img className="animate-float" src={nike1} />
    </div>
  </div>

  {/* Text Content */}
  <div className="flex-1 space-y-6">
    <div className="text-5xl font-black md:text-9xl">Nike Air Max 270</div>
    <div className="font-medium md:text-xl">...</div>
    <div className="flex flex-row space-x-2">
      <div className="text-3xl font-extrabold md:text-6xl">160 $</div>
      <Select ... />
      <Select ... />
    </div>
    <div className="space-x-10">
      <button className="h-14 w-44 cursor-pointer bg-black text-white hover:bg-gray-900 active:bg-gray-700">
        Add to bag
      </button>
      <a href="#" className="text-lg font-bold underline underline-offset-4">View details</a>
    </div>
  </div>
</div>
```

---

### Root `<div>` — `flex flex-col space-y-4 lg:flex-row-reverse dark:text-white`

**`flex flex-col`** → Mobile: the image and text stack vertically.

**`space-y-4`** → `margin-top: 1rem` between children — 16px gap between image and text sections on mobile.

**`lg:flex-row-reverse`**
- CSS (at 1024px+): `flex-direction: row-reverse`
- This is a smart layout technique. The DOM order is: image first, then text. With `row-reverse`, this renders as: text on the LEFT, image on the RIGHT — the classic hero layout.
- Without reversing: image would appear on the left and text on the right, which is the less standard pattern.
- `row-reverse` achieves the visual layout without changing the DOM order (important for accessibility).

**`dark:text-white`**
- Sets `color: white` on the root container in dark mode.
- This propagates via CSS inheritance to all descendant text elements (title, description, price, link).
- A top-level dark mode declaration that avoids repeating `dark:text-white` on every text element.

---

### Image Outer Wrapper — `flex-1 lg:-mt-32 lg:ml-28`

**`flex-1`** → `flex: 1 1 0%` — Takes up equal space as the text section (50/50 split on desktop).

**`lg:-mt-32`**
- CSS (at 1024px+): `margin-top: -8rem` (-128px)
- A **negative margin** — pulls the image section 128px upward from its natural position.
- Creates a dramatic visual effect where the shoe image appears to "break out" of the section, overlapping with the nav or creating a floating appearance.
- The `-` prefix is how Tailwind generates negative spacing values: `lg:-mt-32` → `margin-top: -8rem`.

**`lg:ml-28`** → At 1024px+: `margin-left: 7rem` (112px) — Pushes image rightward, away from the text.

---

### Gradient Container — `flex-center from- h-full bg-linear-to-br from-[#F637CF] from-5% via-[#E3D876] via-40% to-[#4DD4C6]`

**`flex-center`** → Centers the shoe image inside the gradient box.

**`from-`** — This appears to be an incomplete/accidentally left class. `from-` with no color value is not a valid Tailwind utility. Tailwind ignores it (no CSS output). The actual gradient start is `from-[#F637CF]`.

**`h-full`** → `height: 100%` — Gradient fills the full height of its container.

**`bg-linear-to-br`**
- CSS: `background-image: linear-gradient(to bottom right, ...)`
- **Tailwind v4 syntax** — in Tailwind v3 this was `bg-gradient-to-br`. In v4 the utility was renamed to `bg-linear-to-*`.
- `br` = bottom right. The gradient flows diagonally from top-left to bottom-right.

**`from-[#F637CF]`** → Gradient starts with `#F637CF` (vivid hot-pink/magenta). Arbitrary color value.

**`from-5%`** → The starting color occupies only the first 5% of the gradient length, making the transition dramatic.

**`via-[#E3D876]`** → Gradient passes through `#E3D876` (warm golden-yellow) at the midpoint. Arbitrary color value.

**`via-40%`** → The via (middle) color is reached at 40% of the gradient length — asymmetric distribution.

**`to-[#4DD4C6]`** → Gradient ends with `#4DD4C6` (cyan/teal). Arbitrary color value.

**The full gradient:** Hot pink (5%) → Golden yellow (40%) → Cyan (100%) — a vibrant, energetic three-stop diagonal gradient.

---

### Shoe Image — `animate-float`

**`animate-float`**
- CSS: `animation: float 4s ease-in-out infinite`
- The shoe image continuously floats up 10px and returns, creating a premium, "alive" product display.
- Uses the custom `--animate-float` animation from `@theme`.
- The 4-second ease-in-out cycle is slow enough to feel organic rather than mechanical.

---

### Title — `text-5xl font-black md:text-9xl`

**`text-5xl`** → `font-size: 3rem` (48px) — Large mobile title.

**`font-black`** → `font-weight: 900` — Maximum weight. Ultra-bold, Nike-style impact typography.

**`md:text-9xl`** → At 768px+: `font-size: 8rem` (128px) — The title becomes enormous on tablets and desktops. A dramatic typographic jump from 48px to 128px creates a statement headline effect.

---

### Description — `font-medium md:text-xl`

**`font-medium`** → `font-weight: 500` — Slightly heavier than normal, easy to read.

**`md:text-xl`** → At 768px+: `font-size: 1.25rem` (20px) — Slightly larger body text on wider screens.

---

### Price — `text-3xl font-extrabold md:text-6xl`

**`text-3xl`** → `font-size: 1.875rem` (30px) — Mobile price size.

**`font-extrabold`** → `font-weight: 800` — Very bold price display.

**`md:text-6xl`** → At 768px+: `font-size: 3.75rem` (60px) — Price scales dramatically alongside the title.

---

### Buttons Container — `space-x-10`

**`space-x-10`** → `margin-left: 2.5rem` (40px) between children — Generous gap between "Add to bag" and "View details".

---

### "Add to bag" Button — `h-14 w-44 cursor-pointer bg-black text-white hover:bg-gray-900 active:bg-gray-700`

**`h-14`** → `height: 3.5rem` (56px) — Comfortable, accessible button height.

**`w-44`** → `width: 11rem` (176px) — Fixed width for the CTA button.

**`cursor-pointer`** → Hand cursor.

**`bg-black`** → `background-color: black` — Classic Nike black CTA button.

**`text-white`** → White text on black button.

**`hover:bg-gray-900`** → On hover: `background-color: rgb(17 24 39)` — Very slightly lighter than black, providing subtle hover feedback.

**`active:bg-gray-700`** → On click: `background-color: rgb(55 65 81)` — Noticeably lighter gray during the press, creating a visual "press" tactile feedback. The three states: `bg-black` (default) → `hover:bg-gray-900` (hover) → `active:bg-gray-700` (pressing).

---

### "View details" Link — `text-lg font-bold underline underline-offset-4`

**`text-lg`** → `font-size: 1.125rem` (18px) — Prominent secondary link.

**`font-bold`** → Bold weight makes it a visually clear secondary action.

**`underline`** → `text-decoration-line: underline` — Marks this as a link even without hover state.

**`underline-offset-4`** → `text-underline-offset: 4px` — Moves the underline 4px below the text baseline, creating a modern gap between text and underline. This is a common refinement in contemporary design systems.

---

## 3.5 `src/components/NewArrivalsSection.jsx`

```jsx
<div className="mt-20">
  <div className="flex-center">
    <div className="bg-[url(./assets/lines.png)] bg-center text-4xl font-extrabold dark:text-white">
      NEW ARRIVALS
    </div>
  </div>
  <div className="mt-10 grid grid-cols-1 justify-between gap-x-6 gap-y-24 md:grid-cols-2 xl:grid-cols-[repeat(3,25%)]">
    {items.map(item => <Card key={item.id} item={item} addToCart={handleOnClick} />)}
  </div>
</div>
```

---

### Root — `mt-20`

**`mt-20`** → `margin-top: 5rem` (80px) — Large top margin separating this section from the hero above. Creates a clear visual break between sections.

---

### Heading Wrapper — `flex-center`

**`flex-center`** → `display: flex; align-items: center; justify-content: center` — Centers the heading horizontally.

---

### Heading Text — `bg-[url(./assets/lines.png)] bg-center text-4xl font-extrabold dark:text-white`

**`bg-[url(./assets/lines.png)]`**
- CSS: `background-image: url(./assets/lines.png)`
- Applies a decorative lines pattern as the background of the text element.
- Arbitrary URL value syntax: `bg-[url(...)]` — passes any CSS `url()` value directly.
- Creates a textured visual treatment under the heading text.

**`bg-center`** → `background-position: center` — Centers the background image.

**`text-4xl`** → `font-size: 2.25rem` (36px) — Large section heading.

**`font-extrabold`** → `font-weight: 800` — Very bold all-caps heading.

**`dark:text-white`** → White text in dark mode for readability.

---

### Product Grid — `mt-10 grid grid-cols-1 justify-between gap-x-6 gap-y-24 md:grid-cols-2 xl:grid-cols-[repeat(3,25%)]`

**`mt-10`** → `margin-top: 2.5rem` (40px) — Space between heading and grid.

**`grid`** → `display: grid` — CSS Grid container. Enables the multi-column layout.

**`grid-cols-1`** → Mobile: single column. Cards stack full-width, one per row.

**`justify-between`** → `justify-content: space-between` — Affects track distribution. On a grid this distributes the columns with space between them (more relevant at `xl:` width).

**`gap-x-6`** → `column-gap: 1.5rem` (24px) — Horizontal gap between card columns.

**`gap-y-24`** → `row-gap: 6rem` (96px) — Very large vertical gap (96px) between card rows. This large gap accommodates card content that visually extends beyond the grid cell (shoe images may overflow their containers).

**`md:grid-cols-2`** → At 768px+: Two columns. Two cards per row on tablet.

**`xl:grid-cols-[repeat(3,25%)]`**
- CSS (at 1280px+): `grid-template-columns: repeat(3, 25%)`
- Three columns, each exactly 25% wide. Three cards per row on large desktops.
- Arbitrary value: `[repeat(3,25%)]` provides the raw CSS grid template value.
- Why `25%` instead of `1fr`? Standard `grid-cols-3` would use `1fr` columns (stretching to fill all available space). Using `25%` columns leaves room for gaps and creates a more intentional layout with breathing room at the sides.

**Responsive Grid Summary:**

| Breakpoint | Columns | Layout |
|---|---|---|
| Default (mobile) | 1 | Single column stack |
| `md:` (768px+) | 2 | Two-column grid |
| `xl:` (1280px+) | 3 × 25% | Three-column grid |

---

## 3.6 `src/components/Card.jsx`

```jsx
export default function Card({ item, addToCart }) {
  return (
    <div className={`${item.className} relative max-w-xl transform cursor-pointer transition hover:scale-105`}>
      <div className="p-8">
        <div className="text-2xl font-bold">{item.title}</div>
        <div
          onClick={() => addToCart({ product: item, qty: 1, size: 41 })}
          className="mt-10 font-semibold underline underline-offset-4"
        >
          SHOP NOW +
        </div>
      </div>
      <img className="absolute top-5 left-[40%] h-40 w-56" src={item.src} />
    </div>
  );
}
```

---

### Card Root — `${item.className} relative max-w-xl transform cursor-pointer transition hover:scale-105`

**`${item.className}`** (dynamic)
- Injected from `constants.js` data: one of `bg-[#EEFFA4]`, `bg-[#DDCEFD]`, `bg-[#DAFFA2]`, `bg-[#FCC4EA]`.
- Sets the unique background color for each product card.

**`relative`** → `position: relative` — Positioning context for the absolutely placed shoe image inside.

**`max-w-xl`** → `max-width: 36rem` (576px) — Caps card width. Prevents cards from becoming too wide on large screens.

**`transform`** → Activates Tailwind's transform system. Required for `hover:scale-105` to work (in v3; v4 handles this automatically but the class is harmless).

**`cursor-pointer`** → Hand cursor over the entire card.

**`transition`**
- CSS: `transition-property: color, background-color, ..., transform, ...; transition-duration: 150ms; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)`
- Enables smooth CSS transitions on all common properties, including `transform`.
- Combined with `hover:scale-105`, this animates the card scale smoothly.

**`hover:scale-105`**
- CSS (on hover): `transform: scale(1.05)`
- The card scales up to 105% of its size on hover — a subtle "lift" that signals interactivity.
- Combined with `transition`, animates over 150ms with easing.

---

### Content Wrapper — `p-8`

**`p-8`** → `padding: 2rem` (32px) — Generous padding keeps text content away from card edges.

---

### Title — `text-2xl font-bold`

**`text-2xl`** → `font-size: 1.5rem` (24px) — Prominent product name.

**`font-bold`** → `font-weight: 700` — Bold product title.

---

### "SHOP NOW +" CTA — `mt-10 font-semibold underline underline-offset-4`

**`mt-10`** → `margin-top: 2.5rem` (40px) — Large gap between title and CTA. This space is where the absolutely-positioned shoe image visually sits.

**`font-semibold`** → `font-weight: 600` — Slightly lighter than the title's bold, maintaining hierarchy.

**`underline`** → Underlines the CTA text to suggest it's a link/action.

**`underline-offset-4`** → `text-underline-offset: 4px` — Modern 4px gap between text and underline.

---

### Shoe Image — `absolute top-5 left-[40%] h-40 w-56`

**`absolute`** → `position: absolute` — Removes image from document flow, positions relative to the `relative` card root.

**`top-5`** → `top: 1.25rem` (20px) — 20px from the card's top edge.

**`left-[40%]`**
- CSS: `left: 40%`
- Arbitrary value — positions the image starting at 40% from the card's left edge.
- This percentage value is not in Tailwind's default spacing scale (which uses rem-based fixed values), requiring the `[value]` escape hatch.
- Places the shoe image in the right-center of the card, allowing text on the left to remain visible.

**`h-40`** → `height: 10rem` (160px) — Image height.

**`w-56`** → `width: 14rem` (224px) — Image width. Wider than tall (224×160), matching the natural landscape orientation of side-profile shoe photography.

---

## 3.7 `src/components/Sidebar.jsx`

```jsx
export default function Sidebar({ isOpen, onClickCart, children }) {
  return (
    <div>
      <div
        className={`dark:bg-night fixed top-0 right-0 z-50 h-full w-full transform overflow-y-auto bg-white transition duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          shadow-lg md:w-[50%] lg:w-[35%]`}
      >
        <button className="absolute top-4 right-4 cursor-pointer p-2 font-bold text-black dark:text-white">
          X
        </button>
        {children}
      </div>
      {isOpen && (
        <div className="fixed top-0 left-0 z-20 h-full w-full bg-black opacity-50"></div>
      )}
    </div>
  );
}
```

---

### Drawer Panel — Full class analysis

**`dark:bg-night`** → Dark mode: `background-color: #0d1120` — Dark navy panel background.

**`fixed`** → `position: fixed` — Panel stays in place relative to viewport as page scrolls.

**`top-0 right-0`** → Anchors the panel to the top-right corner of the viewport. It slides in from the right.

**`z-50`** → `z-index: 50` — Highest z-index in the project. Panel renders above the overlay (`z-20`) and all page content.

**`h-full`** → `height: 100%` — Full viewport height.

**`w-full`** → `width: 100%` — Full viewport width on mobile.

**`transform`** → Activates Tailwind's transform utilities for the slide animation.

**`overflow-y-auto`** → `overflow-y: auto` — Adds vertical scrollbar when cart content overflows the panel height.

**`bg-white`** → White background in light mode.

**`transition`** → Enables CSS transitions (all standard properties including transform).

**`duration-300`** → `transition-duration: 300ms` — The slide animation takes 300ms. Overrides `transition`'s default 150ms.

---

### Slide Animation — `translate-x-0` vs `translate-x-full`

```jsx
className={`... ${isOpen ? "translate-x-0" : "translate-x-full"} ...`}
```

**`translate-x-0`** (when open)
- CSS: `transform: translateX(0px)`
- Panel is at its natural right-edge position — fully visible on screen.

**`translate-x-full`** (when closed)
- CSS: `transform: translateX(100%)`
- Panel is shifted 100% of its own width to the right — completely hidden off-screen.

**How the animation works:**

1. Page loads → `isOpen = false` → `translate-x-full` → panel is off-screen to the right
2. User clicks cart icon → `isOpen = true` → class switches to `translate-x-0`
3. `transition duration-300` animates the `transform` change → panel slides smoothly left into view over 300ms
4. User clicks close button → `isOpen = false` → switches back to `translate-x-full` → slides out right

The panel is always in the DOM (not conditionally rendered), which is what allows the CSS transition to animate both open and close.

---

**`shadow-lg`** → Large drop shadow on the panel's left/bottom edges — visual depth, "elevated" appearance.

**`md:w-[50%]`** → At 768px+: `width: 50%` — Half-width drawer on tablet. Arbitrary percentage value.

**`lg:w-[35%]`** → At 1024px+: `width: 35%` — Narrower drawer on desktop. Arbitrary percentage value.

**Responsive Summary:**

| Screen | Width | Appearance |
|---|---|---|
| Mobile (default) | `w-full` (100%) | Full-screen drawer |
| Tablet (`md:`) | `w-[50%]` (50%) | Half-screen drawer |
| Desktop (`lg:`) | `w-[35%]` (35%) | Narrow sidebar drawer |

---

### Close Button — `absolute top-4 right-4 cursor-pointer p-2 font-bold text-black dark:text-white`

**`absolute`** → Positioned relative to the `fixed` sidebar panel.

**`top-4 right-4`** → `top: 1rem; right: 1rem` — 16px from both the top and right edges of the panel. Corners the "X" button.

**`cursor-pointer`** → Hand cursor.

**`p-2`** → `padding: 0.5rem` — Expands the click/tap target area.

**`font-bold`** → Bold "X" character.

**`text-black`** → Black "X" in light mode.

**`dark:text-white`** → White "X" in dark mode (visible against `dark:bg-night`).

---

### Overlay — `fixed top-0 left-0 z-20 h-full w-full bg-black opacity-50`

**`fixed top-0 left-0`** → Full-screen position anchored to top-left.

**`z-20`** → z-index 20. Above page content but below the sidebar drawer (`z-50`).

**`h-full w-full`** → Covers the entire viewport.

**`bg-black opacity-50`** → `background-color: black` + `opacity: 0.5` = 50% transparent black overlay. This is the "dimming" effect that indicates the page behind the sidebar is inactive.

---

## 3.8 `src/components/Cart.jsx`

```jsx
export default function Cart({ items, setCartItems }) {
  // grouping/deduplication logic
  return (
    <div className="">
      <div className="w-16 p-5 text-2xl font-bold dark:text-white">Cart</div>
      {formattedItems.map((item) => <CartItem key={...} ... />)}
    </div>
  );
}
```

---

### "Cart" Heading — `w-16 p-5 text-2xl font-bold dark:text-white`

**`w-16`** → `width: 4rem` (64px) — Constrains the heading div to roughly the width of the "Cart" text.

**`p-5`** → `padding: 1.25rem` (20px) — Spacing around the heading text.

**`text-2xl`** → `font-size: 1.5rem` (24px) — Section heading size.

**`font-bold`** → `font-weight: 700` — Bold heading.

**`dark:text-white`** → White text in dark mode.

---

## 3.9 `src/components/CartItem.jsx`

```jsx
export default function CartItem({ item, qty, size, handleItemChange, deletehandler }) {
  return (
    <div className="cursor-pointer py-4 hover:bg-amber-100 dark:text-white dark:hover:text-black">
      <div className="flex-center m-4 flex space-x-2">
        <img className="h-20 w-24" src={item.src} />
        <div className="flex flex-col space-y-2">
          <div className="font-bold">{item.title}</div>
          <div className="text-gray-500">{item.description}</div>
        </div>
        <div className="font-bold">{item.price}$</div>
      </div>
      <div className="ml-28 flex items-center justify-between">
        <div className="flex space-x-2">
          <Select ... className={"w-16 p-1 pl-2"} />
          <Select ... className={"w-16 p-1 pl-2"} />
        </div>
        <div>
          <CiTrash size={25} className="mr-2" />
        </div>
      </div>
    </div>
  );
}
```

---

### Row Root — `cursor-pointer py-4 hover:bg-amber-100 dark:text-white dark:hover:text-black`

**`cursor-pointer`** → Hand cursor for the entire row.

**`py-4`** → `padding-top/bottom: 1rem` (16px) — Vertical breathing room between cart items.

**`hover:bg-amber-100`**
- On hover: `background-color: rgb(254 243 199)` — warm light amber/yellow background.
- Provides row-level hover feedback. Amber is a warm, friendly accent color.

**`dark:text-white`** → White text in dark mode (inherited by all child text).

**`dark:hover:text-black`**
- Dark mode + hover: `color: black`
- This is a thoughtful interaction: in dark mode, text is white (`dark:text-white`). But when hovering shows the amber background (`hover:bg-amber-100` — a light color), white text becomes unreadable. `dark:hover:text-black` switches text to black on hover in dark mode, ensuring contrast on the amber background.

---

### Product Info Row — `flex-center m-4 flex space-x-2`

**`flex-center`** → `display: flex; align-items: center; justify-content: center` — Centers content.

**`m-4`** → `margin: 1rem` (16px all sides) — Insets the content row from container edges.

**`flex`** → Redundant with `flex-center` (which already includes `display: flex`), but harmless.

**`space-x-2`** → `margin-left: 0.5rem` (8px) between children — horizontal gaps between image, text block, and price.

---

### Product Thumbnail — `h-20 w-24`

**`h-20`** → `height: 5rem` (80px) — Thumbnail height in cart list.

**`w-24`** → `width: 6rem` (96px) — Slightly wider than tall, matching shoe image proportions.

---

### Text Column — `flex flex-col space-y-2`

**`flex flex-col`** → Stacks title and description vertically.

**`space-y-2`** → `margin-top: 0.5rem` (8px) between title and description.

---

### Title — `font-bold`

**`font-bold`** → `font-weight: 700` — Bold product name in cart. Easy to scan.

---

### Description — `text-gray-500`

**`text-gray-500`** → `color: rgb(107 114 128)` — Medium gray. De-emphasizes secondary text relative to the bold title.

---

### Price — `font-bold`

**`font-bold`** → `font-weight: 700` — Bold price in cart item.

---

### Controls Row — `ml-28 flex items-center justify-between`

**`ml-28`** → `margin-left: 7rem` (112px) — Indents controls to roughly align with the text block (after the 96px image + 16px margin).

**`flex`** → Flex container.

**`items-center`** → Vertically centers the dropdowns and trash icon.

**`justify-between`** → Pushes dropdowns to the left, trash icon to the right. This separation is intentional — a destructive action (delete) is kept far from the controls to reduce accidental deletion.

---

### Select className prop — `w-16 p-1 pl-2`

These classes are passed to the `Select` component as the `className` prop and merged by `twMerge`.

**`w-16`** → `width: 4rem` (64px) — Narrow select for short numeric values (1-5, 41-47).

**`p-1`** → `padding: 0.25rem` (4px) — Minimal compact padding.

**`pl-2`** → `padding-left: 0.5rem` (8px) — Overrides just the left padding. `p-1` sets all sides to 4px, then `pl-2` specifically increases left side to 8px for better text readability. This is a fine-grained padding override pattern.

---

### Trash Icon — `mr-2`

**`mr-2`** → `margin-right: 0.5rem` (8px) — Space between the icon and the right edge of its container.

---

## 3.10 `src/components/Select.jsx`

```jsx
export default function Select({ title, options, className, defaultValue = "", setValue }) {
  return (
    <div className="relative">
      <select
        className={twMerge(
          `w-24 appearance-none border border-gray-300 bg-white p-4 dark:text-black ${className}`
        )}
        onChange={(e) => setValue(e.target.value)}
      >
        <option value="" disabled hidden>{title}</option>
        {options.map(option => <option value={option} key={option}>{option}</option>)}
      </select>
      <div className="flex-center pointer-events-none absolute inset-y-0 right-0 pr-3 dark:text-black">
        <IoIosArrowDown />
      </div>
    </div>
  );
}
```

---

### Wrapper — `relative`

**`relative`** → `position: relative` — Positioning context for the absolutely-placed arrow icon overlay.

---

### `<select>` — `w-24 appearance-none border border-gray-300 bg-white p-4 dark:text-black`

**`w-24`** → `width: 6rem` (96px) — Default select width. Overridden by the `w-16` className prop from CartItem.

**`appearance-none`**
- CSS: `appearance: none`
- Removes the browser's default native select styling, most importantly the native dropdown arrow.
- This is essential for custom select components — without it, the native arrow would appear alongside the custom `IoIosArrowDown` icon.

**`border border-gray-300`** → 1px solid light gray border around the select input.

**`bg-white`** → `background-color: white` — Forces white background (overrides browser default which may differ by OS).

**`p-4`** → `padding: 1rem` (16px) — Generous padding inside the select, making it tall and comfortable to interact with.

**`dark:text-black`**
- Dark mode: `color: black`
- Keeps select text and the native options list readable regardless of OS dark mode rendering of native `<select>` elements.
- When the native dropdown opens, it uses system colors. Black text ensures readability in both contexts.

### `twMerge` — Class Merging

```js
className={twMerge(`w-24 appearance-none ... ${className}`)}
```

`twMerge` (from `tw-merge`) merges the base classes with the incoming `className` prop, resolving conflicts intelligently. For example:

- Base has `w-24`, CartItem passes `w-16` → `twMerge` outputs `w-16` (overrides `w-24`)
- Without `twMerge`, both classes would be present (`w-24 w-16`), and the last one in CSS would win — unpredictable

This is a standard pattern for buildable Tailwind UI components.

---

### Arrow Overlay — `flex-center pointer-events-none absolute inset-y-0 right-0 pr-3 dark:text-black`

**`flex-center`** → Centers the `IoIosArrowDown` icon.

**`pointer-events-none`** → `pointer-events: none` — Critical. The overlay div does not intercept mouse/touch clicks. Clicks pass through to the `<select>` element beneath, so the dropdown still opens when clicking the arrow area.

**`absolute`** → `position: absolute` — Positioned over the right side of the select.

**`inset-y-0`** → `top: 0; bottom: 0` — Stretches the overlay to full height of the select.

**`right-0`** → `right: 0` — Aligns to the right edge.

**`pr-3`** → `padding-right: 0.75rem` (12px) — 12px gap between the right edge and the arrow icon.

**`dark:text-black`** → Dark mode: forces arrow icon color to black for the same reasons as the select's `dark:text-black`.

---

---

# PART 4 — CROSS-CUTTING PATTERNS

---

## 4.1 Responsive Design System

This project uses **mobile-first** responsive design throughout. Classes without a prefix apply to all screen sizes; prefixed classes apply at their breakpoint and above.

| Prefix | Min-Width | Usage in This Project |
|---|---|---|
| (none) | All sizes | Default mobile layout |
| `md:` | 768px+ | 2-column product grid, larger typography, wider sidebar |
| `lg:` | 1024px+ | Desktop nav (row layout, hide hamburger), hero row-reverse, image margins |
| `xl:` | 1280px+ | 3-column product grid, larger page horizontal padding, narrowest sidebar |

**No `sm:` (640px) breakpoint** is used in this project — the smallest responsive step is `md:`.

### Key Responsive Transformations:

**Navigation (Nav.jsx):**
- Mobile: Hamburger visible, menu hidden by default in a column panel
- `lg:` 1024px+: Hamburger hidden, menu always visible in a horizontal row

**Hero Section (ShoeDetail.jsx):**
- Mobile: Image stacked above text (`flex-col`)
- `lg:` 1024px+: Image right, text left (`flex-row-reverse`)
- Typography: `text-5xl` → `md:text-9xl`, `text-3xl` → `md:text-6xl`

**Product Grid (NewArrivalsSection.jsx):**
- Mobile: 1 column
- `md:` 768px+: 2 columns
- `xl:` 1280px+: 3 columns at 25% width each

**Sidebar (Sidebar.jsx):**
- Mobile: Full-width (`w-full`)
- `md:` 768px+: Half-width (`md:w-[50%]`)
- `lg:` 1024px+: 35%-width (`lg:w-[35%]`)

**Cart Icon (Nav.jsx):**
- Mobile: Fixed FAB at bottom-left (`fixed bottom-4 left-4`)
- `lg:` 1024px+: Inline in nav bar (`lg:static lg:mr-8`)

**Page Padding (App.jsx):**
- Mobile/default: `p-10` (40px all sides)
- `xl:` 1280px+: `xl:px-24` (96px horizontal)

---

## 4.2 Flex Layout Patterns

No CSS Grid is used in the component layer (only in `NewArrivalsSection`). All component layouts use Flexbox.

| Component | Flex Pattern | Effect |
|---|---|---|
| Nav root | `flex flex-wrap items-center justify-between` | Horizontal nav with logo/menu/cart distribution, wraps on mobile |
| Nav list | `flex flex-col` → `lg:flex-row` | Vertical mobile menu → horizontal desktop row |
| ShoeDetail root | `flex flex-col` → `lg:flex-row-reverse` | Stacked mobile → image-right desktop |
| ShoeDetail price row | `flex flex-row space-x-2` | Horizontal: price + dropdowns |
| ShoeDetail buttons | `space-x-10` (implicit flex from parent) | Horizontal: button + link |
| Cart item row | `flex-center flex space-x-2` | Centered row: image + text + price |
| Cart item text | `flex flex-col space-y-2` | Vertical: title + description |
| Cart item controls | `flex items-center justify-between` | Dropdowns left, trash icon right |
| Select wrapper | `relative` with `absolute` overlay | Positioning context pattern |
| Cart icon | `flex-center` | Centered icon in circle |

---

## 4.3 Positioning Patterns

| Pattern | Classes | Where Used |
|---|---|---|
| Relative + Absolute | `relative` / `absolute` | Card (image in card), Select (arrow over input), Sidebar (close button in panel) |
| Fixed viewport overlay | `fixed top-0 left-0 z-20 h-full w-full` | Sidebar backdrop |
| Fixed viewport panel | `fixed top-0 right-0 z-50 h-full` | Sidebar drawer |
| Fixed FAB | `fixed bottom-4 left-4` (mobile) | Cart icon in Nav |
| Fixed FAB | `fixed right-4 bottom-4` | Dark mode toggle |
| Negative margin | `lg:-mt-32` | Hero image pulled above section boundary |

**Z-index stacking order:**
- Page content: z-0 (default)
- Nav: `z-10`
- Sidebar overlay: `z-20`
- Sidebar drawer: `z-50`

---

## 4.4 Spacing Patterns

| Utility | Value | Where Used |
|---|---|---|
| `p-10` | 40px | App page padding |
| `xl:px-24` | 96px horizontal | App wide-screen padding |
| `p-8` | 32px | Card content padding |
| `p-5` | 20px | Cart heading padding |
| `p-4` | 16px | Select input padding, CartItem margin |
| `p-2` | 8px | Button/icon padding |
| `mt-20` | 80px | NewArrivalsSection top |
| `mt-10` | 40px | Grid top margin |
| `lg:-mt-32` | -128px | Hero image negative margin |
| `lg:ml-28` | 112px | Hero image left margin |
| `ml-28` | 112px | CartItem controls indent |
| `space-y-6` | 24px between | ShoeDetail text sections |
| `space-y-4` | 16px between | ShoeDetail outer sections |
| `space-y-2` | 8px between | CartItem text lines |
| `space-x-10` | 40px between | ShoeDetail buttons |
| `space-x-8` | 32px between | Desktop nav items |
| `space-x-2` | 8px between | CartItem row, price row |
| `gap-y-24` | 96px | Grid row gap |
| `gap-x-6` | 24px | Grid column gap |
| `py-4` | 16px top/bottom | CartItem row height |
| `px-3 py-2` | 12px/8px | Nav link pill padding |
| `px-4 py-2` | 16px/8px | Dark mode button padding |
| `pr-3` | 12px right | Select arrow padding |
| `pl-2` | 8px left | Select input override padding |

---

## 4.5 Typography Patterns

| Class | Size | Weight | Used On |
|---|---|---|---|
| `md:text-9xl` | 128px | — | Hero title (desktop) |
| `text-5xl` | 48px | — | Hero title (mobile) |
| `md:text-6xl` | 60px | — | Price (desktop) |
| `text-3xl` | 30px | — | Price (mobile) |
| `text-4xl` | 36px | — | "NEW ARRIVALS" heading |
| `text-2xl` | 24px | — | Card title, Cart heading |
| `md:text-xl` | 20px | — | Hero description (desktop) |
| `text-xl` | 20px | — | — |
| `text-lg` | 18px | — | Nav links, "View details" link |
| `font-black` | 900 | — | Hero title |
| `font-extrabold` | 800 | — | Price, "NEW ARRIVALS" |
| `font-bold` | 700 | — | Titles, prices, headings |
| `font-semibold` | 600 | — | Card "SHOP NOW +" |
| `font-medium` | 500 | — | Hero description |
| `text-white` | — | — | Active nav, dark mode, buttons |
| `text-blue-500` | — | — | Desktop active nav |
| `text-blue-400` | — | — | Desktop nav hover |
| `text-gray-500` | — | — | Cart item description |
| `underline underline-offset-4` | — | — | CTAs and links |

---

## 4.6 Arbitrary Values Summary

| Class | Value Type | Component | Purpose |
|---|---|---|---|
| `bg-[#EEFFA4]` | Hex color | constants.js → Card | Lime yellow card background |
| `bg-[#DDCEFD]` | Hex color | constants.js → Card | Lavender card background |
| `bg-[#DAFFA2]` | Hex color | constants.js → Card | Light green card background |
| `bg-[#FCC4EA]` | Hex color | constants.js → Card | Blush pink card background |
| `left-[40%]` | Percentage | Card | Shoe image horizontal position |
| `from-[#F637CF]` | Hex color | ShoeDetail | Gradient start (hot pink) |
| `via-[#E3D876]` | Hex color | ShoeDetail | Gradient mid (gold) |
| `to-[#4DD4C6]` | Hex color | ShoeDetail | Gradient end (teal) |
| `md:w-[50%]` | Percentage | Sidebar | Tablet drawer width |
| `lg:w-[35%]` | Percentage | Sidebar | Desktop drawer width |
| `bg-[url(./assets/lines.png)]` | URL | NewArrivalsSection | Decorative background image |
| `xl:grid-cols-[repeat(3,25%)]` | Grid template | NewArrivalsSection | 3×25% desktop columns |

**Rule:** Arbitrary values use `[value]` notation and are for values not in Tailwind's default scale. They must be written as complete class name strings in source files so Tailwind's scanner can detect and include them in the output CSS.

---

## 4.7 State Variant Patterns

| Variant | Example | Where Used |
|---|---|---|
| `hover:` | `hover:bg-amber-100` | CartItem, Card, buttons, nav items |
| `focus:` | `focus:ring-2` | Hamburger button (keyboard nav) |
| `active:` | `active:bg-gray-700` | "Add to bag" button press state |
| `dark:` | `dark:bg-night` | Throughout (see Part 2.4) |
| `dark:hover:` | `dark:hover:bg-gray-700` | Hamburger button in dark mode |
| `dark:hover:` | `dark:hover:text-black` | CartItem text on amber hover in dark mode |
| `lg:hover:` | `lg:hover:text-blue-400` | Desktop nav item hover |
| `lg:dark:` | `lg:dark:text-white` | Desktop nav text in dark mode |
| `dark:block` | `dark:block` on BiSun | Show sun icon in dark mode |
| `dark:hidden` | `dark:hidden` on BiMoon | Hide moon icon in dark mode |

---

## 4.8 Animation Patterns

| Pattern | Classes | Where | Effect |
|---|---|---|---|
| Page fade-in | `animate-fadeIn` | App.jsx root | Entire app fades in on mount (1s, once) |
| Floating product | `animate-float` | ShoeDetail hero image | Shoe floats up/down continuously (4s, infinite) |
| Card hover scale | `transition hover:scale-105` | Card.jsx root | Card scales 105% on hover, smooth 150ms |
| Sidebar slide | `transition duration-300` + `translate-x-0/translate-x-full` | Sidebar drawer | Panel slides in/out from right (300ms) |
| Button hover | `hover:bg-gray-900` | "Add to bag" | Color transition on hover |
| Button active | `active:bg-gray-700` | "Add to bag" | Color feedback on press |

---

---

# PART 5 — QUICK REFERENCE

---

## 5.1 All Files and Their Tailwind Role

| File | Tailwind Role |
|---|---|
| `src/index.css` | Framework import, custom theme, custom dark variant, custom utility |
| `src/main.jsx` | Imports index.css into the Vite pipeline |
| `vite.config.js` | Registers `@tailwindcss/vite` plugin |
| `package.json` | Declares `tailwindcss` and `@tailwindcss/vite` dependencies |
| `src/App.jsx` | Root layout, page padding, dark mode toggle, FAB positioning |
| `src/components/Nav.jsx` | Responsive nav, mobile hamburger, FAB cart, dark mode SVG |
| `src/components/ShoeDetail.jsx` | Hero layout, gradient, animations, responsive typography |
| `src/components/NewArrivalsSection.jsx` | Responsive CSS Grid, section heading with bg image |
| `src/components/Card.jsx` | Hover scale animation, absolute image positioning, dynamic classes |
| `src/components/Sidebar.jsx` | Slide-in drawer animation, responsive width, overlay |
| `src/components/Cart.jsx` | Simple heading with dark mode |
| `src/components/CartItem.jsx` | Row hover, dark/hover interaction, compact spacing |
| `src/components/Select.jsx` | Custom select with `appearance-none`, `twMerge`, arrow overlay |
| `src/constants.js` | Data-driven dynamic Tailwind classes (arbitrary bg colors) |

---

## 5.2 Tailwind v4 Features Used in This Project

| Feature | Usage |
|---|---|
| `@import "tailwindcss"` | Single entry point replacing v3's three `@tailwind` directives |
| `@theme {}` | CSS-first theme config (colors, animations, keyframes) |
| `@custom-variant` | Custom dark mode variant definition |
| `@layer base` | Global body font override |
| `@layer utilities` | Custom `.flex-center` utility |
| `@apply` | Composing utilities inside `.flex-center` |
| `bg-linear-to-br` | v4-renamed gradient (was `bg-gradient-to-br` in v3) |
| No `tailwind.config.js` | All config in CSS |
| No PostCSS | Replaced by `@tailwindcss/vite` plugin |

---

*This document was generated as a complete Tailwind CSS learning walkthrough of the `tailwind-shoes` project. Every concept explained here is derived directly from the project source code.*
