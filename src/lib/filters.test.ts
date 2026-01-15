import { describe, it, expect } from "vitest"
import { applyFilter, FilterMode } from "./filters"

describe("applyFilter", () => {
  it("contains - matches substring", () => {
    expect(applyFilter("HELLO", FilterMode.Contains, "ELL")).toBe(true)
    expect(applyFilter("HELLO", FilterMode.Contains, "XYZ")).toBe(false)
  })

  it("startsWith - matches prefix", () => {
    expect(applyFilter("HELLO", FilterMode.StartsWith, "HE")).toBe(true)
    expect(applyFilter("HELLO", FilterMode.StartsWith, "LO")).toBe(false)
  })

  it("endsWith - matches suffix", () => {
    expect(applyFilter("HELLO", FilterMode.EndsWith, "LO")).toBe(true)
    expect(applyFilter("HELLO", FilterMode.EndsWith, "HE")).toBe(false)
  })

  it("doesNotContain - excludes substring", () => {
    expect(applyFilter("HELLO", FilterMode.DoesNotContain, "XYZ")).toBe(true)
    expect(applyFilter("HELLO", FilterMode.DoesNotContain, "ELL")).toBe(false)
  })

  it("containsOnly - word uses only allowed letters (with repetition)", () => {
    expect(applyFilter("HELLO", FilterMode.ContainsOnly, "HELO")).toBe(true)
    expect(applyFilter("HELL", FilterMode.ContainsOnly, "HELO")).toBe(true)
    expect(applyFilter("HELLOO", FilterMode.ContainsOnly, "HELO")).toBe(true) // repetition allowed
    expect(applyFilter("EEL", FilterMode.ContainsOnly, "HELO")).toBe(true) // repetition allowed
    expect(applyFilter("HELLX", FilterMode.ContainsOnly, "HELO")).toBe(false) // X not in allowed set
    expect(applyFilter("WORLD", FilterMode.ContainsOnly, "HELO")).toBe(false) // W, R, D not allowed
  })

  it("containsAllOf - all letters present", () => {
    expect(applyFilter("HELLO", FilterMode.ContainsAllOf, "HEL")).toBe(true)
    expect(applyFilter("HELLO", FilterMode.ContainsAllOf, "HEX")).toBe(false)
  })

  it("containsNoneOf - no letters present", () => {
    expect(applyFilter("HELLO", FilterMode.ContainsNoneOf, "XYZ")).toBe(true)
    expect(applyFilter("HELLO", FilterMode.ContainsNoneOf, "AEI")).toBe(false)
  })

  it("matchesRegex - regex pattern matches", () => {
    expect(applyFilter("HELLO", FilterMode.MatchesRegex, "^H.*O$")).toBe(true)
    expect(applyFilter("HELLO", FilterMode.MatchesRegex, "^X")).toBe(false)
  })

  it("hasLength - exact length match", () => {
    expect(applyFilter("HELLO", FilterMode.HasLength, "5")).toBe(true)
    expect(applyFilter("HELLO", FilterMode.HasLength, "4")).toBe(false)
  })

  it("handles case insensitivity", () => {
    expect(applyFilter("HELLO", FilterMode.Contains, "ell")).toBe(true)
  })
})
