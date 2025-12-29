import type { Definition } from "./words"

export type ParseResult = {
  definitions: Definition[]
  crossRef?: string
}

export function parseDefinition(raw: string): ParseResult {
  // Check for cross-reference: <word=pos>
  const crossRefMatch = raw.match(/^<([^>]+)>\s*(.*)$/)
  if (crossRefMatch) {
    const crossRef = crossRefMatch[1]
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
    let forms: string | undefined

    if (posMatch) {
      const bracketContent = posMatch[1]
      const spaceIndex = bracketContent.indexOf(" ")
      if (spaceIndex > 0) {
        partOfSpeech = bracketContent.slice(0, spaceIndex)
        forms = bracketContent.slice(spaceIndex + 1)
      } else {
        partOfSpeech = bracketContent
      }
    }

    // Remove the [brackets] part and trim
    let text = part.replace(/\s*\[[^\]]+\]$/, "").trim()

    // Extract alternative spellings: ", also WORD1, WORD2"
    let alsoSpelled: string[] | undefined
    const alsoMatch = text.match(/,\s*also\s+([A-Z][A-Z, ]+)$/i)
    if (alsoMatch) {
      alsoSpelled = alsoMatch[1].split(/,\s*/).map(s => s.trim()).filter(Boolean)
      text = text.slice(0, alsoMatch.index).trim()
    }

    if (text) {
      const def: Definition = { text, partOfSpeech }
      if (forms) def.forms = forms
      if (alsoSpelled && alsoSpelled.length > 0) def.alsoSpelled = alsoSpelled
      definitions.push(def)
    }
  }

  return { definitions }
}
