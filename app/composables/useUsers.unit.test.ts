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

    expect(capturedFetcher).toBeDefined()

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
