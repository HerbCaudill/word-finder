export const FilterMode = {
  Contains: "contains",
  StartsWith: "startsWith",
  EndsWith: "endsWith",
  DoesNotContain: "doesNotContain",
  ContainsAnyOf: "containsAnyOf",
  ContainsAllOf: "containsAllOf",
  ContainsNoneOf: "containsNoneOf",
  MatchesRegex: "matchesRegex",
  HasLength: "hasLength",
} as const

export type FilterMode = (typeof FilterMode)[keyof typeof FilterMode]

export const FILTER_LABELS: Record<FilterMode, string> = {
  [FilterMode.Contains]: "Contains",
  [FilterMode.StartsWith]: "Starts with",
  [FilterMode.EndsWith]: "Ends with",
  [FilterMode.DoesNotContain]: "Does not contain",
  [FilterMode.ContainsAnyOf]: "Contains any of",
  [FilterMode.ContainsAllOf]: "Contains all of",
  [FilterMode.ContainsNoneOf]: "Contains none of",
  [FilterMode.MatchesRegex]: "Matches regex",
  [FilterMode.HasLength]: "Has length",
}

export function applyFilter(
  word: string,
  mode: FilterMode,
  value: string
): boolean {
  const w = word.toUpperCase()
  const v = value.toUpperCase()

  switch (mode) {
    case FilterMode.Contains:
      return w.includes(v)
    case FilterMode.StartsWith:
      return w.startsWith(v)
    case FilterMode.EndsWith:
      return w.endsWith(v)
    case FilterMode.DoesNotContain:
      return !w.includes(v)
    case FilterMode.ContainsAnyOf:
      return [...v].some((char) => w.includes(char))
    case FilterMode.ContainsAllOf:
      return [...v].every((char) => w.includes(char))
    case FilterMode.ContainsNoneOf:
      return ![...v].some((char) => w.includes(char))
    case FilterMode.MatchesRegex:
      try {
        return new RegExp(value, "i").test(word)
      } catch {
        return false
      }
    case FilterMode.HasLength:
      return word.length === parseInt(value, 10)
    default:
      return true
  }
}
