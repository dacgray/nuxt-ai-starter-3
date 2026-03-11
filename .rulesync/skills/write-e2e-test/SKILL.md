---
name: write-e2e-test
description: "Write an e2e test for a Nuxt page or feature"
targets: ["*"]
---

Write an end-to-end test for the described Nuxt page or feature.

## Stack

- `@nuxt/test-utils/e2e` for `setup` and `createPage`
- `vitest` for `describe` and `it`
- `@playwright/test` for `expect` and Playwright assertions

## File naming

Place tests in `test/e2e/` and name them `<feature>.e2e.test.ts`.

## Pattern

Every e2e test file follows this structure:

```ts
import { setup, createPage } from "@nuxt/test-utils/e2e";
import { describe, it } from "vitest";
import { expect } from "@playwright/test";

await setup({
  rootDir: new URL("../..", import.meta.url).pathname,
  browser: true,
});

describe("<Feature>", () => {
  it("<assertion>", async () => {
    const page = await createPage("<route>");
    // assertions ...
    await page.close();
  });
});
```

Key rules:
- `await setup(...)` is called **at the top level** (outside `describe`), once per file.
- Every test calls `createPage` and ends with `await page.close()`.
- Import `expect` from `@playwright/test`, not from `vitest`.

## Selector preference (highest to lowest)

1. `page.getByRole(role, { name, level })` — prefer for headings, buttons, links
2. `page.getByText(text)` — for arbitrary visible text
3. `page.locator(selector)` — CSS selector, last resort

## Common assertions

```ts
// Element is visible
await expect(page.getByRole("heading", { name: "Title", level: 1 })).toBeVisible();

// Element contains text
await expect(page.locator(".alert")).toContainText("Vue");

// URL after navigation
await expect(page).toHaveURL(/\/about/);

// 404 page
await expect(page.getByText("404")).toBeVisible();
```

## Interaction examples

```ts
// Click a button and assert reactive state change
await page.getByRole("button", { name: "Increment" }).click();
await expect(page.getByRole("heading", { name: "Counter: 1" })).toBeVisible();

// Click a link and assert navigation
const link = page.getByRole("link", { name: "about" });
await expect(link).toBeVisible();
await link.click();
await expect(page).toHaveURL(/\/about/);
```

## Full example — `test/e2e/homepage.e2e.test.ts`

```ts
import { setup, createPage } from "@nuxt/test-utils/e2e";
import { describe, it } from "vitest";
import { expect } from "@playwright/test";

await setup({
  rootDir: new URL("../..", import.meta.url).pathname,
  browser: true,
});

describe("Homepage", () => {
  it("renders the main heading", async () => {
    const page = await createPage("/");
    await expect(
      page.getByRole("heading", {
        name: "Welcome to Nuxt Content Starter",
        level: 1,
      }),
    ).toBeVisible();
    await page.close();
  });

  it("renders content sections", async () => {
    const page = await createPage("/");
    await expect(
      page.getByRole("heading", { name: "Manage your Contents", level: 2 }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Query & Render Pages", level: 2 }),
    ).toBeVisible();
    await page.close();
  });

  it("renders the about link and navigates to the about page", async () => {
    const page = await createPage("/");
    const link = page.getByRole("link", { name: "about" });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/about/);
    await page.close();
  });

  it("renders the AppAlert component", async () => {
    const page = await createPage("/");
    const alert = page.locator(".alert");
    await expect(alert).toBeVisible();
    await expect(alert).toContainText("Vue");
    await page.close();
  });

  it("increments the counter", async () => {
    const page = await createPage("/");
    await page.getByRole("button", { name: "Increment" }).click();
    await expect(
      page.getByRole("heading", { name: "Counter: 1" }),
    ).toBeVisible();
    await page.close();
  });

  it("returns 404 for unknown routes", async () => {
    const page = await createPage("/does-not-exist");
    await expect(page.getByText("404")).toBeVisible();
    await page.close();
  });
});
```

## Run the tests

```bash
npm run test:e2e
```
