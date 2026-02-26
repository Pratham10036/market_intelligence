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
- **React Router v7** — `react-router` (unified package, not `react-router-dom`)
- **@ant-design/icons v6** — icon library for Ant Design components
- **ESLint 9** flat config with typescript-eslint, react-hooks, and react-refresh plugins

## Theme System Architecture

Single light theme only — no dark mode.

- **`src/index.css`** — Single source of truth for all colors. Defines CSS variables inside `@theme` block (`--color-primary`, `--color-heading`, `--color-navy`, etc.). Values match `docs/design-system.md`. Also contains glassmorphism (`.glass-card`), scroll animation (`.fade-up`), and header nav menu overrides.
- **`src/theme.ts`** — Exports `lightTheme` (Ant Design `ThemeConfig`). Reads all colors from CSS variables via `getCssVariable()` — zero hardcoded HEX values.
- **`src/theme/context.ts`** — `ThemeContext` + `useTheme()` hook. Light-only, throws if used outside provider.
- **`src/theme/ThemeProvider.tsx`** — Wraps children in Ant Design `ConfigProvider` + `ThemeContext.Provider`.
- **`src/main.tsx`** — Imports `index.css` and `antd/dist/reset.css`, wraps `<App>` in `<BrowserRouter>` → `<ThemeProvider>`.

Color flow: `index.css @theme` → CSS variables → `theme.ts getCssVariable()` → Ant Design ConfigProvider + Tailwind utilities.

To use colors in components: use Tailwind classes (`text-heading`, `bg-primary`, `bg-background-alt`) or Ant Design tokens (auto-applied via ConfigProvider).

## Routing Architecture

- **`react-router` v7** (unified package) — all imports from `"react-router"`, NOT `"react-router-dom"`
- **`src/main.tsx`** — `<BrowserRouter>` wraps `<ThemeProvider>` → `<App>`
- **`src/App.tsx`** — `<Routes>` with `<Route element={<Layout />}>` as wrapper route; pages lazy-loaded via `React.lazy` + `<Suspense>`
- **`src/components/layout/Layout.tsx`** — Uses `<Outlet />` from react-router to render child routes
- **`src/components/layout/Header.tsx`** — Uses `useNavigate()` + `useLocation()` for navigation, Ant Design `Menu` for nav items
- Internal links: use `useNavigate()` or `<Link>` from `"react-router"` — never raw `<a>` for internal routes
- External links (mailto, external URLs): use standard `<a>` tags

## Layout Architecture

- **`src/components/layout/Layout.tsx`** — Root layout using Ant Design `<Layout>` + `<Layout.Content>` + `<Outlet />`
- **`src/components/layout/Header.tsx`** — Enterprise nav bar: logo (left) | centered Ant Design Menu | "Request Demo" Button (right). Uses `.header-nav` CSS class for menu styling overrides.
- Header overrides Ant Design defaults via `style` prop (background, height, padding) since Tailwind can't beat Ant's specificity
- Pages render inside `<Outlet />` — never duplicate Header inside page components

## UI Enhancements

- **Glassmorphism** (`.glass-card` in index.css): Semi-transparent `rgba(255,255,255,0.6)` + `backdrop-blur(12px)`, `var(--color-card-border)` border, hover lift (`translateY(-4px)`) + soft shadow. Used on Hero image frame, Module cards, ROI stat cards.
- **Scroll fade-in** (`.fade-up` in index.css): `opacity: 0` + `translateY(24px)` → animates to visible on scroll. Triggered by `useFadeIn()` hook via IntersectionObserver.
- **`src/hooks/useFadeIn.ts`** — Lightweight hook using native IntersectionObserver (15% threshold, fires once). Returns a ref to attach to any element.

## TypeScript Configuration

- Target: ES2022, JSX: react-jsx
- Strict mode with `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`
- Bundler module resolution with `allowImportingTsExtensions` (use `.tsx` extensions in imports)
- `verbatimModuleSyntax` is enabled — use `import type` for type-only imports

## Project Overview

This is a marketing website for XChart — a solar analytics / industrial intelligence platform.

The goal is a clean, modern, B2B industrial website with strong ROI-focused messaging.

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout.tsx, Header.tsx
│   └── sections/        # HomeHeroSection, ProblemSolutionSection, ModulesSection, ROICounterSection, CTASection
├── pages/               # HomePage.tsx (lazy-loaded)
├── hooks/               # useFadeIn.ts
├── theme/               # context.ts, ThemeProvider.tsx
├── assets/
├── constants/
└── utils/
```

## Tech Stack Rules

- Use React Functional Components only
- Use TypeScript
- Use Tailwind CSS for layout, spacing, backgrounds, and responsive design
- Use Ant Design components for UI controls (Button, Input, Select, Form, Card, Statistic, Table, Modal, Tabs, Tag)
- Use `react-router` for all navigation (Link, useNavigate, Outlet)
- Do NOT use raw HTML `<input>`, `<button>`, `<select>`, `<textarea>` — use Ant Design equivalents
- Do NOT use raw `<a>` for internal navigation — use React Router
- Do NOT use inline styles or hardcoded HEX in components — all colors flow from CSS variables
- No external UI libraries besides Ant Design (no MUI, no Bootstrap)
- No unnecessary state management
- Keep components reusable

## Folder Architecture Rules

- Each section is its own component in `src/components/sections/`
- Pages only assemble sections — no layout logic inside pages
- Layout components live in `src/components/layout/`
- Hooks live in `src/hooks/`
- Keep files under 200 lines
- If section is complex → split into smaller components

## Website Page Structure

### HOME PAGE

Sections in order:

1. HomeHeroSection
2. ProblemSolutionSection
3. ModulesSection
4. (DashboardPreviewSection — not yet built)
5. ROICounterSection
6. CTASection

### ABOUT PAGE

1. Mission statement
2. Vision with industrial imagery
3. 3-step implementation model

### SOLUTION (Parent Page)

1. Overview of modules
2. CTA linking to module detail pages

### MARKET INTELLIGENCE PAGE

1. Hero with unique gradient image
2. Problem context
3. Feature block with icons
4. Visual dashboard screenshot
5. Outcome section
6. CTA

### DASHBOARD PAGE

1. Screenshot
2. Headline + description
3. Hover or zoom effect on image

### BUSINESS IMPACT PAGE

1. Animated statistical counters
2. Customer value-focused copy
3. Secondary CTA

### CONTACT PAGE

1. Contact form
2. Address + optional map
3. Footer with links

## Design System Rules

- Industrial, premium, minimal design
- Use generous spacing (py-20, py-24 sections)
- Container width: max-w-7xl mx-auto px-6
- Typography scale should be consistent
- Primary color: Cyan-based CTA
- Backgrounds: White (#FFFFFF) or light gray (#F5F7FA)
- Use subtle hover transitions
- No heavy shadows
- No flashy animations — only subtle fade-in, hover lift, soft transitions

## Tailwind Usage Rules

- Always use responsive classes
- Mobile-first approach
- Use grid for layout when possible
- Use flex for alignment
- Avoid hardcoded pixel values unless necessary
- Use consistent spacing scale

## Component Naming Rules

Section files: `HomeHeroSection.tsx`, `ProblemSolutionSection.tsx`, `ModulesSection.tsx`, `DashboardPreviewSection.tsx`, `ROICounterSection.tsx`, `CTASection.tsx`

Page files: `HomePage.tsx`, `AboutPage.tsx`, `MarketIntelligencePage.tsx`, `DashboardPage.tsx`, `BusinessImpactPage.tsx`, `ContactPage.tsx`

Layout files: `Layout.tsx`, `Header.tsx`

## What Claude SHOULD Do

- Create clean reusable React components
- Use semantic HTML
- Use Tailwind properly
- Keep code readable
- Add simple animation using CSS/Tailwind (hover, transition, fade-up)
- Use placeholder images when needed
- Keep content editable
- Keep structure scalable
- Use `useFadeIn()` hook for scroll animations

## What Claude MUST NOT Do

- Do NOT install additional libraries unless requested
- Do NOT use external UI frameworks
- Do NOT overcomplicate animations
- Do NOT create deeply nested components unnecessarily
- Do NOT mix layout logic inside pages
- Do NOT use inline CSS styles or hardcoded HEX values
- Do NOT use `react-router-dom` — use `react-router`
- Do NOT use raw `<a>` for internal navigation

## Documentation Location

All documentation for design, copywriting, and section behavior is inside `/docs/`.

If there is conflict: Follow CLAUDE.md rules first.

## Performance Rules

- Avoid unnecessary re-renders
- Avoid unnecessary useEffect
- Avoid heavy animation libraries
- Keep bundle minimal
- Use React.lazy() for page-level code splitting

## Future Scalability

Project should allow:

- CMS integration later
- API integration later
- Dashboard extension later
- Animation upgrades later
- Additional pages via lazy-loaded routes

Structure must remain scalable.

---

END OF CLAUDE RULESET
