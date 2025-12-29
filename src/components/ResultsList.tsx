import { useEffect, useRef, useState } from "react"
import type { Word } from "@/lib/words"
import { WordChip } from "./WordChip"

const PAGE_SIZE = 100

export function ResultsList({ words }: Props) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const containerRef = useRef<HTMLDivElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [words])

  useEffect(() => {
    const container = containerRef.current
    const loader = loaderRef.current
    if (!container || !loader) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < words.length) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, words.length))
        }
      },
      { root: container, rootMargin: "0px 0px 500px 0px", threshold: 0 }
    )

    observer.observe(loader)

    return () => observer.disconnect()
  }, [visibleCount, words.length])

  const visibleWords = words.slice(0, visibleCount)

  return (
    <div ref={containerRef} className="h-full overflow-y-auto">
      <div className="p-3 flex flex-wrap gap-1">
        {visibleWords.map((word, index) => (
          <WordChip key={`${word.word}-${index}`} word={word} />
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
