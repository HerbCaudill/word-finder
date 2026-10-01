import { useEffect, useMemo, useState } from "react"
import { CriteriaList } from "@/components/CriteriaList"
import { DictionaryPicker } from "@/components/DictionaryPicker"
import { ResultsList } from "@/components/ResultsList"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import type { Criterion } from "@/lib/words"
import { filterWords } from "@/lib/words"
import { FilterMode } from "@/lib/filters"
import { loadWords, type Dictionary } from "@/lib/loadWords"

const DEBOUNCE_MS = 150
const STORAGE_KEY = "word-finder-criteria"
const DICTIONARY_KEY = "word-finder-dictionary"

const DEFAULT_CRITERIA: Criterion[] = [{ mode: FilterMode.Contains, value: "" }]

/** Load persisted criteria from localStorage. */
function loadCriteria(): Criterion[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_CRITERIA
}

/** Load persisted dictionary choice from localStorage. */
function loadDictionary(): Dictionary {
  const stored = localStorage.getItem(DICTIONARY_KEY)
  if (stored === "csw21" || stored === "nwl2018") return stored
  return "csw21"
}

export function App() {
  const [dictionary, setDictionary] = useState<Dictionary>(loadDictionary)
  const words = useMemo(() => loadWords(dictionary), [dictionary])
  const [criteria, setCriteria] = useState<Criterion[]>(loadCriteria)
  const [debouncedCriteria, setDebouncedCriteria] = useState(criteria)

  // Persist dictionary choice to localStorage
  useEffect(() => {
    localStorage.setItem(DICTIONARY_KEY, dictionary)
  }, [dictionary])

  // Persist criteria to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(criteria))
  }, [criteria])

  // Debounce criteria changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCriteria(criteria)
    }, DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [criteria])

  const filteredWords = useMemo(() => {
    return filterWords(words, debouncedCriteria)
  }, [words, debouncedCriteria])

  const hasActiveFilters = criteria.some(c => c.value.trim() !== "")

  return (
    <div className="bg-background text-foreground fixed inset-0 flex flex-col">
      <header className="shrink-0 bg-green-600 pt-[env(safe-area-inset-top,0px)] text-white">
        <div className="mx-auto max-w-3xl">
          <CriteriaList criteria={criteria} onChange={setCriteria} />
          <div className="flex items-center justify-between px-4 py-2 text-sm font-semibold text-white/70">
            <span>{filteredWords.length.toLocaleString()} matches</span>
            <div className="flex items-center gap-1">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCriteria(DEFAULT_CRITERIA)}
                  className="h-6 border border-white/30 px-2 text-xs text-white/70 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0"
                >
                  <RotateCcw className="mr-1 h-3 w-3" />
                  Reset
                </Button>
              )}
              <DictionaryPicker value={dictionary} onChange={setDictionary} />
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto min-h-0 w-full max-w-3xl flex-1">
        <ResultsList words={filteredWords} />
      </div>
    </div>
  )
}
