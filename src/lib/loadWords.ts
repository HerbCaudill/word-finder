import type { Word } from "./words"
import { sortWords } from "./words"
import pako from "pako"

export async function loadWords(): Promise<Word[]> {
  const response = await fetch("/words.json.gz")
  const compressed = await response.arrayBuffer()
  const decompressed = pako.inflate(new Uint8Array(compressed), { to: "string" })
  const words = JSON.parse(decompressed) as Word[]
  return sortWords(words)
}
