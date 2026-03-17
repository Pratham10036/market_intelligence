# Section Structure Guide (Dark Glassmorphism Version)

> Derived from: XChart Industry 4.0 Presentation

---

## LOGIN PAGE

**Authentication Entry (Basic Login)**

**Purpose:** Provide a simple and clean Login interface where users can enter their email and password to access the platform.

### Layout

- Centered card layout
- Full-page dark background (`#0F172A` gradient to `#1E293B`)
- Minimal and distraction-free UI with background glow effects
- Fully responsive (mobile-first)

### Components Structure

#### Card Container

- Glassmorphism background (`rgba(255, 255, 255, 0.1)` + `backdrop-blur-xl`)
- Translucent border (`rgba(255, 255, 255, 0.2)`)
- Rounded corners (`2xl`)
- `shadow-2xl`
- Fixed max-width with centered alignment

#### Login Form

**Content:**

- **Heading:** "Welcome to XChart"
- **Subtext:** "Enter your credentials to continue"

**Fields:**

- **Email Input**
  - Placeholder: "Enter your email"
  - Use Ant Design `<Input />`
- **Password Input**
  - Placeholder: "Enter your password"
  - Use Ant Design `<Input.Password />`

**Primary Action:**

- **Login Button**
  - Label: "Login"
  - Use `<Button type='primary' />`
  - Full width
  - Background: Gradient `#06B6D4` → `#3B82F6`

### Interaction Flow (UI Only)

1. User enters email
2. User enters password
3. Clicks "Login"
4. Redirect to Home Page (no validation, static behavior)

### UI States

- Default state (empty form)
- Input focus state
- Button hover and active states
- Optional loading state (for visual feedback)

### Design Notes

- Maintain consistent spacing using Tailwind scale (`gap-4` / `gap-6`)
- Use vertical stacking (`flex-col` layout)
- Keep typography clean and structured
- Avoid unnecessary elements or distractions
- Ensure proper alignment and visual balance

### Component Usage Rules

**Ant Design components:** `<Input />`, `<Input.Password />`, `<Button />`, `<Card />`

**Tailwind for:** Layout (flex, centering, width control), Spacing (padding, margins, gaps), Alignment

---

## HOME PAGE

### 1. Hero Section

**Purpose:** Position XChart as the strategic bridge to Industry 4.0.

**Content (from presentation):**
- "The Bridge to Industry 4.0"
- "Transforming Solar Manufacturing into Intelligent, Autonomous Ecosystems."

**Layout:**

- Dark background (`#0F172A`) with gradient to `#1E293B`
- Large bold heading in `#FFFFFF`
- Supporting paragraph in `#D1D5DB`
- Primary CTA button (gradient `#06B6D4` → `#3B82F6`)
- Subtle industrial image on right or background with glow overlay

---

### 2. Problem → Solution Section

Inspired by page 2 of the presentation.

**Layout:** Two-column structured section.

| Left: THE CHALLENGE | Right: THE XCHART SOLUTION |
| --- | --- |
| Siloed systems | Unified digital thread |
| Reactive operations | AI-enabled modules |
| Manual reporting | Autonomous ecosystems |
| Lack of unified data | Real-time visibility |

- **Background:** `#111827`
- **Cards:** Glassmorphism (`rgba(255, 255, 255, 0.1)` + `backdrop-blur`) with border `rgba(255, 255, 255, 0.2)`

---

### 3. Modules Overview Section

Based on page 3.

**Title:** "A Verticalized Suite for the Solar Value Chain"

**5 Modules:**

1. Shopfloor Analytics
2. Supply Chain Management
3. Inventory & S&OP
4. Quality 4.0
5. Market Intelligence

**Each Module Card:** Icon, Title, 1-line description

**Grid Layout:** Clean, equal spacing, glassmorphism cards

---

### 4. Dashboard Preview Section

Based on page 9.

**Title:** "Visualizing the Intelligence"

**Include:**

- Shopfloor Heatmap
- Global Control Tower
- Executive S&OP

**Layout:** 3-column grid (responsive), dark background (`#0F172A`), slight hover zoom with glow

---

### 5. ROI Section

Based on page 10.

**Title:** "Business Value & ROI"

**4 Statistic Blocks:**

| Stat | Label |
| --- | --- |
| 40% | Reporting Labor Reduction |
| 8% | Cost Savings |
| High | Throughput |
| Rapid | Deployment |

- **Numbers:** Highlighted using `#06B6D4`
- **Layout:** 4-column grid (responsive)
- **Background:** `#111827`

---

### 6. Final CTA Section

From page 11.

- **Headline:** "Close the Gap"
- **Subtext:** "Ready to bridge to Industry 4.0?"
- **Primary Button:** Gradient `#06B6D4` → `#3B82F6`
- **Optional Secondary:** Contact email display
- **Background:** `#0F172A` with cyan glow overlay
- **Text color:** `#FFFFFF`

---

## ABOUT PAGE

### Mission

Bridge traditional solar manufacturing with AI-driven Industry 4.0 ecosystems.

### Vision

Autonomous, intelligent, data-driven shop floors.

- Industrial imagery
- Dark glassmorphism layout
- Strong white typography

### 3-Step Implementation Model

From presentation:

1. **Consulting**
2. **Implementation**
3. **Maintenance**

Structured horizontal flow. Glassmorphism cards.

---

## SOLUTION (Parent Page)

Overview of all five modules.

Each module:

- Summary paragraph
- Key benefit bullets
- CTA to detailed page

---

## MARKET INTELLIGENCE PAGE

Based on page 8.

**Hero:** Dark background (`#0F172A`), strong white headline

**Sections:**

- Global volatility problem context
- Competitor benchmarking
- AI-sourcing explanation
- Dashboard preview
- Strategic outcome
- CTA

---

## DASHBOARD PAGE

**Structure:**

- Large screenshot
- Headline in `#FFFFFF`
- Short description in `#D1D5DB`
- Dark background (`#0F172A`)

**Image:** Subtle hover zoom, glassmorphism framing with glow

---

## BUSINESS IMPACT PAGE

**Sections:**

- Statistical counters
- Value-focused enterprise copy
- Secondary CTA

**Emphasis:** Measurable operational improvement.

---

## CONTACT PAGE

**Sections:**

- Contact form
- Email: contact@xchart.in
- Optional embedded map
- Dark footer

**Footer:** Background `#0F172A`, Text `#D1D5DB`

---

## Structural Rules

Each section must:

- Be isolated component
- Follow consistent spacing
- Use structured grid layout
- Avoid overcrowding

Pages only assemble sections. No inline styling. No random layout deviation.

---

## Implementation Rules for Sections

Each section must:

- Use Ant Design components where applicable
- Use Tailwind for layout and spacing
- Avoid raw HTML form controls
- Keep UI consistent across pages

**Examples:**

| Section | Components |
| --- | --- |
| CTA Section | `<Button />` from antd |
| Contact Page | `<Form />`, `<Input />`, `<Button />` from antd |
| ROI Section | `<Statistic />` for numbers |

---

*END OF SECTION STRUCTURE*
