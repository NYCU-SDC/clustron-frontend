---
name: data-hooks
description: When (not) to wrap useQuery/useMutation in a custom hook.
---

# Data hooks

Don't wrap a single `useQuery`/`useMutation` call in its own custom hook (e.g. `useGetServers`, `useCreateServer`) unless it has real shared logic or is reused across multiple components. Call `useQuery`/`useMutation` directly in the component with the request function from `src/lib/request/*.ts`, matching the inline style already used in `src/components/jobs/CountsBar.tsx` and `JobSubmitForm.tsx`. A thin wrapper that only forwards `queryKey`/`queryFn` adds a layer of indirection without adding value.
