import type { CrossRef, Definition } from "./words"

export type ParseResult = {
  definitions: Definition[]
  crossRef?: CrossRef
}

export function parseDefinition(raw: string, baseWord: string): ParseResult {
  // Check for cross-reference: <word=pos> e.g. <aah=v>
  const crossRefMatch = raw.match(/^<([^=]+)=([^>]+)>\s*(.*)$/)
  if (crossRefMatch) {
    const crossRef: CrossRef = {
      word: crossRefMatch[1].toUpperCase(),
      partOfSpeech: crossRefMatch[2],
    }
    return {
      definitions: [],
      crossRef,
    }
  }

  // Split by forward slashes for multiple definitions
  const parts = raw.split(" / ")
  const definitions: Definition[] = []

  for (const part of parts) {
    // Extract part of speech and forms from [brackets] at the end
    // Format: [pos forms] e.g. [n -S] or [v -ED, -ING, -S] or [interj]
    const posMatch = part.match(/\[([^\]]+)\]$/)
    let partOfSpeech = ""
    let rawForms: string | undefined

    if (posMatch) {
      const bracketContent = posMatch[1]
      const spaceIndex = bracketContent.indexOf(" ")
      if (spaceIndex > 0) {
        partOfSpeech = bracketContent.slice(0, spaceIndex)
        rawForms = bracketContent.slice(spaceIndex + 1)
      } else {
        partOfSpeech = bracketContent
      }
    }

    // Remove the [brackets] part and trim
    let text = part.replace(/\s*\[[^\]]+\]$/, "").trim()

    // Extract origin from parentheses at the start: (Hawaiian) a volcanic rock
    let origin: string | undefined
    const originMatch = text.match(/^\(([^)]+)\)\s*/)
    if (originMatch) {
      origin = originMatch[1]
      text = text.slice(originMatch[0].length)
    }

    // Extract alternative spellings: ", also WORD1, WORD2"
    let alsoSpelled: string[] | undefined
    const alsoMatch = text.match(/,\s*also\s+([A-Z][A-Z, ]+)$/i)
    if (alsoMatch) {
      alsoSpelled = alsoMatch[1].split(/,\s*/).map(s => s.trim()).filter(Boolean)
      text = text.slice(0, alsoMatch.index).trim()
    }

    // Expand forms to full words
    const forms = rawForms ? expandForms(baseWord, rawForms) : undefined

    if (text) {
      const def: Definition = { text, partOfSpeech }
      if (forms && forms.length > 0) def.forms = forms
      if (alsoSpelled && alsoSpelled.length > 0) def.alsoSpelled = alsoSpelled
      if (origin) def.origin = origin
      definitions.push(def)
    }
  }

  return { definitions }
}

function expandForms(baseWord: string, rawForms: string): string[] {
  const formParts = rawForms.split(/,\s*/)
  return formParts.map(form => {
    form = form.trim()
    if (form.startsWith("-")) {
      // Suffix like -S, -ED, -ING, -ES
      const suffix = form.slice(1)
      return applySuffix(baseWord, suffix)
    } else {
      // Already a full word like AARDWOLVES or RAN
      return form
    }
  })
}

function applySuffix(baseWord: string, suffix: string): string {
  // Handle common suffix rules
  const word = baseWord.toUpperCase()
  const sfx = suffix.toUpperCase()

  // For -S suffix, check if word needs -ES
  if (sfx === "S") {
    const lastChar = word.slice(-1)
    const lastTwo = word.slice(-2)
    // Words ending in S, X, Z, CH, SH need -ES
    if (["S", "X", "Z"].includes(lastChar) || ["CH", "SH"].includes(lastTwo)) {
      return word + "ES"
    }
    return word + "S"
  }

  // For -ED suffix
  if (sfx === "ED") {
    const lastChar = word.slice(-1)
    if (lastChar === "E") {
      return word + "D"
    }
    // Check for consonant doubling (simplified)
    return word + "ED"
  }

  // For -ING suffix
  if (sfx === "ING") {
    const lastChar = word.slice(-1)
    if (lastChar === "E") {
      return word.slice(0, -1) + "ING"
    }
    return word + "ING"
  }

  // For -ER suffix
  if (sfx === "ER") {
    const lastChar = word.slice(-1)
    if (lastChar === "E") {
      return word + "R"
    }
    return word + "ER"
  }

  // Default: just append the suffix
  return word + sfx
}
