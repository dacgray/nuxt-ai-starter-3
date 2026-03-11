# Users Page

## Goal

Add a dedicated `/users` page that fetches and displays the list of users from the JSONPlaceholder API using the existing `useUsers` composable, making the data-fetching pattern visible end-to-end in the browser with proper loading and error states.

## Scope

### In scope

| file(s)                            | change impact                                       |
| ---------------------------------- | --------------------------------------------------- |
| `app/pages/users.vue`              | A new page to surface user data                     |
| `UserList` component               | A structured visual presentation for the User array |
| `app.vue`                          | A navigation link to reach the new page             |
| `test/e2e/users.spec.ts`           | E2E test coverage for the new page                  |
| `components/UserList.unit.test.ts` | Unit test coverage for the component                |

### Out of scope

- User detail / profile page (individual user route)
- Search, filtering, sorting, or pagination of users
- Write operations — create, update, delete users

## Rough Strategy

| file(s)                            | change                               | effect                                                             |
| ---------------------------------- | ------------------------------------ | ------------------------------------------------------------------ |
| `app/pages/users.vue`              | Create the route and wire `useUsers` | Establishes the `/users` Nuxt route and wires reactive state       |
| `app/components/UserList.vue`      | Build a component to render the list | Renders a summary table using Nuxt UI primitives                   |
| `app/pages/users.vue`              | Add loading and error UI             | Show a skeleton or spinner while loading; render an alert on error |
| `app.vue`                          | Add navigation link                  | Introduce a link so users can navigate to `/users` from any page   |
| `test/e2e/users.spec.ts`           | Add Playwright E2E test              | Covers the happy path and errors for the new page                  |
| `components/UserList.unit.test.ts` | Add component unit test              | Verifies correct rendering of the `UserList` component             |

## Broad Acceptance Criteria

| #   | What to verify          | Where to look                                       | How to test                                                                                |
| --- | ----------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 1   | `/users` route resolves | Browser at `localhost:3000/users`                   | Navigate directly to the URL and confirm the page loads without a 404                      |
| 2   | User list renders data  | Browser viewport on `/users`                        | Confirm at least 10 rows are visible, each showing name, username, email, and company name |
| 3   | Loading state is shown  | Browser DevTools — Network tab throttled to Slow 3G | Throttle network, reload `/users`, and confirm a spinner or skeleton appears               |
| 4   | Error state is shown    | Browser DevTools — block the JSONPlaceholder URL    | Block the API URL, reload `/users`, and confirm an error message is displayed              |
| 5   | Navigation link works   | Browser nav from the home page                      | Click the users nav link on the home page and confirm the browser reaches `/users`         |
| 6   | Tests pass              | Terminal — `npm run test`                           | Run all relevant tests and confirm they are green                                          |
