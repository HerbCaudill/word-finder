import { test, expect } from "@playwright/test"

test.describe("Word Finder", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("shows all words initially", async ({ page }) => {
    await expect(page.getByText(/\d{1,3}(,\d{3})* matches/)).toBeVisible()
  })

  test("filters words by contains", async ({ page }) => {
    const input = page.getByPlaceholder("Enter value...")
    await input.fill("QUIXOT")

    // Should show words containing QUIXOT
    await expect(page.getByRole("button", { name: "QUIXOTE", exact: true })).toBeVisible()
    await expect(page.getByRole("button", { name: "QUIXOTES", exact: true })).toBeVisible()
  })

  test("filters words by starts with", async ({ page }) => {
    // Change filter mode to "Starts with"
    await page.getByRole("combobox").click()
    await page.getByRole("option", { name: "Starts with" }).click()

    const input = page.getByPlaceholder("Enter value...")
    await input.fill("ZEBR")

    await expect(page.getByRole("button", { name: "ZEBRA", exact: true })).toBeVisible()
  })

  test("filters words by ends with", async ({ page }) => {
    await page.getByRole("combobox").click()
    await page.getByRole("option", { name: "Ends with" }).click()

    const input = page.getByPlaceholder("Enter value...")
    await input.fill("ZZLE")

    // Should show words ending in ZZLE
    await expect(page.getByRole("button", { name: "PUZZLE", exact: true })).toBeVisible()
  })

  test("filters words by has length", async ({ page }) => {
    await page.getByRole("combobox").click()
    await page.getByRole("option", { name: "Has length" }).click()

    const input = page.getByPlaceholder("Enter value...")
    await input.fill("2")

    // Should show 2-letter words
    await expect(page.getByRole("button", { name: "AA", exact: true })).toBeVisible()
  })

  test("auto-adds criterion when typing in last input", async ({ page }) => {
    const inputs = page.getByPlaceholder("Enter value...")

    // Initially should have one input
    await expect(inputs).toHaveCount(1)

    // Type something in the input - should auto-add a new criterion
    await inputs.first().fill("TEST")

    // Should now have two inputs
    await expect(inputs).toHaveCount(2)
  })

  test("combines multiple criteria with AND", async ({ page }) => {
    // First criterion: starts with Z
    await page.getByRole("combobox").first().click()
    await page.getByRole("option", { name: "Starts with" }).click()
    await page.getByPlaceholder("Enter value...").first().fill("Z")

    // Second criterion auto-added, set it to has length 5
    await page.getByRole("combobox").nth(1).click()
    await page.getByRole("option", { name: "Has length" }).click()
    await page.getByPlaceholder("Enter value...").nth(1).fill("5")

    // Should show 5-letter words starting with Z
    await expect(page.getByRole("button", { name: "ZEBRA", exact: true })).toBeVisible()
  })

  test("expands word to show definition when tapped", async ({ page }) => {
    // Search for a specific word using has length + starts with
    await page.getByRole("combobox").first().click()
    await page.getByRole("option", { name: "Has length" }).click()
    await page.getByPlaceholder("Enter value...").first().fill("8")

    // Second criterion auto-added
    await page.getByRole("combobox").nth(1).click()
    await page.getByRole("option", { name: "Starts with" }).click()
    await page.getByPlaceholder("Enter value...").nth(1).fill("QUIXOTI")

    // Click the word
    await page.getByRole("button", { name: "QUIXOTIC", exact: true }).click()

    // Definition should be visible
    await expect(page.getByText(/extravagantly/i)).toBeVisible()
  })

  test("removes criterion when clicking X", async ({ page }) => {
    // Type to trigger auto-add of second criterion
    await page.getByPlaceholder("Enter value...").first().fill("TEST")
    await expect(page.getByPlaceholder("Enter value...")).toHaveCount(2)

    // Get all trash buttons (remove buttons)
    const removeButtons = page.locator('button:has(svg.lucide-trash-2)')

    // Click the first remove button
    await removeButtons.first().click()

    // Should have one fewer input
    await expect(page.getByPlaceholder("Enter value...")).toHaveCount(1)
  })

  test("does not contain filter works", async ({ page }) => {
    // First set has length to 2
    await page.getByRole("combobox").click()
    await page.getByRole("option", { name: "Has length" }).click()
    await page.getByPlaceholder("Enter value...").fill("2")

    // Second criterion auto-added, set to does not contain E
    await page.getByRole("combobox").nth(1).click()
    await page.getByRole("option", { name: "Does not contain" }).click()
    await page.getByPlaceholder("Enter value...").nth(1).fill("E")

    // 2-letter words without E should appear
    await expect(page.getByRole("button", { name: "AA", exact: true })).toBeVisible()
  })

  test("contains any of filter works", async ({ page }) => {
    await page.getByRole("combobox").click()
    await page.getByRole("option", { name: "Contains any of" }).click()

    await page.getByPlaceholder("Enter value...").fill("XZ")

    // Words with X or Z should appear
    await expect(page.getByText(/matches/)).toBeVisible()
  })

  test("contains all of filter works", async ({ page }) => {
    // Has length 8 + contains all of QUIXOTC
    await page.getByRole("combobox").click()
    await page.getByRole("option", { name: "Has length" }).click()
    await page.getByPlaceholder("Enter value...").fill("8")

    // Second criterion auto-added
    await page.getByRole("combobox").nth(1).click()
    await page.getByRole("option", { name: "Contains all of" }).click()
    await page.getByPlaceholder("Enter value...").nth(1).fill("QUIXOTC")

    // Words with all those letters should appear
    await expect(page.getByRole("button", { name: "QUIXOTIC", exact: true })).toBeVisible()
  })

  test("matches regex filter works", async ({ page }) => {
    // Has length 5 + matches regex ^Z.*A$
    await page.getByRole("combobox").click()
    await page.getByRole("option", { name: "Has length" }).click()
    await page.getByPlaceholder("Enter value...").fill("5")

    // Second criterion auto-added
    await page.getByRole("combobox").nth(1).click()
    await page.getByRole("option", { name: "Matches regex" }).click()
    await page.getByPlaceholder("Enter value...").nth(1).fill("^Z.*A$")

    // 5-letter words matching ^Z.*A$ should appear
    await expect(page.getByRole("button", { name: "ZEBRA", exact: true })).toBeVisible()
  })

  test("cannot delete the last criterion", async ({ page }) => {
    // Initially there's one criterion and no trash button should be visible
    const trashButtons = page.locator('button:has(svg.lucide-trash-2)')
    await expect(trashButtons).toHaveCount(0)

    // Type to trigger auto-add of second criterion
    await page.getByPlaceholder("Enter value...").first().fill("TEST")
    await expect(page.getByPlaceholder("Enter value...")).toHaveCount(2)

    // Now there should be one trash button (for the first criterion only)
    await expect(trashButtons).toHaveCount(1)

    // The last criterion should not have a trash button
    // Delete the first criterion
    await trashButtons.first().click()
    await expect(page.getByPlaceholder("Enter value...")).toHaveCount(1)

    // Now there should be no trash buttons again
    await expect(trashButtons).toHaveCount(0)
  })
})
