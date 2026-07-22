---
name: single-source-of-truth
description: Avoid duplicated types, constants, query keys, and business logic across the frontend codebase.
---

# Single source of truth

Before writing a new type, constant, query key, or piece of business logic, grep for an existing one first (by field names or by the feature name) — duplicating one instead of reusing it is the most common mistake to avoid here.

## Types

Domain types (API request/response shapes, enums, form state) live in `src/types/<domain>.ts`, never inline in a `src/lib/request/*.ts` file, a hook, or a component. Request functions, hooks, and components all `import type { ... } from "@/types/<domain>"`. See `src/types/group.ts` and `src/types/resource.ts` for the pattern.

## Derived constants

Anything derived from a type — select option lists, label lookup maps, status-to-color maps — must be defined exactly once, in the matching `src/types/<domain>.ts` file, and imported everywhere it's needed. Never re-declare the same `{ value, label }[]` array or `Record<Enum, string>` map in more than one component. Example: `RESOURCE_ROLE_OPTIONS` / `RESOURCE_ROLE_LABEL_KEYS` in `src/types/resource.ts`.

## React Query keys

Each domain's query keys are defined once, as a small key object/factory in that domain's `src/lib/request/*.ts` file (e.g. `serverQueryKeys` in `src/lib/request/resources.ts`), and imported by every `useQuery`/`useMutation`/`invalidateQueries` call that touches it. Never hand-type the same `["thing", id]` array literal in more than one file — a typo silently breaks cache invalidation.

## Form default/empty state

A constant like `emptyXFormData` belongs in the file that actually uses it (usually the one component that seeds `useState` with it), not in a shared form-fields component that doesn't need it itself.

## Business logic

A computation, formatting rule, or coordination flow (e.g. converting `memory_mb` to GB for display, mapping a status to a badge color, deciding when to close a drawer after a save) is written once and imported/called from everywhere it's needed — never copy-pasted into a second component with the same shape. If two components need the same derived value or the same multi-step flow (e.g. "run these mutations, then toast + close only if all succeed"), extract it into a shared function (in `src/lib/`) or a shared component/hook, rather than re-implementing it inline a second time.

Before writing a calculation, mapping, or multi-step flow, check whether the same shape of logic already exists elsewhere in the feature (or a sibling feature like `jobs/`) and reuse or extract it instead of re-deriving it.
