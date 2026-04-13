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

- **`src/index.css`** — Single source of truth for all colors. Defines CSS variables inside `@theme` block (`--color-primary`, `--color-heading`, `--color-navy`, etc.). Values match `docs/design-system.md`. Also contains glassmorphism (`.glass-card`), scroll animation (`.fade-up`), desktop nav underline (`.header-nav-item`), and drawer nav overrides (`.drawer-nav`).
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
- **`src/components/layout/Header.tsx`** — Uses `useNavigate()` + `useLocation()` for navigation
- Internal links: use `useNavigate()` or `<Link>` from `"react-router"` — never raw `<a>` for internal routes
- External links (mailto, external URLs): use standard `<a>` tags

### Active Routes

| Path | Page | Status |
|------|------|--------|
| `/` | HomePage | Done |
| `/about` | AboutPage | Done |
| `/solutions` | SolutionsPage | Done |
| `/market-intelligence` | MarketIntelligencePage | Done |
| `/business-impact` | BusinessImpactPage | Done |
| `/dashboard` | DashboardPage | Done |
| `/contact` | ContactPage | Done |

## Layout Architecture

- **`src/components/layout/Layout.tsx`** — Root layout using Ant Design `<Layout>` + `<Layout.Content>` + `<Outlet />` + `<Footer />`
- **`src/components/layout/Header.tsx`** — Sticky enterprise nav bar: logo (left) | plain `<nav>` + `<ul>` centered links with `.header-nav-item` CSS underline animation (desktop `lg+`) | "Request Demo" Button (right). Mobile/tablet (`<lg`): hamburger icon opens Ant Design `<Drawer>` with vertical `<Menu>` + full-width CTA. Desktop nav does NOT use Ant Design Menu (avoids `rc-overflow` auto-collapse issues).
- **`src/components/layout/Footer.tsx`** — 3-column responsive footer: Brand + tagline | Navigation links | Contact email. Ant Design `<Divider>`. `bg-background-alt`.
- Header overrides Ant Design defaults via `style` prop (background, height, padding) since Tailwind can't beat Ant's specificity
- Pages render inside `<Outlet />` — never duplicate Header or Footer inside page components

## UI Enhancements

- **Glassmorphism** (`.glass-card` in index.css): Semi-transparent `rgba(255,255,255,0.6)` + `backdrop-blur(12px)`, `var(--color-card-border)` border, hover lift (`translateY(-4px)`) + soft shadow. Used on Hero image frame, Module cards, ROI stat cards, feature cards.
- **Scroll fade-in** (`.fade-up` in index.css): `opacity: 0` + `translateY(24px)` → animates to visible on scroll. Toggles both directions (scroll up re-triggers).
- **`src/hooks/useFadeIn.ts`** — Lightweight hook using native IntersectionObserver (5% threshold, -40px rootMargin, bidirectional). Returns a ref to attach to any element.
- **CTASection** accepts optional `heading`, `subtext`, and `buttonLabel` props for page-specific content.

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
│   ├── layout/          # Layout.tsx, Header.tsx, Footer.tsx
│   └── sections/        # All section components (see below)
├── pages/               # All page components (lazy-loaded)
├── hooks/               # useFadeIn.ts
├── theme/               # context.ts, ThemeProvider.tsx
├── assets/
├── constants/
└── utils/
```

### Section Components

**Home**: HomeHeroSection, ProblemSolutionSection, ModulesSection, ROICounterSection
**About**: MissionSection, VisionSection, ImplementationModelSection
**Solutions**: SolutionsOverviewSection
**Market Intelligence**: MarketIntelHeroSection, MarketIntelProblemSection, MarketIntelFeaturesSection, MarketIntelDashboardSection, MarketIntelOutcomeSection
**Business Impact**: BusinessImpactHeroSection, BusinessImpactStatsSection, BusinessImpactValueSection
**Contact**: ContactHeroSection, ContactFormSection, ContactMapSection
**Shared**: CTASection (accepts props for page-specific content)

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

1. HomeHeroSection
2. ProblemSolutionSection
3. ModulesSection
4. ROICounterSection
5. CTASection (default content)

### ABOUT PAGE

1. MissionSection
2. VisionSection (has image placeholder)
3. ImplementationModelSection (3 cards: Consulting, Implementation, Maintenance)

### SOLUTIONS PAGE

1. SolutionsOverviewSection (5 module cards with "Learn More" links)
2. CTASection ("Find the Right Module for You")

### MARKET INTELLIGENCE PAGE

1. MarketIntelHeroSection
2. MarketIntelProblemSection (3 problem cards)
3. MarketIntelFeaturesSection (3 feature cards)
4. MarketIntelDashboardSection (screenshot placeholder)
5. MarketIntelOutcomeSection (3 stats)
6. CTASection ("Stay Ahead of the Market")

### BUSINESS IMPACT PAGE

1. BusinessImpactHeroSection
2. BusinessImpactStatsSection (6 stats, 2-col mobile / 3-col desktop)
3. BusinessImpactValueSection (3 value cards)
4. CTASection ("Ready to See the Impact?")

### DASHBOARD PAGE

DashboardPage is a single-component page (no section components) with:
1. Large headline (`font-extrabold`, up to `text-6xl`) + description
2. Two dashboard screenshots in responsive grid (stacked mobile, side-by-side `md+`)
3. Hover effect: `scale-[1.03]` + `shadow-sm` → `shadow-lg` transition
4. Images: `image_dashboard-1.jpg`, `Image-dashboard-2.jpg` from `/public`

### CONTACT PAGE

1. ContactHeroSection
2. ContactFormSection (Ant Design Form + contact details, two-column on lg+)
3. ContactMapSection (Google Maps embed via iframe)

## Design System Rules

- Industrial, premium, minimal design
- Use generous spacing (py-14 mobile, py-20 tablet, py-24 desktop)
- Container width: max-w-7xl mx-auto px-4 sm:px-6
- Typography scale should be consistent
- Primary color: Cyan-based CTA
- Backgrounds: White (#FFFFFF) or light gray (#F5F7FA)
- Use subtle hover transitions
- No heavy shadows
- No flashy animations — only subtle fade-in, hover lift, soft transitions

## Tailwind Usage Rules

- Always use responsive classes
- Mobile-first approach (base → sm → md → lg)
- Use grid for layout when possible
- Use flex for alignment
- Avoid hardcoded pixel values unless necessary
- Use consistent spacing scale

## Component Naming Rules

Section files: `[PageName][SectionPurpose]Section.tsx` (e.g., `MarketIntelHeroSection.tsx`, `BusinessImpactStatsSection.tsx`)

Page files: `[PageName]Page.tsx` (e.g., `HomePage.tsx`, `AboutPage.tsx`)

Layout files: `Layout.tsx`, `Header.tsx`, `Footer.tsx`

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
- Do NOT use Ant Design `<Menu mode="horizontal">` for desktop nav (rc-overflow auto-collapse issue)

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
