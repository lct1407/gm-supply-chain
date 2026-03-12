# Create a new frontend page

Build a complete frontend page for: $ARGUMENTS

## Pre-check
1. Read the FRD requirement in `docs/frd/README.md` for this feature
2. Read the UI/UX spec in `docs/ui-ux/README.md` for layout/design tokens
3. Read the FDD in `docs/fdd/README.md` for API endpoints and data types

## Steps (follow this order)
1. **Types**: Create/update TypeScript types in `frontend/src/types/` matching backend schemas
2. **API Client**: Create API functions in `frontend/src/lib/api/` using the existing API client pattern
3. **Hooks**: Create TanStack Query hooks in `frontend/src/hooks/` (useQuery for reads, useMutation for writes)
4. **Components**: Build feature components in `frontend/src/components/<feature>/` using shadcn/ui
5. **Page**: Create the page in `frontend/src/app/(dashboard)/<feature>/page.tsx`
6. **Forms**: Add Zod validation schemas for any forms (React Hook Form + Zod)
7. **Navigation**: Add the page to sidebar navigation
8. **Lint**: `cd frontend && npm run lint`
9. **Type check**: `cd frontend && npx tsc --noEmit`

## Rules
- Use shadcn/ui components — do NOT create custom UI primitives
- TanStack Query for ALL server state — no useEffect fetch
- Strict TypeScript — no `any` types
- Vietnamese labels for UI text, English for code/variables
- Tables use TanStack Table with sort/filter/pagination
- Forms use React Hook Form + Zod
- Responsive: desktop (xl) + tablet (lg) targets
- Follow existing component patterns in the codebase
