# Task List Application - Design Guidelines

## Design Approach
**Hybrid Approach**: Combining productivity app best practices (Todoist, Linear, Notion) with a warm, welcoming aesthetic for enhanced user comfort during extended use.

**Core Philosophy**: Create a calming, distraction-free environment that encourages productivity while maintaining visual warmth and approachability.

---

## Color Palette

### Primary Colors
- **Warm Coral**: 16 85% 73% - Primary actions, active states, brand presence
- **Soft Peach**: 20 100% 88% - Secondary elements, hover states, subtle highlights
- **Warm Cream**: 30 100% 97% - Background for light mode
- **Deep Navy**: 220 20% 15% - Background for dark mode

### Supporting Colors
- **Sage Green**: 140 25% 55% - Success states, completed tasks
- **Warm Gray Scale**: 
  - Text Primary: 220 15% 20% (light) / 30 15% 95% (dark)
  - Text Secondary: 220 10% 45% (light) / 30 10% 70% (dark)
  - Borders: 220 15% 90% (light) / 220 15% 25% (dark)

---

## Typography
- **Primary Font**: Inter (via Google Fonts CDN) - Clean, modern readability
- **Headings**: 
  - H1: 2.5rem (40px), font-weight 700, tight tracking
  - H2: 1.875rem (30px), font-weight 600
  - H3: 1.5rem (24px), font-weight 600
- **Body**: 1rem (16px), font-weight 400, line-height 1.6
- **Small Text**: 0.875rem (14px) for metadata, timestamps

---

## Layout System
**Spacing Units**: Consistent use of Tailwind units 2, 4, 6, 8, 12, 16, 20, 24
- Micro spacing: p-2, gap-2
- Standard spacing: p-4, p-6, gap-4
- Section spacing: py-12, py-16, py-20
- Large spacing: py-24 (landing page sections)

**Grid System**: max-w-7xl container with responsive breakpoints

---

## Component Library

### Landing Page Components
**Hero Section** (py-20 to py-24):
- Split layout: Left side with headline + auth options, right side with hero image
- Headline: Large, bold typography emphasizing productivity and simplicity
- Three prominent auth buttons (Google, WhatsApp, Email) with icons
- Warm gradient background overlay (subtle peach to cream)

**Features Section** (3-column grid on desktop):
- Icon + title + description cards
- Icons from Heroicons (outline style)
- Rounded cards with subtle shadow and warm background

**Benefits Section**:
- Alternating left/right image-text layout
- Screenshots showing task organization, filtering, calendar views
- Emphasize: simplicity, cross-platform, free forever

**CTA Section**:
- Centered, minimal with primary CTA button
- Supporting text about free signup, no credit card required

### Authentication Components
**Auth Modal/Page**:
- Clean, centered card design (max-w-md)
- Three large, distinctive buttons for each auth method
- Google: White background with Google logo
- WhatsApp: Green accent (142 70% 45%)
- Email: Coral primary color
- Dividers with "or" text between options

### Dashboard Components
**Task List View**:
- Clean, scannable list with generous spacing (gap-3)
- Each task card: checkbox, title, due date, priority indicator, action menu
- Hover state: subtle background change, slight elevation
- Completed tasks: strikethrough text, muted colors

**Task Input**:
- Prominent "Add Task" button (fixed or sticky)
- Inline quick-add input OR modal form
- Form fields: Title (required), description (optional), due date, priority

**Sidebar Navigation**:
- Compact, collapsible on mobile
- Icons + labels for: All Tasks, Today, Upcoming, Completed, Lists/Projects
- User profile section at bottom

**Top Bar**:
- Search functionality, view toggles (list/grid), user menu
- Clean, minimal height (h-16)

---

## Images
**Hero Image**: Right side of hero section
- Description: Clean, bright workspace scene - laptop/tablet showing organized tasks, warm natural lighting, plants, coffee mug
- Style: Modern lifestyle photography with warm tones
- Placement: Takes up 40-50% of hero section on desktop, hidden on mobile

**Feature Screenshots**: Benefits section
- Description: High-quality app screenshots showing task organization, calendar view, mobile interface
- Style: Device mockups (desktop/mobile) with subtle shadows
- Placement: Alternating sides in benefits section

---

## Interaction Patterns
- **Animations**: Minimal, purposeful only
  - Task completion: Subtle check animation, fade to muted state
  - Add task: Smooth slide-in for new items
  - No page transitions or scroll effects
- **Loading States**: Skeleton screens for task lists, spinner for actions
- **Feedback**: Toast notifications (top-right) for success/error states

---

## Accessibility
- Maintain WCAG AA contrast ratios in both light and dark modes
- Keyboard navigation for all task management actions
- Focus indicators: 2px coral outline with offset
- Screen reader labels for icon-only buttons
- Dark mode: Reduce coral brightness to 16 85% 65% for better comfort

---

## Visual Hierarchy
- Primary actions (Add Task, Sign Up): Coral background, white text, prominent size
- Secondary actions: Outline style with coral border
- Tertiary actions: Ghost style, gray text
- Task priority: Color-coded dots (High: 0 70% 60%, Medium: 40 70% 60%, Low: 220 15% 60%)

This warm, productivity-focused design creates a comfortable environment for daily task management while maintaining professional polish and functional clarity.