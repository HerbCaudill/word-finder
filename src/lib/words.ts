import { applyFilter, FilterMode } from './filters'

export type Word = {
  word: string
  definitions: Definition[]
  crossRef?: CrossRef // reference to another word this is a form of
}

export type CrossRef = {
  word: string // the base word e.g. "AAH"
  partOfSpeech: string // e.g. "v"
}

export type Definition = {
  text: string
  partOfSpeech: string
  forms?: string[] // expanded forms e.g. ["CATS"] or ["JUMPED", "JUMPING", "JUMPS"]
  alsoSpelled?: string[] // alternative spellings
  note?: string // contextual note e.g. "Hawaiian", "obsolete", "colloquial"
}

export type Criterion = {
  mode: FilterMode
  value: string
}

export function sortWords(words: Word[]): Word[] {
  return [...words].sort((a, b) => {
    if (b.word.length !== a.word.length) {
      return b.word.length - a.word.length
    }
    return a.word.localeCompare(b.word)
  })
}

export function filterWords(words: Word[], criteria: Criterion[]): Word[] {
  if (criteria.length === 0) return words

  return words.filter(w => criteria.every(c => c.value === '' || applyFilter(w.word, c.mode, c.value)))
}
