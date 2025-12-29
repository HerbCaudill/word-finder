import type { Word } from "./words"
import { sortWords } from "./words"

export async function loadWords(): Promise<Word[]> {
  const response = await fetch("/words.json")
  const words = await response.json() as Word[]
  return sortWords(words)
}
