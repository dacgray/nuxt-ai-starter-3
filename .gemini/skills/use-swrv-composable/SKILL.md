---
name: use-swrv-composable
description: Create a swrv data-fetching composable and its unit tests
---

Create a Vue composable that fetches data using `swrv` (stale-while-revalidate), then write unit tests that mock swrv.

## Stack

- `swrv` for data fetching (`useSWRV`)
- `vue` for `ref` (returned reactive refs)
- `vitest` for `describe`, `it`, `expect`, `vi`

## File placement

| File       | Path                                         |
| ---------- | -------------------------------------------- |
| Composable | `app/composables/use<Resource>.ts`           |
| Unit tests | `app/composables/use<Resource>.unit.test.ts` |

## Composable pattern

Destructure swrv's return and rename each field to include the resource name. For `useResource`, the returned object is:

| swrv field     | Returned as            |
| -------------- | ---------------------- |
| `data`         | `resource`             |
| `error`        | `resourceError`        |
| `isValidating` | `isResourceValidating` |
| `isLoading`    | `isResourceLoading`    |
| `mutate`       | `mutateResource`       |

```ts
import useSWRV from 'swrv'

export interface Resource {
  id: number
  // ... fields
}

const RESOURCE_URL = 'https://api.example.com/resource'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useResource() {
  const {
    data: resource,
    error: resourceError,
    isValidating: isResourceValidating,
    isLoading: isResourceLoading,
    mutate: mutateResource,
  } = useSWRV<Resource[]>(RESOURCE_URL, fetcher)
  return {
    resource,
    resourceError,
    isResourceValidating,
    isResourceLoading,
    mutateResource,
  }
}
```

Key rules:

- Export the interface so tests can import and use it for typed fixtures.
- Extract the URL as a named constant — tests assert against it.
- Extract `fetcher` as a module-level function so it can be captured and tested independently.
- Rename all swrv fields to include the resource name — no generic `data`/`error` leaking into call sites.

## Unit test pattern

Mock swrv entirely — no real HTTP calls in unit tests.

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

vi.mock('swrv', () => ({
  default: vi.fn(),
}))

// eslint-disable-next-line import/first
import useSWRV from 'swrv'
// eslint-disable-next-line import/first
import { useResource } from './useResource'
// eslint-disable-next-line import/first
import type { Resource } from './useResource'

describe('useResource', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls useSWRV with the correct URL', () => {
    vi.mocked(useSWRV).mockReturnValue({
      data: ref(undefined),
      error: ref(undefined),
      isValidating: ref(false),
      isLoading: ref(false),
      mutate: vi.fn(),
    })

    useResource()

    expect(useSWRV).toHaveBeenCalledWith(
      'https://api.example.com/resource',
      expect.any(Function),
    )
  })

  it('returns data when fetch succeeds', () => {
    const fixture: Resource[] = [{ id: 1 /* ... */ }]

    vi.mocked(useSWRV).mockReturnValue({
      data: ref(fixture),
      error: ref(undefined),
      isValidating: ref(false),
      isLoading: ref(false),
      mutate: vi.fn(),
    })

    const { resource, resourceError, isResourceValidating } = useResource()

    expect(resource.value).toEqual(fixture)
    expect(resourceError.value).toBeUndefined()
    expect(isResourceValidating.value).toBe(false)
  })

  it('returns error when fetch fails', () => {
    const fetchError = new Error('Network error')

    vi.mocked(useSWRV).mockReturnValue({
      data: ref(undefined),
      error: ref(fetchError),
      isValidating: ref(false),
      isLoading: ref(false),
      mutate: vi.fn(),
    })

    const { resource, resourceError } = useResource()

    expect(resource.value).toBeUndefined()
    expect(resourceError.value).toEqual(fetchError)
  })

  it('reflects isResourceValidating true while loading', () => {
    vi.mocked(useSWRV).mockReturnValue({
      data: ref(undefined),
      error: ref(undefined),
      isValidating: ref(true),
      isLoading: ref(true),
      mutate: vi.fn(),
    })

    const { isResourceValidating } = useResource()

    expect(isResourceValidating.value).toBe(true)
  })

  it('passes a fetcher that calls fetch and parses JSON', async () => {
    let capturedFetcher: ((url: string) => Promise<unknown>) | undefined

    vi.mocked(useSWRV).mockImplementation((_key, fetcher) => {
      capturedFetcher = fetcher as (url: string) => Promise<unknown>
      return {
        data: ref(undefined),
        error: ref(undefined),
        isValidating: ref(false),
        isLoading: ref(false),
        mutate: vi.fn(),
      }
    })

    useResource()

    const fixture: Resource[] = [{ id: 1 /* ... */ }]
    const mockJson = vi.fn().mockResolvedValue(fixture)
    global.fetch = vi.fn().mockResolvedValue({ json: mockJson })

    const result = await capturedFetcher!('https://api.example.com/resource')

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/resource',
    )
    expect(result).toEqual(fixture)
  })
})
```

Key rules:

- `vi.mock('swrv', ...)` must appear **before** any import that uses swrv (Vitest hoists it automatically).
- The mock always provides the raw swrv fields (`data`, `error`, `isValidating`, `isLoading`, `mutate`) — the renaming happens inside the composable.
- Destructure the renamed fields from the composable in tests (`resource`, `resourceError`, etc.).
- Use `vi.mocked(useSWRV).mockReturnValue(...)` for simple state scenarios.
- Use `vi.mocked(useSWRV).mockImplementation(...)` to capture and test the fetcher function.
- `beforeEach(() => vi.clearAllMocks())` keeps tests isolated.
- Always assert the URL constant, not a string literal that can drift.

## Full example — `useUsers`

### `app/composables/useUsers.ts`

```ts
import useSWRV from 'swrv'

export interface User {
  id: number
  name: string
  username: string
  email: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: { lat: string; lng: string }
  }
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

const USERS_URL = 'https://jsonplaceholder.typicode.com/users'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useUsers() {
  const {
    data: users,
    error: usersError,
    isValidating: isUsersValidating,
    isLoading: isUsersLoading,
    mutate: mutateUsers,
  } = useSWRV<User[]>(USERS_URL, fetcher)
  return { users, usersError, isUsersValidating, isUsersLoading, mutateUsers }
}
```

### `app/composables/useUsers.unit.test.ts`

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

vi.mock('swrv', () => ({
  default: vi.fn(),
}))

// eslint-disable-next-line import/first
import useSWRV from 'swrv'
// eslint-disable-next-line import/first
import { useUsers } from './useUsers'
// eslint-disable-next-line import/first
import type { User } from './useUsers'

const mockUser: User = {
  id: 1,
  name: 'Leanne Graham',
  username: 'Bret',
  email: 'Sincere@april.biz',
  address: {
    street: 'Kulas Light',
    suite: 'Apt. 556',
    city: 'Gwenborough',
    zipcode: '92998-3874',
    geo: { lat: '-37.3159', lng: '81.1496' },
  },
  phone: '1-770-736-8031 x56442',
  website: 'hildegard.org',
  company: {
    name: 'Romaguera-Crona',
    catchPhrase: 'Multi-layered client-server neural-net',
    bs: 'harness real-time e-markets',
  },
}

describe('useUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls useSWRV with the jsonplaceholder users URL', () => {
    vi.mocked(useSWRV).mockReturnValue({
      data: ref(undefined),
      error: ref(undefined),
      isValidating: ref(false),
      isLoading: ref(false),
      mutate: vi.fn(),
    })

    useUsers()

    expect(useSWRV).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/users',
      expect.any(Function),
    )
  })

  it('returns user data when fetch succeeds', () => {
    vi.mocked(useSWRV).mockReturnValue({
      data: ref([mockUser]),
      error: ref(undefined),
      isValidating: ref(false),
      isLoading: ref(false),
      mutate: vi.fn(),
    })

    const { users, usersError, isUsersValidating } = useUsers()

    expect(users.value).toEqual([mockUser])
    expect(usersError.value).toBeUndefined()
    expect(isUsersValidating.value).toBe(false)
  })

  it('returns error when fetch fails', () => {
    const fetchError = new Error('Network error')

    vi.mocked(useSWRV).mockReturnValue({
      data: ref(undefined),
      error: ref(fetchError),
      isValidating: ref(false),
      isLoading: ref(false),
      mutate: vi.fn(),
    })

    const { users, usersError } = useUsers()

    expect(users.value).toBeUndefined()
    expect(usersError.value).toEqual(fetchError)
  })

  it('reflects isUsersValidating true while loading', () => {
    vi.mocked(useSWRV).mockReturnValue({
      data: ref(undefined),
      error: ref(undefined),
      isValidating: ref(true),
      isLoading: ref(true),
      mutate: vi.fn(),
    })

    const { isUsersValidating } = useUsers()

    expect(isUsersValidating.value).toBe(true)
  })

  it('passes a fetcher that calls fetch and parses JSON', async () => {
    let capturedFetcher: ((url: string) => Promise<unknown>) | undefined

    vi.mocked(useSWRV).mockImplementation((_key, fetcher) => {
      capturedFetcher = fetcher as (url: string) => Promise<unknown>
      return {
        data: ref(undefined),
        error: ref(undefined),
        isValidating: ref(false),
        isLoading: ref(false),
        mutate: vi.fn(),
      }
    })

    useUsers()

    const mockJson = vi.fn().mockResolvedValue([mockUser])
    global.fetch = vi.fn().mockResolvedValue({ json: mockJson })

    const result = await capturedFetcher!(
      'https://jsonplaceholder.typicode.com/users',
    )

    expect(global.fetch).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/users',
    )
    expect(result).toEqual([mockUser])
  })
})
```

## Run the tests

```bash
npm run test:unit
```
