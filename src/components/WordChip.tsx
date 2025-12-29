import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { Word } from "@/lib/words"

export function WordChip({ word }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="font-mono text-sm px-2 py-1 rounded hover:bg-muted active:bg-muted/80">
          {word.word}
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>{word.definition}</p>
      </TooltipContent>
    </Tooltip>
  )
}

type Props = {
  word: Word
}
