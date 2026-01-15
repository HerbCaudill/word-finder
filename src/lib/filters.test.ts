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

  it("containsOnly - word can be made from provided letters", () => {
    expect(applyFilter("HELLO", FilterMode.ContainsOnly, "HELLO")).toBe(true)
    expect(applyFilter("HELL", FilterMode.ContainsOnly, "HELLO")).toBe(true)
    expect(applyFilter("HE", FilterMode.ContainsOnly, "HELLO")).toBe(true)
    expect(applyFilter("HELLOO", FilterMode.ContainsOnly, "HELLO")).toBe(false) // too many O's
    expect(applyFilter("HELLX", FilterMode.ContainsOnly, "HELLO")).toBe(false) // X not available
    expect(applyFilter("EEL", FilterMode.ContainsOnly, "HELLO")).toBe(false) // only one E available
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
