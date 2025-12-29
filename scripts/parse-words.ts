import { readFileSync, writeFileSync, mkdirSync } from "fs"
import { parseDefinition } from "../src/lib/parseDefinition"
import type { Word } from "../src/lib/words"

// Ensure output directory exists
mkdirSync("src/data", { recursive: true })

const input = readFileSync("scripts/CSW21.txt", "utf-8")
const lines = input.split("\n").filter((line) => line && !line.startsWith("#"))

const words: Word[] = lines
  .map((line) => {
    const match = line.match(/^(\S+)\s+(.+)$/)
    if (!match) return null

    const word = match[1]
    const rawDef = match[2]
    const { definitions, crossRef } = parseDefinition(rawDef)

    const result: Word = { word, definitions }
    if (crossRef) result.crossRef = crossRef
    return result
  })
  .filter((w): w is Word => w !== null)

writeFileSync("src/data/words.json", JSON.stringify(words))
console.log(`Parsed ${words.length} words`)
