import csw from "@herbcaudill/scrabble-words/csw21"
import nwl from "@herbcaudill/scrabble-words/nwl2018"
import type { Word } from "@herbcaudill/scrabble-words"
import { sortWords } from "./words"

/** Load and sort words for the given dictionary. */
export function loadWords(dictionary: Dictionary): Word[] {
  return sortWords(dictionary === "csw21" ? csw : nwl)
}

export type Dictionary = "csw21" | "nwl2018"

export const DICTIONARY_LABELS: Record<Dictionary, string> = {
  csw21: "Collins (CSW21)",
  nwl2018: "NASPA (NWL2018)",
}
