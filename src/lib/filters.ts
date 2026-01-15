const normalize = (word: string, value: string) => ({
  w: word.toUpperCase(),
  v: value.toUpperCase(),
})

export const filters = {
  contains: {
    label: "Contains",
    fn: (word: string, value: string): boolean => {
      const { w, v } = normalize(word, value)
      return w.includes(v)
    },
  },
  startsWith: {
    label: "Starts with",
    fn: (word: string, value: string): boolean => {
      const { w, v } = normalize(word, value)
      return w.startsWith(v)
    },
  },
  endsWith: {
    label: "Ends with",
    fn: (word: string, value: string): boolean => {
      const { w, v } = normalize(word, value)
      return w.endsWith(v)
    },
  },
  doesNotContain: {
    label: "Does not contain",
    fn: (word: string, value: string): boolean => {
      const { w, v } = normalize(word, value)
      return !w.includes(v)
    },
  },
  containsOnly: {
    label: "Contains only",
    fn: (word: string, value: string): boolean => {
      const { w, v } = normalize(word, value)
      const allowed = new Set(v)
      return [...w].every((char) => allowed.has(char))
    },
  },
  containsAllOf: {
    label: "Contains all of",
    fn: (word: string, value: string): boolean => {
      const { w, v } = normalize(word, value)
      return [...v].every((char) => w.includes(char))
    },
  },
  containsNoneOf: {
    label: "Contains none of",
    fn: (word: string, value: string): boolean => {
      const { w, v } = normalize(word, value)
      return ![...v].some((char) => w.includes(char))
    },
  },
  matchesRegex: {
    label: "Matches regex",
    fn: (word: string, value: string): boolean => {
      try {
        return new RegExp(value, "i").test(word)
      } catch {
        return false
      }
    },
  },
  hasLength: {
    label: "Has length",
    fn: (word: string, value: string): boolean => {
      return word.length === parseInt(value, 10)
    },
  },
} as const satisfies Record<string, { label: string; fn: (word: string, value: string) => boolean }>

export type FilterMode = keyof typeof filters

export const FilterMode: { [K in FilterMode as Capitalize<K>]: K } = {
  Contains: "contains",
  StartsWith: "startsWith",
  EndsWith: "endsWith",
  DoesNotContain: "doesNotContain",
  ContainsOnly: "containsOnly",
  ContainsAllOf: "containsAllOf",
  ContainsNoneOf: "containsNoneOf",
  MatchesRegex: "matchesRegex",
  HasLength: "hasLength",
}

export const FILTER_LABELS: Record<FilterMode, string> = Object.fromEntries(
  Object.entries(filters).map(([key, { label }]) => [key, label])
) as Record<FilterMode, string>

export function applyFilter(
  word: string,
  mode: FilterMode,
  value: string
): boolean {
  return filters[mode].fn(word, value)
}
