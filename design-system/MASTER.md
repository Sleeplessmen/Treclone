# Treclone Design System - MASTER
## SaaS Kanban & Dashboard UI/UX Pro Max Guidelines

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Design Philosophy](#-design-philosophy)
3. [Theme System](#-theme-system)
4. [Color Palette](#-color-palette)
5. [Typography](#-typography)
6. [Spacing & Layout](#-spacing--layout)
7. [Component Specifications](#-component-specifications)
8. [Drag & Drop Standards](#-drag--drop-standards)
9. [Visual Elements](#-visual-elements)
10. [Theme-Specific Guidelines](#-theme-specific-guidelines)
11. [Implementation](#-implementation)
12. [Accessibility](#-accessibility)
13. [Resources](#-resources)

---

## 🎯 Project Overview

### Product Identity
- **Name**: Treclone
- **Type**: SaaS Productivity Tool
- **Core Functionality**: Kanban Board Management + Dashboard Analytics
- **Target Users**: Teams, Project Managers, Developers, Designers
- **Platform**: Web-based (Responsive)

### Design Goals
- **Intuitive**: Zero learning curve for Trello users
- **Flexible**: Adaptable to any workflow
- **Professional**: Enterprise-grade visual polish
- **Accessible**: WCAG 2.1 AA+ compliance
- **Performant**: 60fps animations, instant feedback

---

## 🎨 Design Philosophy

### Core Principles
1. **Clarity First**: Every element must have a clear purpose
2. **Consistency**: Unified experience across all themes
3. **Feedback**: Immediate visual response to user actions
4. **Hierarchy**: Clear visual distinction between elements
5. **Whitespace**: Generous but purposeful spacing

### Design Language
- **Minimalist**: Clean lines, no unnecessary decoration
- **Functional**: Form follows function
- **Modern**: Current design trends with timeless appeal
- **Professional**: Suitable for enterprise environments

---

## 🌓 Theme System

### Available Themes
| Theme | Description | Use Case |
|-------|-------------|----------|
| **Classic Trello** | Bright, colorful, playful | Creative teams, marketing, general use |
| **Linear Minimalist** | Dark mode, monochromatic, sleek | Developers, night workers, focus mode |
| **Notion Hybrid** | Light, neutral, document-like | Professional, corporate, documentation |

### Theme Architecture
```
Three-Layer Token System:
┌─────────────────────────────────────────┐
│  Component Tokens (Theme-specific)        │
│  --trello-card-bg, --linear-board-bg     │
├─────────────────────────────────────────┤
│  Semantic Tokens (Purpose-based)          │
│  --color-primary, --color-surface        │
├─────────────────────────────────────────┤
│  Primitive Tokens (Raw values)            │
│  --color-blue-500, --space-4              │
└─────────────────────────────────────────┘
```

---

## 🎨 Color Palette

### Primitive Color Scale

#### Gray Scale (Shared Across Themes)
```css
:root {
  --color-gray-50:  #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-300: #D1D5DB;

---

## 📝 Typography

### Font Stack
```css
:root {
  /* Primary Font - Inter for all themes */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
               Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  
  /* Monospace for code */
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace;
}
```

### Type Scale
| Element | Size (rem) | Size (px) | Weight | Line Height |
|---------|------------|-----------|--------|-------------|
| Display | 3rem | 48px | 700 | 1.1 |
| H1 | 2.25rem | 36px | 700 | 1.2 |
| H2 | 1.875rem | 30px | 600 | 1.25 |
| H3 | 1.5rem | 24px | 600 | 1.3 |
| H4 | 1.25rem | 20px | 600 | 1.35 |
| Body | 1rem | 16px | 400 | 1.5 |
| Small | 0.875rem | 14px | 400 | 1.5 |
| Caption | 0.75rem | 12px | 400 | 1.4 |

### Typography Tokens
```css
:root {
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;
  
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
}
```

---

## 📏 Spacing & Layout

### Spacing Scale (4px Base Unit)
```css
:root {
  --space-0:   0;
  --space-px:  1px;
  --space-1:   0.25rem;   /* 4px */
  --space-2:   0.5rem;    /* 8px */
  --space-3:   0.75rem;   /* 12px */
  --space-4:   1rem;      /* 16px */
  --space-5:   1.25rem;   /* 20px */
  --space-6:   1.5rem;    /* 24px */
  --space-8:   2rem;      /* 32px */
  --space-10:  2.5rem;    /* 40px */
  --space-12:  3rem;      /* 48px */
  --space-16:  4rem;      /* 64px */
}

---

## 🧩 Component Specifications

### Button
| Variant | Background | Text | Border | Use Case |
|---------|------------|------|--------|----------|
| default | primary | white | none | Primary actions |
| secondary | gray-100 | gray-900 | none | Secondary actions |
| outline | transparent | foreground | border | Tertiary actions |
| ghost | transparent | foreground | none | Subtle actions |
| destructive | red-600 | white | none | Dangerous actions |

| Size | Height | Padding X | Padding Y | Font Size |
|------|--------|-----------|-----------|-----------|
| sm | 32px | 12px | 6px | 14px |
| default | 40px | 16px | 8px | 14px |
| lg | 48px | 24px | 12px | 16px |

### Card (Kanban Card)
```
┌─────────────────────────────────────────────────────┐
│  Card Header                                    [×]   │
│  Title (1 line)                              │   │
│  Labels (Badge)                              │   │
├─────────────────────────────────────────────────────┤
│  Card Content                                   │   │
│  Description text                              │   │
│  Checklist items                               │   │
├─────────────────────────────────────────────────────┤
│  Card Footer                                   │   │
│  [Due Date]  [Members]  [Actions]            │   │
└─────────────────────────────────────────────────────┘
```

### Board Column
```
┌─────────────────────────────────────┐
│  Column Header                         │
│  Title + Count + [Add Card] [Menu]   │
├─────────────────────────────────────┤
│  Cards Container                       │
│  Card 1                              │
│  Card 2                              │
│  Card 3                              │
├─────────────────────────────────────┤
│  Footer                              │
│  [Add Card] Button                   │
└─────────────────────────────────────┘
```

### Input
| Variant | Description |
|---------|-------------|

---

## 🖱️ Drag & Drop Standards

### Core Principles
1. **Instant Feedback**: Visual response within 16ms
2. **Clear Affordance**: Obvious draggable targets
3. **Smooth Motion**: 60fps animations
4. **Precise Control**: Accurate drop targeting
5. **Accessible**: Keyboard and screen reader support

### Draggable Elements

#### Card Drag
```css
.card.dragging {
  transform: rotate(2deg);
  box-shadow: var(--shadow-drag);
  z-index: 1200;
  opacity: 0.95;
  cursor: grabbing;
}

.card-drag-preview {
  background: var(--color-card);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-xl);
  transform: rotate(2deg);
  opacity: 0.9;
  z-index: 1200;
}

.card.drag-over {
  border-top: 2px solid var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 5%, transparent);
}
```

### Drop Indicators
```css
.drop-indicator-between {
  height: 2px;
  background: var(--color-primary);
  margin: var(--space-1) 0;
  opacity: 0;
  transition: opacity 150ms ease;
}

.drop-indicator-between.active {
  opacity: 1;
}

.drop-indicator-end {
  height: 2px;
  background: var(--color-primary);
  margin-top: var(--space-2);
  border-radius: var(--radius-full);
  opacity: 0;
  transition: opacity 150ms ease;
}

.drop-indicator-end.active {
  opacity: 1;
}

.drop-indicator-column {
  width: 2px;
  background: var(--color-primary);
  height: 60%;
  margin: 0 var(--space-2);
  opacity: 0;
  transition: opacity 150ms ease;
}
```

### Animation Specifications
```css
@keyframes dragStart {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.02); opacity: 0.95; }
  100% { transform: scale(1); opacity: 0.95; }
}

---

## 🎭 Visual Elements

### Icons
- **Library**: Lucide React
- **Sizes**: 16px, 18px, 20px, 24px
- **Style**: Outline icons with 2px stroke

```css
:root {
  --icon-xs: 12px;
  --icon-sm: 14px;
  --icon-md: 16px;
  --icon-lg: 18px;
  --icon-xl: 20px;
  --icon-2xl: 24px;
  
  --icon-color: var(--color-muted-foreground);
  --icon-color-hover: var(--color-foreground);
  --icon-color-primary: var(--color-primary);
}
```

### Badges
| Variant | Background | Text | Use Case |
|---------|------------|------|----------|
| default | primary | white | Priority |
| secondary | gray-100 | gray-900 | Category |
| outline | transparent | foreground | Subtle |
| destructive | red-600 | white | Urgent |
| success | green-600 | white | Completed |

### Avatars
| Size | Diameter | Use Case |
|------|----------|----------|
| xs | 24px | Table cells |
| sm | 32px | Comments |
| md | 40px | Card members |
| lg | 48px | Profile |

### Progress Indicators
```css
:root {

---

## 🌈 Theme-Specific Guidelines

---

### 🎯 Classic Trello Theme
**Inspiration**: Original Trello design  
**Mood**: Bright, colorful, playful, energetic  
**Use Case**: Creative teams, marketing, general productivity

#### Color Palette
```css
.classic-trello {
  --color-background: #F9FAFB;
  --color-foreground: #111827;
  --color-card: white;
  --color-card-foreground: #111827;
  --color-primary: #2563EB;
  --color-primary-hover: #1D4ED8;
  --color-primary-foreground: white;
  --color-secondary: #E5E7EB;
  --color-secondary-foreground: #111827;
  --color-muted: #F3F4F6;
  --color-muted-foreground: #6B7280;
  --color-border: #E5E7EB;
  --color-ring: #2563EB;
}
```

#### Component Styles
```css
.classic-trello {
  /* Board */
  --board-bg: #F9FAFB;
  --board-fg: #111827;
  
  /* Column */
  --column-bg: #F3F4F6;
  --column-fg: #111827;
  --column-border: #E5E7EB;
  --column-header-bg: #E5E7EB;
  --column-header-fg: #374151;
  
  /* Card */
  --card-bg: white;
  --card-fg: #111827;
  --card-border: #E5E7EB;
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --card-shadow-hover: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  /* Drag & Drop */
  --drag-preview-bg: white;
  --drag-preview-border: 2px dashed #2563EB;
  --drag-preview-shadow: 0 10px 25px rgba(37, 99, 235, 0.2);
  --drop-indicator-color: #2563EB;
  --drag-over-bg: rgba(37, 99, 235, 0.05);
}
```

#### Visual Characteristics
- **Cards**: White with subtle gray border
- **Columns**: Light gray background (#F3F4F6)
- **Buttons**: Bright blue primary, gray secondary
- **Icons**: Gray-600, blue-600 for interactive
- **Shadows**: Subtle, natural shadows

---

### 🌙 Linear Minimalist Theme (Dark)
**Inspiration**: Linear.app design  
**Mood**: Dark, sleek, professional, focused  
**Use Case**: Developers, night workers, focus mode

#### Color Palette
```css
.linear-dark {
  --color-background: #0D0D0D;
  --color-foreground: #E5E7EB;
  --color-card: #1A1A1A;
  --color-card-foreground: #E5E7EB;
  --color-primary: #8B5CF6;
  --color-primary-hover: #7C3AED;
  --color-primary-foreground: white;
  --color-secondary: #2A2A2A;
  --color-secondary-foreground: #E5E7EB;
  --color-muted: #2A2A2A;
  --color-muted-foreground: #9CA3AF;
  --color-border: #3A3A3A;
  --color-ring: #8B5CF6;
}
```

#### Component Styles
```css
.linear-dark {
  /* Board */
  --board-bg: #0D0D0D;
  --board-fg: #E5E7EB;
  
  /* Column */
  --column-bg: #1A1A1A;
  --column-fg: #E5E7EB;
  --column-border: #3A3A3A;

---

## 🔧 Implementation

### File Structure
```
design-system/
├── tokens/
│   ├── primitives.css       # Raw design values
│   ├── semantic.css         # Purpose-based aliases
│   ├── components.css       # Component-specific tokens
│   └── themes.css           # Theme overrides
├── components/
│   ├── Button/
│   ├── Card/
│   └── Board/
├── hooks/
│   ├── useDragDrop.ts
│   └── useTheme.ts
├── styles/
│   ├── globals.css
│   └── tailwind.css
└── MASTER.md
```

### CSS Variables Setup
```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@import './design-system/tokens/primitives.css';
@import './design-system/tokens/semantic.css';
@import './design-system/tokens/components.css';
@import './design-system/tokens/themes.css';
```

### Theme Toggle Hook
```typescript
// useTheme.ts
type Theme = 'classic-trello' | 'linear-dark' | 'notion-light'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('classic-trello')
  
  useEffect(() => {
    const root = document.documentElement
    ['classic-trello', 'linear-dark', 'notion-light'].forEach(t => 
      root.classList.remove(t)
    )
    root.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])
  
  return { theme, setTheme }
}
```

### Tailwind Configuration
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        drag: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
      },
      keyframes: {
        dragStart: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.02)', opacity: '0.95' },
          '100%': { transform: 'scale(1)', opacity: '0.95' },
        },
        dropIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        dragStart: 'dragStart 100ms ease-out',
        dropIn: 'dropIn 200ms ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

---

## ♿ Accessibility

### WCAG 2.1 Compliance
- **Normal text**: 4.5:1 minimum contrast ratio
- **Large text (18px+)**: 3:1 minimum ratio
- **UI components**: 3:1 minimum ratio
- **Focus indicators**: 3:1 minimum ratio

### Color Contrast Examples
| Element | Background | Text | Ratio |
|---------|------------|------|-------|
| Card Text (Classic) | white | #111827 | 21:1 |
| Card Text (Linear) | #1A1A1A | #E5E7EB | 15.3:1 |
| Primary Button | #2563EB | white | 7.2:1 |

### Keyboard Navigation
| Key | Action |
|-----|--------|
| Tab | Navigate forward |
| Shift+Tab | Navigate backward |
| Enter | Activate/Submit |
| Space | Toggle/Select |
| Escape | Close/Cancel |
| Arrow Keys | Navigate |

### ARIA Attributes
```html
<div role="application" aria-label="Drag card" aria-grabbed="true" tabindex="0">
  Card Content
</div>
<div role="dropzone" aria-dropeffect="move"></div>
<input aria-label="Card title" aria-required="true" />
```

### Skip Links
```html
<a href="#main-content" class="skip-link">Skip to main content</a>

<style>
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--color-primary);
    color: white;
    padding: var(--space-2) var(--space-4);
    z-index: 9999;
  }
  .skip-link:focus { top: 0; }
</style>
```

---

## 📚 Resources

### Tools
- **Design**: Figma, Adobe XD
- **Development**: VS Code, GitHub
- **Testing**: Storybook, Jest, Lighthouse
- **Accessibility**: axe DevTools, WAVE

### Libraries
- **UI Components**: shadcn/ui, Radix UI
- **Drag & Drop**: @dnd-kit/core
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animation**: Framer Motion

### Documentation
- [Tailwind CSS](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Design Tokens W3C](https://design-tokens.github.io/community-group/)

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-08-20 | Initial release - Complete design system for Treclone |

---

**Last Updated**: 2026-08-20  
**Maintainer**: Treclone Design Team  
**License**: MIT
  --column-header-bg: #2A2A2A;
  --column-header-fg: #9CA3AF;
  
  /* Card */
  --card-bg: #1A1A1A;
  --card-fg: #E5E7EB;
  --card-border: #3A3A3A;
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  --card-shadow-hover: 0 4px 6px rgba(0, 0, 0, 0.4);
  
  /* Drag & Drop */
  --drag-preview-bg: #1A1A1A;
  --drag-preview-border: 2px dashed #8B5CF6;
  --drag-preview-shadow: 0 10px 25px rgba(139, 92, 246, 0.3);
  --drop-indicator-color: #8B5CF6;
  --drag-over-bg: rgba(139, 92, 246, 0.1);
}
```

#### Visual Characteristics
- **Cards**: Dark gray (#1A1A1A) with subtle border
- **Columns**: Slightly darker background (#2A2A2A for header)
- **Buttons**: Purple primary, dark gray secondary
- **Icons**: Gray-400, purple-500 for interactive
- **Shadows**: Dark, subtle shadows with higher opacity

---

### ☀️ Notion Hybrid Theme (Light)
**Inspiration**: Notion.so design  
**Mood**: Light, clean, document-like, professional  
**Use Case**: Professional, corporate, documentation

#### Color Palette
```css
.notion-light {
  --color-background: #FFFFFF;
  --color-foreground: #0F172A;
  --color-card: white;
  --color-card-foreground: #0F172A;
  --color-primary: #10B981;
  --color-primary-hover: #059669;
  --color-primary-foreground: white;
  --color-secondary: #F8FAFC;
  --color-secondary-foreground: #0F172A;
  --color-muted: #F8FAFC;
  --color-muted-foreground: #64748B;
  --color-border: #E2E8F0;
  --color-ring: #10B981;
}
```

#### Component Styles
```css
.notion-light {
  /* Board */
  --board-bg: #F8FAFC;
  --board-fg: #0F172A;
  
  /* Column */
  --column-bg: white;
  --column-fg: #0F172A;
  --column-border: #E2E8F0;
  --column-header-bg: #F8FAFC;
  --column-header-fg: #475569;
  
  /* Card */
  --card-bg: white;
  --card-fg: #0F172A;
  --card-border: #E2E8F0;
  --card-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  --card-shadow-hover: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  /* Drag & Drop */
  --drag-preview-bg: white;
  --drag-preview-border: 2px dashed #10B981;
  --drag-preview-shadow: 0 10px 25px rgba(16, 185, 129, 0.15);
  --drop-indicator-color: #10B981;
  --drag-over-bg: rgba(16, 185, 129, 0.05);
}
```

#### Visual Characteristics
- **Cards**: White with very subtle border
- **Columns**: White background, light gray header
- **Buttons**: Emerald green primary, light gray secondary
- **Icons**: Slate-600, emerald-500 for interactive
- **Shadows**: Very subtle, almost flat
  --progress-height: 4px;
  --progress-radius: var(--radius-full);
  --spinner-size: 20px;
  --spinner-border-width: 2px;
}
```

### Tooltips
```css
:root {
  --tooltip-bg: var(--color-gray-900);
  --tooltip-fg: white;
  --tooltip-padding: var(--space-2) var(--space-3);
  --tooltip-radius: var(--radius-md);
  --tooltip-delay: 300ms;
}
```

@keyframes dropIn {
  0% { transform: translateY(-10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes reorder {
  0% { transform: translateY(10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

:root {
  --duration-drag-start: 100ms;
  --duration-drag-end: 150ms;
  --duration-drop: 200ms;
  --duration-reorder: 200ms;
  --duration-indicator: 150ms;
}
```

### Touch & Mouse Support
- **Mouse Drag Threshold**: 5px
- **Touch Drag Threshold**: 10px
- **Long Press**: 300ms to start drag
- **Touch Target**: Minimum 44x44px
- **Scroll Lock**: Prevent scrolling while dragging

### Keyboard Support
- **Space/Enter**: Start drag mode
- **Arrow Keys**: Move card/column
- **Escape**: Cancel drag
- **Enter**: Drop at current position

### ARIA Attributes
```html
<div role="application" aria-label="Drag card to reorder" aria-grabbed="true" tabindex="0">
  Card Content
</div>
<div role="dropzone" aria-label="Drop zone" aria-dropeffect="move"></div>
```

### Screen Reader Announcements
```javascript
// When drag starts
announce(`Card "${title}" grabbed. Use arrow keys to move.`);

// When moving
announce(`Card "${title}" moved to position ${position}`);

// When dropped
announce(`Card "${title}" dropped in column "${column}"`);
```
| default | Standard text input |
| textarea | Multi-line text |
| select | Dropdown selection |

| State | Border | Background | Ring |
|-------|--------|------------|------|
| default | gray-300 | white | none |
| hover | gray-400 | white | none |
| focus | primary | white | primary/20% |
| error | red-500 | white | red/20% |

### Drag & Drop Component Tokens
```css
:root {
  /* Card Dimensions */
  --card-min-width: 240px;
  --card-max-width: 320px;
  --card-min-height: 80px;
  
  /* Card Spacing */
  --card-padding: var(--space-4);
  --card-gap: var(--space-3);
  
  /* Column Dimensions */
  --column-min-width: 280px;
  --column-max-width: 320px;
  --column-height: calc(100vh - 120px);
  
  /* Column Spacing */
  --column-padding: var(--space-3);
  --column-gap: var(--space-6);
}
```
```

### Border Radius
```css
:root {
  --radius-none:    0;
  --radius-sm:      0.125rem;  /* 2px */
  --radius-default: 0.25rem;   /* 4px */
  --radius-md:      0.375rem;  /* 6px */
  --radius-lg:      0.5rem;    /* 8px */
  --radius-xl:      0.75rem;   /* 12px */
  --radius-full:    9999px;
}
```

### Shadows
```css
:root {
  --shadow-none: none;
  --shadow-sm:   0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-default: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  --shadow-md:   0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg:   0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl:   0 20px 25px -5px rgb(0 0 0 / 0.1);
  --shadow-drag: 0 10px 25px -5px rgb(0 0 0 / 0.1),
                 0 4px 6px -4px rgb(0 0 0 / 0.1),
                 0 0 0 1px rgb(0 0 0 / 0.05);
}
```

### Layout Grid
```css
/* Kanban Board Grid */
--board-columns: 4;
--board-column-min-width: 280px;
--board-column-max-width: 320px;

/* Dashboard Grid */
--dashboard-grid-columns: 12;
--dashboard-gap: var(--space-6);
```
  --color-gray-400: #9CA3AF;
  --color-gray-500: #6B7280;
  --color-gray-600: #4B5563;
  --color-gray-700: #374151;
  --color-gray-800: #1F2937;
  --color-gray-900: #111827;
  --color-gray-950: #030712;
}
```

#### Brand Colors
```css
/* Primary - Blue (Trello-inspired) */
--color-blue-50:  #EFF6FF;
--color-blue-100: #DBEAFE;
--color-blue-200: #BFDBFE;
--color-blue-300: #93C5FD;
--color-blue-400: #60A5FA;
--color-blue-500: #3B82F6;
--color-blue-600: #2563EB;
--color-blue-700: #1D4ED8;
--color-blue-800: #1E40AF;
--color-blue-900: #1E3A8A;

/* Secondary - Purple (Linear-inspired) */
--color-purple-50:  #F5F3FF;
--color-purple-100: #EDE9FE;
--color-purple-200: #DDD6FE;
--color-purple-300: #C4B5FD;
--color-purple-400: #A78BFA;
--color-purple-500: #8B5CF6;
--color-purple-600: #7C3AED;
--color-purple-700: #6D28D9;

/* Accent - Emerald (Notion-inspired) */
--color-emerald-50:  #ECFDF5;
--color-emerald-100: #D1FAE5;
--color-emerald-200: #A7F3D0;
--color-emerald-300: #6EE7B7;
--color-emerald-400: #34D399;
--color-emerald-500: #10B981;
--color-emerald-600: #059669;
--color-emerald-700: #047857;

/* Status Colors (Shared) */
--color-success: #22C55E;
--color-warning: #EAB308;
--color-error: #EF4444;
--color-info: #3B82F6;
```