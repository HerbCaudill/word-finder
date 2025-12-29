import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Word } from "@/lib/words"

export function WordChip({ word }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="font-mono text-sm px-2 py-1 rounded hover:bg-muted active:bg-muted/80">
          {word.word}
        </button>
      </PopoverTrigger>
      <PopoverContent className="max-w-xs text-sm p-3">
        <p>{word.definition}</p>
      </PopoverContent>
    </Popover>
  )
}

type Props = {
  word: Word
}
