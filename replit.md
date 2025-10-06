# TaskFlow - Task Management Application

## Overview

TaskFlow is a modern task management web application built with a warm, eye-friendly design philosophy. The application combines productivity app best practices with a welcoming aesthetic to create a calming, distraction-free environment for task organization. It features user authentication, task CRUD operations, and a responsive design that works across all devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **React** with TypeScript for the UI layer
- **Vite** as the build tool and development server
- **Wouter** for client-side routing (lightweight alternative to React Router)
- **TanStack Query** (React Query) for server state management and data fetching
- **Tailwind CSS** for styling with custom design system
- **shadcn/ui** component library (Radix UI primitives) for accessible, pre-built components

**Design System:**
- Custom color palette with warm tones (Warm Coral, Soft Peach, Sage Green)
- Supports both light and dark themes via ThemeProvider context
- Consistent spacing using Tailwind units (2, 4, 6, 8, 12, 16, 20, 24)
- Inter font family from Google Fonts
- Custom CSS variables for theme colors defined in `index.css`

**State Management:**
- React Query for async server state (tasks, user data)
- Local React state for UI interactions
- LocalStorage for user session persistence
- Context API for theme management

**Component Structure:**
- Page components in `client/src/pages/`
- Reusable UI components in `client/src/components/ui/` (shadcn/ui)
- Feature components in `client/src/components/`
- Custom hooks in `client/src/hooks/`

### Backend Architecture

**Technology Stack:**
- **Express.js** for the REST API server
- **TypeScript** for type safety
- **Drizzle ORM** for database interactions
- **Neon Database** (PostgreSQL) as the database provider

**API Design:**
- RESTful API endpoints under `/api` prefix
- Authentication endpoints: `/api/auth/login`, `/api/auth/register`
- Task endpoints: `/api/tasks/*`
- JSON request/response format
- Error handling middleware with status codes and error messages

**Storage Layer:**
- In-memory storage implementation (`MemStorage`) for development/testing
- Database storage interface (`IStorage`) for production with PostgreSQL
- Schema validation using Zod and `drizzle-zod`

**Server Configuration:**
- Development: Vite middleware mode for HMR
- Production: Static file serving from `dist/public`
- Request logging middleware for API endpoints
- JSON and URL-encoded body parsing

### Data Models

**User Schema:**
```typescript
{
  id: varchar (UUID, primary key)
  username: text (unique, not null)
  password: text (not null)
}
```

**Task Schema:**
```typescript
{
  id: varchar (UUID, primary key)
  userId: varchar (foreign key reference)
  title: text (not null)
  description: text (optional)
  completed: boolean (default: false)
  dueDate: timestamp (optional)
}
```

**Validation:**
- Zod schemas derived from Drizzle table definitions
- Input validation on both client and server
- Type-safe schema exports via `@shared/schema.ts`

### Authentication & Authorization

**Current Implementation:**
- Simple username/password authentication
- Credentials stored in database (passwords currently stored as plain text)
- User session persisted in localStorage
- No session management or JWT tokens implemented

**Security Considerations:**
- Password hashing not implemented (development phase)
- No CSRF protection
- No rate limiting
- Session management needs implementation for production

### Build & Deployment

**Development Workflow:**
- `npm run dev` - Starts Express server with Vite middleware
- Hot Module Replacement (HMR) enabled for React components
- TypeScript type checking via `npm run check`
- Database migrations via `npm run db:push`

**Production Build:**
- `npm run build` - Builds both frontend (Vite) and backend (esbuild)
- Frontend output: `dist/public/`
- Backend output: `dist/index.js`
- `npm start` - Runs production server

**Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection string (required)
- `NODE_ENV` - Environment mode (development/production)
- `REPL_ID` - Replit-specific configuration flag

## External Dependencies

### Database
- **Neon Database** - Serverless PostgreSQL provider
- **Drizzle ORM** - TypeScript ORM for database operations
- Connection via `@neondatabase/serverless` driver
- Schema migrations managed through Drizzle Kit

### UI Component Library
- **Radix UI** - Headless UI primitives for accessible components
- **shadcn/ui** - Pre-styled component library built on Radix UI
- Extensive component set including dialogs, dropdowns, forms, navigation

### Styling & Design
- **Tailwind CSS** - Utility-first CSS framework
- **class-variance-authority** - For component variant management
- **clsx** & **tailwind-merge** - For conditional class merging
- **Google Fonts** - Inter font family via CDN

### Development Tools
- **Replit Plugins** - Development banner, cartographer, runtime error overlay
- **TypeScript** - Type checking and compilation
- **esbuild** - Fast JavaScript bundler for backend
- **tsx** - TypeScript execution for Node.js

### Additional Libraries
- **date-fns** - Date manipulation and formatting
- **react-hook-form** - Form state management
- **lucide-react** - Icon library
- **react-icons** - Additional icon sets (Google icon for OAuth UI)
- **nanoid** - Unique ID generation
- **wouter** - Lightweight routing library
- **vaul** - Drawer component library
- **embla-carousel-react** - Carousel component
- **cmdk** - Command menu component