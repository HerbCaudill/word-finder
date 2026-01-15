export const filters = {
  contains: {
    label: "Contains",
    fn: (word: string, value: string): boolean => word.includes(value),
  },
  startsWith: {
    label: "Starts with",
    fn: (word: string, value: string): boolean => word.startsWith(value),
  },
  endsWith: {
    label: "Ends with",
    fn: (word: string, value: string): boolean => word.endsWith(value),
  },
  doesNotContain: {
    label: "Does not contain",
    fn: (word: string, value: string): boolean => !word.includes(value),
  },
  containsOnly: {
    label: "Contains only",
    fn: (word: string, value: string): boolean => {
      const allowed = new Set(value)
      return [...word].every((char) => allowed.has(char))
    },
  },
  containsAllOf: {
    label: "Contains all of",
    fn: (word: string, value: string): boolean =>
      [...value].every((char) => word.includes(char)),
  },
  containsNoneOf: {
    label: "Contains none of",
    fn: (word: string, value: string): boolean =>
      ![...value].some((char) => word.includes(char)),
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
    skipNormalization: true,
  },
  hasLength: {
    label: "Has length",
    fn: (word: string, value: string): boolean =>
      word.length === parseInt(value, 10),
    skipNormalization: true,
  },
} as const satisfies Record<
  string,
  { label: string; fn: (word: string, value: string) => boolean; skipNormalization?: boolean }
>

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
  const filter = filters[mode]
  if ("skipNormalization" in filter && filter.skipNormalization) {
    return filter.fn(word, value)
  }
  return filter.fn(word.toUpperCase(), value.toUpperCase())
}
