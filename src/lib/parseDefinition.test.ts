import { describe, it, expect } from "vitest"
import { parseDefinition } from "./parseDefinition"

describe("parseDefinition", () => {
  it("parses a simple noun with note and plural", () => {
    // AA (Hawaiian) a volcanic rock consisting of angular blocks of lava with a very rough surface [n -S]
    const result = parseDefinition("(Hawaiian) a volcanic rock consisting of angular blocks of lava with a very rough surface [n -S]", "AA")
    expect(result.definitions).toHaveLength(1)
    expect(result.definitions[0]).toEqual({
      text: "a volcanic rock consisting of angular blocks of lava with a very rough surface",
      partOfSpeech: "n",
      forms: ["AAS"],
      note: "Hawaiian",
    })
  })

  it("parses multiple definitions separated by forward slash", () => {
    // AAH an interjection expressing surprise [interj] / to exclaim in surprise [v -ED, -ING, -S]
    const result = parseDefinition("an interjection expressing surprise [interj] / to exclaim in surprise [v -ED, -ING, -S]", "AAH")
    expect(result.definitions).toHaveLength(2)
    expect(result.definitions[0]).toEqual({
      text: "an interjection expressing surprise",
      partOfSpeech: "interj",
    })
    expect(result.definitions[1]).toEqual({
      text: "to exclaim in surprise",
      partOfSpeech: "v",
      forms: ["AAHED", "AAHING", "AAHS"],
    })
  })

  it("parses cross-references", () => {
    // AAHED <aah=v> [v]
    const result = parseDefinition("<aah=v> [v]", "AAHED")
    expect(result.definitions).toHaveLength(0)
    expect(result.crossRef).toEqual({ word: "AAH", partOfSpeech: "v" })
  })

  it("parses alternative spellings with single word", () => {
    // ABACA (Tagalog) a Philippine plant, also ABAKA [n -S]
    const result = parseDefinition("(Tagalog) a Philippine plant, also ABAKA [n -S]", "ABACA")
    expect(result.definitions).toHaveLength(1)
    expect(result.definitions[0]).toEqual({
      text: "a Philippine plant",
      partOfSpeech: "n",
      forms: ["ABACAS"],
      alsoSpelled: ["ABAKA"],
      note: "Tagalog",
    })
  })

  it("parses alternative spellings with multiple words", () => {
    // AARGH an exclamation indicating dismay, also AARRGH, AARRGHH, ARGH [interj]
    const result = parseDefinition("an exclamation indicating dismay, also AARRGH, AARRGHH, ARGH [interj]", "AARGH")
    expect(result.definitions).toHaveLength(1)
    expect(result.definitions[0]).toEqual({
      text: "an exclamation indicating dismay",
      partOfSpeech: "interj",
      alsoSpelled: ["AARRGH", "AARRGHH", "ARGH"],
    })
  })

  it("handles irregular plural forms", () => {
    // AARDWOLF (South African) a hyena-like African mammal, aka earthwolf [n AARDWOLVES]
    const result = parseDefinition("(South African) a hyena-like African mammal, aka earthwolf [n AARDWOLVES]", "AARDWOLF")
    expect(result.definitions).toHaveLength(1)
    expect(result.definitions[0]).toEqual({
      text: "a hyena-like African mammal, aka earthwolf",
      partOfSpeech: "n",
      forms: ["AARDWOLVES"],
      note: "South African",
    })
  })

  it("handles verb with full form list", () => {
    // ABASE to lower in rank, prestige, or esteem [v ABASED, ABASING, ABASES]
    const result = parseDefinition("to lower in rank, prestige, or esteem [v ABASED, ABASING, ABASES]", "ABASE")
    expect(result.definitions).toHaveLength(1)
    expect(result.definitions[0]).toEqual({
      text: "to lower in rank, prestige, or esteem",
      partOfSpeech: "v",
      forms: ["ABASED", "ABASING", "ABASES"],
    })
  })

  it("handles adverb without forms", () => {
    // ABACK towards the back [adv]
    const result = parseDefinition("towards the back [adv]", "ABACK")
    expect(result.definitions).toHaveLength(1)
    expect(result.definitions[0]).toEqual({
      text: "towards the back",
      partOfSpeech: "adv",
    })
  })

  it("handles adjective without forms", () => {
    // ABACTERIAL not caused by or characterised by the presence of bacteria [adj]
    const result = parseDefinition("not caused by or characterised by the presence of bacteria [adj]", "ABACTERIAL")
    expect(result.definitions).toHaveLength(1)
    expect(result.definitions[0]).toEqual({
      text: "not caused by or characterised by the presence of bacteria",
      partOfSpeech: "adj",
    })
  })

  it("handles noun with multiple plural options", () => {
    // ABACUS (Latin) a counting frame using beads [n ABACUSES or ABACI]
    const result = parseDefinition("(Latin) a counting frame using beads [n ABACUSES or ABACI]", "ABACUS")
    expect(result.definitions).toHaveLength(1)
    expect(result.definitions[0]).toEqual({
      text: "a counting frame using beads",
      partOfSpeech: "n",
      forms: ["ABACUSES or ABACI"],
      note: "Latin",
    })
  })

  it("expands -S suffix correctly", () => {
    // AAL (Hindi) the Indian mulberry tree, aka noni, also AL [n -S]
    const result = parseDefinition("(Hindi) the Indian mulberry tree, aka noni, also AL [n -S]", "AAL")
    expect(result.definitions[0].forms).toEqual(["AALS"])
  })

  it("expands -ES suffix for words ending in SH", () => {
    // ABASH to strike with shame [v -ED, -ING, -ES]
    const result = parseDefinition("to strike with shame [v -ED, -ING, -ES]", "ABASH")
    expect(result.definitions[0].forms).toEqual(["ABASHED", "ABASHING", "ABASHES"])
  })
})
