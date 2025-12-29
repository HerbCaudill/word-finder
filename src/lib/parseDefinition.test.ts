import { describe, it, expect } from "vitest"
import { parseDefinition } from "./parseDefinition"

describe("parseDefinition", () => {
  it("parses a simple noun definition", () => {
    const result = parseDefinition("a volcanic rock [n -S]")
    expect(result.definitions).toHaveLength(1)
    expect(result.definitions[0]).toEqual({
      text: "a volcanic rock",
      partOfSpeech: "n",
      forms: "-S",
    })
  })

  it("parses an interjection without forms", () => {
    const result = parseDefinition("an exclamation indicating dismay [interj]")
    expect(result.definitions).toHaveLength(1)
    expect(result.definitions[0]).toEqual({
      text: "an exclamation indicating dismay",
      partOfSpeech: "interj",
    })
  })

  it("parses multiple definitions separated by forward slash", () => {
    const result = parseDefinition("an interjection expressing surprise [interj] / to exclaim in surprise [v -ED, -ING, -S]")
    expect(result.definitions).toHaveLength(2)
    expect(result.definitions[0]).toEqual({
      text: "an interjection expressing surprise",
      partOfSpeech: "interj",
    })
    expect(result.definitions[1]).toEqual({
      text: "to exclaim in surprise",
      partOfSpeech: "v",
      forms: "-ED, -ING, -S",
    })
  })

  it("parses cross-references", () => {
    const result = parseDefinition("<aah=v> [v]")
    expect(result.definitions).toHaveLength(0)
    expect(result.crossRef).toBe("aah=v")
  })

  it("parses alternative spellings with single word", () => {
    const result = parseDefinition("a Philippine plant, also ABAKA [n -S]")
    expect(result.definitions).toHaveLength(1)
    expect(result.definitions[0]).toEqual({
      text: "a Philippine plant",
      partOfSpeech: "n",
      forms: "-S",
      alsoSpelled: ["ABAKA"],
    })
  })

  it("parses alternative spellings with multiple words", () => {
    const result = parseDefinition("an exclamation indicating dismay, also AARRGH, AARRGHH, ARGH [interj]")
    expect(result.definitions).toHaveLength(1)
    expect(result.definitions[0]).toEqual({
      text: "an exclamation indicating dismay",
      partOfSpeech: "interj",
      alsoSpelled: ["AARRGH", "AARRGHH", "ARGH"],
    })
  })

  it("parses definitions with parenthetical language notes", () => {
    const result = parseDefinition("(Hawaiian) a volcanic rock [n -S]")
    expect(result.definitions).toHaveLength(1)
    expect(result.definitions[0].text).toBe("(Hawaiian) a volcanic rock")
  })

  it("parses verb forms with multiple inflections", () => {
    const result = parseDefinition("to run quickly [v RAN, RUNNING, RUNS]")
    expect(result.definitions).toHaveLength(1)
    expect(result.definitions[0]).toEqual({
      text: "to run quickly",
      partOfSpeech: "v",
      forms: "RAN, RUNNING, RUNS",
    })
  })

  it("handles irregular plural forms", () => {
    const result = parseDefinition("a hyena-like African mammal [n AARDWOLVES]")
    expect(result.definitions).toHaveLength(1)
    expect(result.definitions[0]).toEqual({
      text: "a hyena-like African mammal",
      partOfSpeech: "n",
      forms: "AARDWOLVES",
    })
  })
})
