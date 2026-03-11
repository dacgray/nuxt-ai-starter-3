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
