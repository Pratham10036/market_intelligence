# XChart Design System (Dark Glassmorphism Theme)

Derived from:
XChart – The Bridge to Industry 4.0 Presentation

---

# Brand Positioning

XChart is an enterprise-grade Industry 4.0 intelligence platform built for solar manufacturing leaders.

Tone:
• Authoritative  
• Analytical  
• Enterprise  
• Strategic  
• AI-driven  
• Operationally focused  

Target Audience:
• CXOs  
• Operations Heads  
• SCM Leaders  
• Manufacturing Directors  

---

# Core Brand Narrative

Primary Tagline:
"The Bridge to Industry 4.0"

Supporting Message:
Transforming solar manufacturing into intelligent, autonomous ecosystems.

The website must communicate:
• Real-time intelligence  
• Unified digital thread  
• AI-enabled decision making  
• MES-to-ERP integration  
• Measurable ROI  

---

# Color System (Dark Glassmorphism Theme)

## Primary Background

Main Background:
#0F172A

Alternate Section Background:
#111827

Subtle Divider Background:
#1E293B

---

## Primary Brand Accent (CTA Color)

Cyan Brand Color:
#00D1FF

Hover Variation:
#00B8E6

Used for:
• Primary buttons  
• Key highlights  
• Important links  
• Section underlines  

---

## Secondary Accent (Deep Slate)

Deep Slate:
#0F172A

Used for:
• Page backgrounds
• Footer background
• Dark contrast sections  

---

## Neutral Text System

Primary Heading Text:
#FFFFFF

Secondary Text:
#D1D5DB

Muted Text:
#9CA3AF

Light Divider:
rgba(255, 255, 255, 0.2)

---

# Typography System

Headings:
• Bold
• Clean
• Slight tracking for authority

H1:
Font size large, strong visual presence

H2:
Clear section separators

H3:
Module titles and feature headings

Body:
Readable
Professional
Not decorative
Line height slightly relaxed

---

# Layout & Spacing

Container Width:
Maximum width centered layout

Horizontal Padding:
Consistent spacing for readability

Vertical Section Spacing:
Large spacing between major sections

Sections must breathe.
No clutter.
No compressed blocks.

---

# Button System

## Primary Button

Background:
Gradient from #06B6D4 (cyan-500) to #3B82F6 (blue-500)

Text:
#FFFFFF

Hover:
Shadow glow rgba(6, 182, 212, 0.3), scale(1.02)

Active:
scale(0.98)

Border Radius:
Rounded-lg (8px)

Weight:
Medium

---

## Secondary Button

Background:
Transparent

Border:
1px solid rgba(255, 255, 255, 0.2)

Text:
#D1D5DB

Hover:
Background rgba(255, 255, 255, 0.1)
Text #FFFFFF

---

# Card Design (Glassmorphism)

Card Background:
rgba(255, 255, 255, 0.1)

Backdrop Filter:
blur(12px)

Border:
1px solid rgba(255, 255, 255, 0.2)

Shadow:
shadow-2xl (deep ambient shadow)

Corner Radius:
Rounded-2xl (16px)

Used in:
• Modules section
• ROI blocks
• Feature blocks
• Login card

Cards must feel:
• Translucent
• Layered
• Premium  

---

# Dashboard Visual Treatment

Based on page 9 of the presentation :contentReference[oaicite:1]{index=1}:

Dashboards represent:
• Shopfloor Heatmap  
• Global Control Tower  
• Executive S&OP  

When displayed on website:

• Use high-resolution screenshots
• Dark background section with glassmorphism frame
• Slight hover zoom
• Clean framing with subtle glow

---

# ROI Emphasis

Based on page 10 :contentReference[oaicite:2]{index=2}:

40% Reporting Labor Reduction  
8% Cost Savings  
High Throughput  
Rapid Deployment  

Numbers should:
• Be bold
• Use brand cyan (#06B6D4) for percentage
• Use white heading color (#FFFFFF)  

---

# Visual Philosophy

Dark
Glassmorphic
Confident
Data-driven
Premium

Avoid:
• Flat solid backgrounds without depth
• Playful startup styling
• Over-animation
• Fully opaque cards (use translucency)
• Light/white page backgrounds

---

# Animation Rules

Allowed:
• Subtle fade-in
• Gentle hover lift
• Counter animations
• Soft transitions

Not allowed:
• Bounce
• Parallax scroll
• Overly flashy interactions
• Excessive motion

---

# UI Component Policy (Ant Design Integration)

XChart uses Ant Design as the primary UI component library.

Rule:
When a UI component exists in Ant Design, it MUST be used instead of raw HTML.

---

## Mandatory Usage

Instead of:

<input />
<button />
<select />
<textarea />

Use:

<Input />
<Button />
<Select />
<TextArea />
<Form />
<Card />
<Table />
<Modal />
<Tabs />
<Tag />
<Statistic />

Imported from:

import { Input, Button, Form, Card, Table, Statistic } from "antd";

---

## Tailwind Usage Rules With Ant Design

Tailwind must be used for:

• Layout (flex, grid)
• Spacing (padding, margin)
• Section backgrounds
• Positioning
• Responsive design

Ant Design must be used for:

• Buttons
• Inputs
• Forms
• Cards (if structured UI block)
• Statistics
• Tables
• Tabs
• Modals

Do NOT restyle Ant Design heavily.

Minimal customization only using:

• style prop with HEX colors
• Tailwind wrapper classes

---

## Button Rule

Primary CTA Button must be:

<Button type="primary" />

Styled using:

background: linear-gradient(to right, #06B6D4, #3B82F6)
color: #FFFFFF

Do NOT use raw <button> for primary CTA.

---

## Form Rule

All forms (Contact page) must use:

<Form>
<Form.Item>
<Input />
<Button />
</Form>

No raw form markup allowed.

---

## Card Rule

For structured UI cards:
Use <Card /> from antd.

For layout blocks:
Use div with Tailwind.

---

## When HTML Tags Are Allowed

Allowed:

<div>
<section>
<header>
<footer>
<h1> – <h6>
<p>
<span>
<img>

Not allowed for UI controls:

<input>
<button>
select
textarea

---

## Why This Rule Exists

To ensure:

• Design consistency
• Enterprise UI standardization
• Accessibility compliance
• Future scalability
• Cleaner component architecture

---

END OF DESIGN SYSTEM