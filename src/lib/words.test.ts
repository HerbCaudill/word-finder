import { describe, it, expect } from 'vitest'
import { filterWords, sortWords } from './words'
import { FilterMode } from './filters'

describe('sortWords', () => {
  it('sorts by length descending, then alphabetically', () => {
    const words = [
      { word: 'CAT', definition: '' },
      { word: 'APPLE', definition: '' },
      { word: 'DOG', definition: '' },
      { word: 'ZEBRA', definition: '' },
    ]
    const sorted = sortWords(words)
    expect(sorted.map(w => w.word)).toEqual(['APPLE', 'ZEBRA', 'CAT', 'DOG'])
  })
})

describe('filterWords', () => {
  const words = [
    { word: 'APPLE', definition: 'a fruit' },
    { word: 'BANANA', definition: 'yellow fruit' },
    { word: 'CAT', definition: 'a pet' },
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
