# XChart Design System (Light Enterprise Theme)

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

# Color System (Light Theme)

## Primary Background

Main Background:
#FFFFFF

Alternate Section Background:
#F5F7FA

Subtle Divider Background:
#EEF2F6

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

## Secondary Accent (Enterprise Navy)

Deep Navy:
#0F2438

Used for:
• Strong headings  
• Footer background  
• Dark contrast sections  

---

## Neutral Text System

Primary Heading Text:
#111827

Secondary Text:
#374151

Muted Text:
#6B7280

Light Divider:
#E5E7EB

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
#00D1FF

Text:
#0F2438

Hover:
#00B8E6

Border Radius:
Subtle rounding (not playful)

Weight:
Medium to Semi-bold

---

## Secondary Button

Background:
Transparent

Border:
1px solid #00D1FF

Text:
#00D1FF

Hover:
Background #00D1FF
Text #0F2438

---

# Card Design

Card Background:
#FFFFFF

Border:
1px solid #E5E7EB

Shadow:
Very subtle soft shadow

Corner Radius:
Moderate

Used in:
• Modules section  
• ROI blocks  
• Feature blocks  

Cards must feel:
• Clean  
• Structured  
• Enterprise  

---

# Dashboard Visual Treatment

Based on page 9 of the presentation :contentReference[oaicite:1]{index=1}:

Dashboards represent:
• Shopfloor Heatmap  
• Global Control Tower  
• Executive S&OP  

When displayed on website:

• Use high-resolution screenshots  
• White or very light background section  
• Slight hover zoom  
• Clean framing  

No dark heavy panels on marketing pages.

---

# ROI Emphasis

Based on page 10 :contentReference[oaicite:2]{index=2}:

40% Reporting Labor Reduction  
8% Cost Savings  
High Throughput  
Rapid Deployment  

Numbers should:
• Be bold  
• Use brand cyan (#00D1FF) for percentage  
• Use strong heading color (#111827)  

---

# Visual Philosophy

Light
Structured
Confident
Data-driven
Minimal

Avoid:
• Heavy gradients
• Neon glow
• Dark futuristic themes
• Playful startup styling
• Over-animation

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

backgroundColor: #00D1FF
borderColor: #00D1FF
color: #0F2438

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