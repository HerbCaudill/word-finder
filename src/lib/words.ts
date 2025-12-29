import { applyFilter, FilterMode } from './filters'

export type Word = {
  word: string
  definition: string
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
