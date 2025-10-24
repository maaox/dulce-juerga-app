# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 13 static site for "Dulce Juerga," a Halloween event landing page. The application uses the App Router architecture with TypeScript and is configured for static export (`output: 'export'` in next.config.js).

## Tech Stack

- **Framework**: Next.js 13.5.1 with App Router
- **Language**: TypeScript 5.2.2
- **Styling**: Tailwind CSS with CSS variables and shadcn/ui components
- **UI Components**: Radix UI primitives via shadcn/ui
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **State Management**: React hooks (use-toast custom hook in hooks/)

## Development Commands

```bash
# Development server
npm run dev

# Production build (generates static export in /out directory)
npm run build

# Preview production build
npm start

# Linting
npm run lint

# Type checking
npm run typecheck
```

## Project Structure

```
app/
  layout.tsx       # Root layout with Inter font, metadata
  page.tsx         # Main landing page (client component)
  globals.css      # Global styles with Tailwind directives and CSS variables

components/ui/     # shadcn/ui components (47 components)
  button.tsx
  card.tsx
  badge.tsx
  # ... etc

lib/
  utils.ts         # cn() utility for merging Tailwind classes

hooks/
  use-toast.ts     # Toast notification hook

public/
  # Static assets (images)
```

## Key Architectural Patterns

### Path Aliases
The project uses `@/*` path alias (configured in tsconfig.json and components.json):
- `@/components` → components/
- `@/lib` → lib/
- `@/hooks` → hooks/

### Styling System
- Tailwind CSS with custom design tokens via CSS variables in globals.css
- Dark mode support configured (`darkMode: ['class']`)
- Component styling uses the `cn()` utility from `lib/utils.ts` to merge Tailwind classes
- shadcn/ui components follow the default style with neutral base color

### Static Export Configuration
- **Important**: `next.config.js` has `output: 'export'` which means:
  - No server-side rendering features (no API routes, middleware, or ISR)
  - Images use `unoptimized: true`
  - Build output goes to `/out` directory
  - All pages must be client components or pre-renderable

### Component Architecture
- Main page (`app/page.tsx`) is a client component (`'use client'`)
- Uses shadcn/ui components extensively (Button, Card, Badge)
- Implements smooth scroll navigation to sections
- Single-page application structure with sections: Hero, About, Tickets, Offers, Prizes, Footer

## shadcn/ui Integration

This project uses shadcn/ui components. Configuration in `components.json`:
- Style: default
- Base color: neutral
- CSS variables: enabled
- All components are in `components/ui/`

To add new shadcn/ui components (if needed):
```bash
npx shadcn@latest add [component-name]
```

## Landing Page Structure

The page follows a strategic conversion-optimized flow:

1. **Hero Section**: Full-screen hero with background image, terror effects, urgency badges, and primary CTA
2. **Sobre Nosotros (About)**: Neuromarketing copy emphasizing exclusivity and FOMO, event details with icons
3. **Tipos de Entrada (Tickets)**:
   - Two ticket types: "Entrada Libre" (free until midnight) vs "Paquete JUERGÓN" (VIP package at S/15)
   - JUERGÓN prominently featured with WhatsApp CTA button
   - Price anchoring strategy (was S/20, now S/15)
4. **Ofertas Especiales (Special Offers)**: Progressive discounts (10% until 11PM, 20% after) + JUERGÓN benefits
5. **Premios (Prizes)**: 4 chronological contests throughout the night, with grand prize at 2:30 AM
6. **Final CTA**: Last chance section before footer
7. **Footer**: Event summary, contact info, copyright

### Key Design Patterns

- **Terror Theme**: Red (#DC2626) and black color scheme throughout
- **Glow Effects**: `drop-shadow-[0_0_Xpx_rgba(220,38,38,Y)]` for glowing red effects
- **Urgency Messages**: Strategic placement of scarcity badges (90 VIP spots, 150 capacity)
- **WhatsApp Integration**: Main CTA buttons link to WhatsApp with pre-filled message
- **Custom Animations**: Float, glow-pulse, blood-drip, flicker effects in globals.css

### WhatsApp CTA Configuration

All "Obtener Entrada" buttons link to:
```
https://wa.me/51957961418?text=Deseo%20obtener%20la%20entrada%20JUERGON%20para%20Dulce%20Juerga%2C%20por%20favor
```

## Important Notes

- **ESLint**: Configured to ignore errors during builds (`ignoreDuringBuilds: true`)
- **Strict TypeScript**: Enabled in tsconfig.json
- **Module Resolution**: Uses "bundler" strategy
- **Dark Mode**: Forced dark mode via `className="dark"` on html element in layout.tsx
- **Fonts**: Uses Google Fonts Creepster and Nosifer for Halloween aesthetic (imported in globals.css)
- **Supabase**: Listed as dependency but not currently integrated in the codebase
- **Static Export**: No backend or database integration; purely client-side rendered static site
- **Responsive**: Mobile-first design with md: breakpoints for desktop
- **Event Date**: October 31, 2024 at 9:30 PM
- **Contact**: WhatsApp 957961418