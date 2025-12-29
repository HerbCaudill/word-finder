import { useEffect, useMemo, useState } from "react"
import { CriteriaList } from "@/components/CriteriaList"
import { ResultsList } from "@/components/ResultsList"
import type { Criterion, Word } from "@/lib/words"
import { filterWords, sortWords } from "@/lib/words"
import { FilterMode } from "@/lib/filters"
import wordsData from "@/data/words.json"

const DEBOUNCE_MS = 150

export function App() {
  const [words, setWords] = useState<Word[]>([])
  const [criteria, setCriteria] = useState<Criterion[]>([
    { mode: FilterMode.Contains, value: "" },
  ])
  const [debouncedCriteria, setDebouncedCriteria] = useState(criteria)

  useEffect(() => {
    setWords(sortWords(wordsData as Word[]))
  }, [])

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

  return (
    <div className="h-dvh flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 bg-green-600 text-white">
        <CriteriaList criteria={criteria} onChange={setCriteria} />
        <div className="px-4 py-2 text-sm text-white/70 font-semibold">
          {filteredWords.length.toLocaleString()} matches
        </div>
      </header>
      <ResultsList words={filteredWords} />
    </div>
  )
}
