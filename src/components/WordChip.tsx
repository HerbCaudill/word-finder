import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Word } from "@herbcaudill/scrabble-words"

export function WordChip({ word }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="hover:bg-muted active:bg-muted/80 rounded px-2 py-1 font-mono text-sm">
          {word.word}
        </button>
      </PopoverTrigger>
      <PopoverContent className="max-w-xs p-3 text-sm">
        {word.crossRef ? (
          <p className="text-muted-foreground italic">
            See {word.crossRef.word} ({word.crossRef.partOfSpeech})
          </p>
        ) : word.definitions.length > 0 ? (
          <ul className="space-y-2">
            {word.definitions.map((def, i) => (
              <li key={i}>
                <div>
                  {def.partOfSpeech && (
                    <span className="text-muted-foreground mr-1 italic">({def.partOfSpeech})</span>
                  )}
                  {def.note && <span className="text-muted-foreground mr-1">[{def.note}]</span>}
                  {def.text}
                </div>
                {def.forms && def.forms.length > 0 && (
                  <div className="text-muted-foreground mt-0.5 text-xs">
                    Forms: {def.forms.join(", ")}
                  </div>
                )}
                {def.alsoSpelled && def.alsoSpelled.length > 0 && (
                  <div className="text-muted-foreground mt-0.5 text-xs">
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
