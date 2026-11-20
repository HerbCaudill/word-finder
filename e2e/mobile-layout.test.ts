import { test, expect } from "@playwright/test"

test("keeps the search controls below the iPhone status area", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Safe-area overrides use the Chromium protocol")
  await page.setViewportSize({ width: 390, height: 844 })
  const session = await page.context().newCDPSession(page)
  await session.send("Emulation.setSafeAreaInsetsOverride", {
    insets: { top: 59, bottom: 34, left: 0, right: 0 },
  })
  await page.goto("/")

  const input = page.getByPlaceholder("Enter value...").first()
  await expect(input).toBeVisible()
  expect((await input.boundingBox())!.y).toBeGreaterThanOrEqual(59)
  await input.fill("ZEBR")
  await expect(page.getByRole("button", { name: "ZEBRA", exact: true })).toBeVisible()

  // Opaque status-bar mode reports zero because iOS reserves that space itself.
  await session.send("Emulation.setSafeAreaInsetsOverride", {
    insets: { top: 0, bottom: 34, left: 0, right: 0 },
  })
  await expect.poll(async () => (await input.boundingBox())!.y).toBe(12)
})

test("lets the header grow to about two thirds of a phone screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const criteria = Array.from({ length: 12 }, () => ({ mode: "contains", value: "A" }))
  await page.addInitScript(value => {
    localStorage.setItem("word-finder-criteria", value)
  }, JSON.stringify(criteria))
  await page.goto("/")

  const header = page.locator("header")
  await expect(page.getByPlaceholder("Enter value...").first()).toBeVisible()
  const { height } = (await header.boundingBox())!
  expect(height).toBeGreaterThan(844 * 0.6)
  expect(height).toBeLessThanOrEqual(Math.ceil(844 * (2 / 3)))
})
