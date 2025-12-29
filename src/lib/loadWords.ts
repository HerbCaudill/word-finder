import csw from "@herbcaudill/scrabble-words/csw21"
import type { Word } from "@herbcaudill/scrabble-words"
import { sortWords } from "./words"

export function loadWords(): Word[] {
  return sortWords(csw)
}
