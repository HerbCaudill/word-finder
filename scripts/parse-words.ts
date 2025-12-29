import { readFileSync, writeFileSync } from "fs"

const input = readFileSync("scripts/CSW21.txt", "utf-8")
const lines = input.split("\n").filter((line) => line && !line.startsWith("#"))

const words = lines.map((line) => {
  const match = line.match(/^(\S+)\s+(.+)$/)
  if (!match) return null
  return { word: match[1], definition: match[2] }
}).filter(Boolean)

writeFileSync("src/data/words.json", JSON.stringify(words))
console.log(`Parsed ${words.length} words`)
