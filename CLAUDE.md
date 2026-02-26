# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Type-check with `tsc -b` then build with Vite
- `npm run lint` — Run ESLint across the project
- `npm run preview` — Preview the production build locally

## Tech Stack

- **React 19** with TypeScript (strict mode enabled)
- **Vite 7** as build tool with `@vitejs/plugin-react` (Babel-based)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (CSS-first config, no `tailwind.config.js`)
- **Ant Design v5** — primary UI component library (Button, Input, Form, Card, Statistic, etc.)
- **ESLint 9** flat config with typescript-eslint, react-hooks, and react-refresh plugins

## Theme System Architecture

Single light theme only — no dark mode.

- **`src/index.css`** — Single source of truth for all colors. Defines CSS variables inside `@theme` block (`--color-primary`, `--color-heading`, `--color-navy`, etc.). Values match `docs/design-system.md`.
- **`src/theme.ts`** — Exports `lightTheme` (Ant Design `ThemeConfig`). Reads all colors from CSS variables via `getCssVariable()` — zero hardcoded HEX values.
- **`src/theme/context.ts`** — `ThemeContext` + `useTheme()` hook. Light-only, throws if used outside provider.
- **`src/theme/ThemeProvider.tsx`** — Wraps children in Ant Design `ConfigProvider` + `ThemeContext.Provider`.
- **`src/main.tsx`** — Imports `index.css` and `antd/dist/reset.css`, wraps `<App>` in `<ThemeProvider>`.

Color flow: `index.css @theme` → CSS variables → `theme.ts getCssVariable()` → Ant Design ConfigProvider + Tailwind utilities.

To use colors in components: use Tailwind classes (`text-heading`, `bg-primary`, `bg-background-alt`) or Ant Design tokens (auto-applied via ConfigProvider).

## TypeScript Configuration

- Target: ES2022, JSX: react-jsx
- Strict mode with `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`
- Bundler module resolution with `allowImportingTsExtensions` (use `.tsx` extensions in imports)
- `verbatimModuleSyntax` is enabled — use `import type` for type-only imports

# CLAUDE.md

## Project Overview

This is a marketing website built using:

- Vite
- React (TypeScript)
- Tailwind CSS
- Component-based architecture

The website represents a solar analytics / industrial intelligence platform.

The goal is to create a clean, modern, B2B industrial website with strong ROI-focused messaging.

---

# Project Structure

Root directory:

vite-project/

Main source folder:
src/

Documentation folder:
docs/

Claude must always follow the documentation located in:

/docs/design-system.md  
/docs/section-structure.md  
/docs/content-guide.md  

---

# Tech Stack Rules

- Use React Functional Components only
- Use TypeScript
- Use Tailwind CSS for layout, spacing, backgrounds, and responsive design
- Use Ant Design components for UI controls (Button, Input, Select, Form, Card, Statistic, Table, Modal, Tabs, Tag)
- Do NOT use raw HTML `<input>`, `<button>`, `<select>`, `<textarea>` — use Ant Design equivalents
- Do NOT use CSS files unless absolutely necessary
- Do NOT use inline styles or hardcoded HEX in components — all colors flow from CSS variables
- No external UI libraries besides Ant Design (no MUI, no Bootstrap)
- No unnecessary state management
- Keep components reusable

---

# Folder Architecture Rules

Inside src:

src/
│
├── components/
│   ├── sections/
│   ├── ui/
│
├── pages/
│
├── assets/
│
├── layouts/
│
├── hooks/
│
├── constants/
│
└── utils/

Rules:

- Each section should be its own component.
- Pages should only assemble sections.
- No large monolithic page components.
- Keep files under 200 lines.
- If section is complex → split into smaller components.

---

# Website Page Structure

Claude must follow this exact page flow.

---

## HOME PAGE

Sections in order:

1. Hero Section
2. Problem → Solution text blocks
3. Modules (icons + titles)
4. Dashboard Visuals
5. ROI Counters
6. CTA Section (Primary cyan button)

---

## ABOUT PAGE

1. Mission statement
2. Vision with industrial imagery
3. 3-step implementation model

---

## SOLUTION (Parent Page)

1. Overview of modules
2. CTA linking to module detail pages

---

## MARKET INTELLIGENCE PAGE

1. Hero with unique gradient image
2. Problem context
3. Feature block with icons
4. Visual dashboard screenshot
5. Outcome section
6. CTA

---

## DASHBOARD PAGE

1. Screenshot
2. Headline + description
3. Hover or zoom effect on image

---

## BUSINESS IMPACT PAGE

1. Animated statistical counters
2. Customer value-focused copy
3. Secondary CTA

---

## CONTACT PAGE

1. Contact form
2. Address + optional map
3. Footer with links

---

# Design System Rules

- Industrial, premium, minimal design
- Use generous spacing (py-20, py-24 sections)
- Container width: max-w-7xl mx-auto px-6
- Typography scale should be consistent
- Primary color: Cyan-based CTA
- Backgrounds: White, light gray, or dark gradient
- Use subtle hover transitions
- No heavy shadows
- No flashy animations

---

# Tailwind Usage Rules

- Always use responsive classes
- Mobile-first approach
- Use grid for layout when possible
- Use flex for alignment
- Avoid hardcoded pixel values unless necessary
- Use consistent spacing scale

---

# Component Naming Rules

HeroSection.tsx  
ProblemSolutionSection.tsx  
ModulesSection.tsx  
DashboardPreviewSection.tsx  
ROICounterSection.tsx  
CTASection.tsx  

Page files:

HomePage.tsx  
AboutPage.tsx  
MarketIntelligencePage.tsx  
DashboardPage.tsx  
BusinessImpactPage.tsx  
ContactPage.tsx  

---

# What Claude SHOULD Do

- Create clean reusable React components
- Use semantic HTML
- Use Tailwind properly
- Keep code readable
- Add simple animation using Tailwind (hover, transition)
- Use placeholder images when needed
- Keep content editable
- Keep structure scalable

---

# What Claude MUST NOT Do

- Do NOT install additional libraries unless requested
- Do NOT use external UI frameworks
- Do NOT overcomplicate animations
- Do NOT create deeply nested components unnecessarily
- Do NOT mix layout logic inside pages
- Do NOT use inline CSS styles
- Do NOT create global CSS unless required

---

# Documentation Location

All documentation for design, copywriting, and section behavior is inside:

/docs/

If there is conflict:
Follow CLAUDE.md rules first.

---

# How Claude Should Respond to Prompts

When user says:

"Create Home Hero Section"

Claude must:

1. Create component file
2. Place it in correct folder
3. Follow naming convention
4. Use Tailwind styling
5. Keep it reusable
6. Export default component

When user says:

"Assemble Home Page"

Claude must:

1. Import all sections
2. Assemble cleanly
3. Not include styling inside page file

---

# Performance Rules

- Avoid unnecessary re-renders
- Avoid unnecessary useEffect
- Avoid heavy animation libraries
- Keep bundle minimal

---

# Future Scalability

Project should allow:

- CMS integration later
- API integration later
- Dashboard extension later
- Animation upgrades later

Structure must remain scalable.

---

END OF CLAUDE RULESET