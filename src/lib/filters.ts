export const filters = {
  contains: {
    label: "Contains",
    fn: (word: string, value: string): boolean => {
      try {
        return new RegExp(value, "i").test(word)
      } catch {
        return false
      }
    },
    skipNormalization: true,
    pattern: true,
  },
  startsWith: {
    label: "Starts with",
    fn: (word: string, value: string): boolean => {
      try {
        return new RegExp(`^(?:${value})`, "i").test(word)
      } catch {
        return false
      }
    },
    skipNormalization: true,
    pattern: true,
  },
  endsWith: {
    label: "Ends with",
    fn: (word: string, value: string): boolean => {
      try {
        return new RegExp(`(?:${value})$`, "i").test(word)
      } catch {
        return false
      }
    },
    skipNormalization: true,
    pattern: true,
  },
  doesNotContain: {
    label: "Does not contain",
    fn: (word: string, value: string): boolean => {
      try {
        return !new RegExp(value, "i").test(word)
      } catch {
        return false
      }
    },
    skipNormalization: true,
    pattern: true,
  },
  containsOnly: {
    label: "Contains only",
    fn: (word: string, value: string): boolean => {
      const allowed = new Set(value)
      return [...word].every(char => allowed.has(char))
    },
  },
  containsAllOf: {
    label: "Contains all of",
    fn: (word: string, value: string): boolean => [...value].every(char => word.includes(char)),
  },
  containsNoneOf: {
    label: "Contains none of",
    fn: (word: string, value: string): boolean => ![...value].some(char => word.includes(char)),
  },
  permutes: {
    label: "Permutes",
    fn: (word: string, value: string): boolean => {
      if (word.length > value.length) return false
      const available = [...value]
      for (const char of word) {
        let index = available.indexOf(char)
        if (index === -1) index = available.indexOf(".")
        if (index === -1) return false
        available.splice(index, 1)
      }
      return true
    },
  },
  hasLength: {
    label: "Has length",
    fn: (word: string, value: string): boolean => word.length === parseInt(value, 10),
    skipNormalization: true,
  },
} as const satisfies Record<
  string,
  {
    label: string
    fn: (word: string, value: string) => boolean
    skipNormalization?: boolean
    /** The value is a regex, so each span of whitespace separates alternatives. */
    pattern?: boolean
  }
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
  Permutes: "permutes",
  HasLength: "hasLength",
}

export const FILTER_LABELS: Record<FilterMode, string> = Object.fromEntries(
  Object.entries(filters).map(([key, { label }]) => [key, label]),
) as Record<FilterMode, string>

export function applyFilter(word: string, mode: FilterMode, value: string): boolean {
  const filter = filters[mode]
  const normalized =
    "pattern" in filter ? value.trim().replace(/\s+/g, "|") : value.replace(/\s/g, "")
  if ("skipNormalization" in filter && filter.skipNormalization) {
    return filter.fn(word, normalized)
  }
  return filter.fn(word.toUpperCase(), normalized.toUpperCase())
}
