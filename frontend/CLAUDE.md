# Frontend — GM Supply Web

## Stack
- Next.js 14 App Router, TypeScript strict mode
- UI: shadcn/ui (add via `npx shadcn-ui@latest add <component>`)
- Data: TanStack Query v5 (server state), Zustand (UI state)
- Forms: React Hook Form + Zod
- Charts: Recharts
- Tables: TanStack Table v8
- Date: date-fns v3
- Excel: SheetJS (xlsx)

## Commands
- Dev server: `npm run dev`
- Tests: `npm test`
- Lint: `npm run lint`
- Type check: `npx tsc --noEmit`
- Add UI component: `npx shadcn-ui@latest add button`

## Conventions
- Pages in `src/app/(dashboard)/` (App Router)
- API client in `src/lib/api/`
- TanStack Query hooks in `src/hooks/`
- Shared components in `src/components/shared/`
- Feature components in `src/components/<feature>/`
- No `any` types — strict TypeScript
- Vietnamese labels for UI, English for code/variables
