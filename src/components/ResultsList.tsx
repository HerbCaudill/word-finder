import { useEffect, useRef, useState } from "react"
import type { Word } from "@/lib/words"
import { WordRow } from "./WordRow"

const PAGE_SIZE = 50

export function ResultsList({ words }: Props) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [words])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < words.length) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, words.length))
        }
      },
      { threshold: 0.1 }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [visibleCount, words.length])

  const visibleWords = words.slice(0, visibleCount)

  return (
    <div className="flex-1 overflow-y-auto">
      <div>
        {visibleWords.map((word, index) => (
          <WordRow key={`${word.word}-${index}`} word={word} />
        ))}
      </div>
      {visibleCount < words.length && (
        <div ref={loaderRef} className="px-4 py-3 text-center text-muted-foreground text-sm">
          Loading more...
        </div>
      )}
    </div>
  )
}

type Props = {
  words: Word[]
}
