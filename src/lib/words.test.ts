import { describe, it, expect } from 'vitest'
import { filterWords, sortWords } from './words'
import { FilterMode } from './filters'

describe('sortWords', () => {
  it('sorts by length descending, then alphabetically', () => {
    const words = [
      { word: 'CAT', definitions: [] },
      { word: 'APPLE', definitions: [] },
      { word: 'DOG', definitions: [] },
      { word: 'ZEBRA', definitions: [] },
    ]
    const sorted = sortWords(words)
    expect(sorted.map(w => w.word)).toEqual(['APPLE', 'ZEBRA', 'CAT', 'DOG'])
  })
})

describe('filterWords', () => {
  const words = [
    { word: 'APPLE', definitions: [{ text: 'a fruit', partOfSpeech: 'n' }] },
    { word: 'BANANA', definitions: [{ text: 'yellow fruit', partOfSpeech: 'n' }] },
    { word: 'CAT', definitions: [{ text: 'a pet', partOfSpeech: 'n' }] },
  ]

  it('filters with single criterion', () => {
    const criteria = [{ mode: FilterMode.StartsWith, value: 'A' }]
    const result = filterWords(words, criteria)
    expect(result.map(w => w.word)).toEqual(['APPLE'])
  })

  it('filters with multiple criteria (AND)', () => {
    const criteria = [
      { mode: FilterMode.ContainsAllOf, value: 'AN' },
      { mode: FilterMode.HasLength, value: '6' },
    ]
    const result = filterWords(words, criteria)
    expect(result.map(w => w.word)).toEqual(['BANANA'])
  })

  it('returns all words when no criteria', () => {
    const result = filterWords(words, [])
    expect(result).toHaveLength(3)
  })
})
