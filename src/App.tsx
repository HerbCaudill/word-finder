import { useEffect, useMemo, useState } from "react"
import { CriteriaList } from "@/components/CriteriaList"
import { ResultsList } from "@/components/ResultsList"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import type { Criterion, Word } from "@/lib/words"
import { filterWords } from "@/lib/words"
import { FilterMode } from "@/lib/filters"
import { loadWords } from "@/lib/loadWords"

const DEBOUNCE_MS = 150
const STORAGE_KEY = "word-finder-criteria"

const DEFAULT_CRITERIA: Criterion[] = [{ mode: FilterMode.Contains, value: "" }]

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

export function App() {
  const [words, setWords] = useState<Word[]>([])
  const [criteria, setCriteria] = useState<Criterion[]>(loadCriteria)
  const [debouncedCriteria, setDebouncedCriteria] = useState(criteria)

  useEffect(() => {
    loadWords().then(setWords)
  }, [])

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
    <div className="h-dvh flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 bg-green-600 text-white pt-[env(safe-area-inset-top)]">
        <div className="max-w-3xl mx-auto">
          <CriteriaList criteria={criteria} onChange={setCriteria} />
          <div className="px-4 py-2 text-sm text-white/70 font-semibold flex items-center justify-between">
            <span>{filteredWords.length.toLocaleString()} matches</span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCriteria(DEFAULT_CRITERIA)}
                className="h-6 px-2 text-xs text-white/70 hover:text-white hover:bg-white/10 border border-white/30 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </header>
      <div className="max-w-3xl mx-auto w-full flex-1 overflow-hidden">
        <ResultsList words={filteredWords} />
      </div>
    </div>
  )
}
