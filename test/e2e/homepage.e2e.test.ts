import { setup, createPage } from '@nuxt/test-utils/e2e'
import { describe, it } from 'vitest'
import { expect } from '@playwright/test'

await setup({
  rootDir: new URL('../..', import.meta.url).pathname,
  browser: true,
})

describe('Homepage', () => {
  it('renders the main heading', async () => {
    const page = await createPage('/')
    await expect(
      page.getByRole('heading', {
        name: 'Welcome to Nuxt Content Starter',
        level: 1,
      }),
    ).toBeVisible()
    await page.close()
  })

  it('renders content sections', async () => {
    const page = await createPage('/')
    await expect(
      page.getByRole('heading', { name: 'Manage your Contents', level: 2 }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Query & Render Pages', level: 2 }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Integrate Vue Component', level: 2 }),
    ).toBeVisible()
    await page.close()
  })

  it('renders the about link and navigates to the about page', async () => {
    const page = await createPage('/')
    const link = page.getByRole('link', { name: 'about' })
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveURL(/\/about/)
    await page.close()
  })

  it('renders the AppAlert component', async () => {
    const page = await createPage('/')
    const alert = page.locator('.alert')
    await expect(alert).toBeVisible()
    await expect(alert).toContainText('Vue')
    await page.close()
  })

  it('renders the AppCounter with initial count of 0', async () => {
    const page = await createPage('/')
    await expect(
      page.getByRole('heading', { name: 'Counter: 0' }),
    ).toBeVisible()
    await page.close()
  })

  it('increments the counter', async () => {
    const page = await createPage('/')
    await page.getByRole('button', { name: 'Increment' }).click()
    await expect(
      page.getByRole('heading', { name: 'Counter: 1' }),
    ).toBeVisible()
    await page.close()
  })

  it('decrements the counter', async () => {
    const page = await createPage('/')
    await page.getByRole('button', { name: 'Decrement' }).click()
    await expect(
      page.getByRole('heading', { name: 'Counter: -1' }),
    ).toBeVisible()
    await page.close()
  })

  it('returns 404 for unknown routes', async () => {
    const page = await createPage('/does-not-exist')
    await expect(page.getByText('404')).toBeVisible()
    await page.close()
  })
})
