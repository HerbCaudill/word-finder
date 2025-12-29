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
        {word.crossRef ? (
          <p className="text-muted-foreground italic">See {word.crossRef.split("=")[0].toUpperCase()}</p>
        ) : word.definitions.length > 0 ? (
          <ul className="space-y-2">
            {word.definitions.map((def, i) => (
              <li key={i}>
                <div>
                  {def.partOfSpeech && (
                    <span className="text-muted-foreground italic mr-1">({def.partOfSpeech})</span>
                  )}
                  {def.text}
                </div>
                {def.alsoSpelled && def.alsoSpelled.length > 0 && (
                  <div className="text-muted-foreground text-xs mt-0.5">
                    Also: {def.alsoSpelled.join(", ")}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground italic">No definition</p>
        )}
      </PopoverContent>
    </Popover>
  )
}

type Props = {
  word: Word
}
