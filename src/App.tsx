import { useEffect, useMemo, useState } from "react"
import { CriteriaList } from "@/components/CriteriaList"
import { ResultsList } from "@/components/ResultsList"
import type { Criterion, Word } from "@/lib/words"
import { filterWords, sortWords } from "@/lib/words"
import { FilterMode } from "@/lib/filters"
import wordsData from "@/data/words.json"

export function App() {
  const [words, setWords] = useState<Word[]>([])
  const [criteria, setCriteria] = useState<Criterion[]>([
    { mode: FilterMode.Contains, value: "" },
  ])

  useEffect(() => {
    setWords(sortWords(wordsData as Word[]))
  }, [])

  const filteredWords = useMemo(() => {
    return filterWords(words, criteria)
  }, [words, criteria])

  return (
    <div className="h-dvh flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10">
        <CriteriaList criteria={criteria} onChange={setCriteria} />
      </header>
      <ResultsList words={filteredWords} />
    </div>
  )
}
