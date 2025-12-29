import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { Word } from "@/lib/words"

export function WordRow({ word }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="w-full text-left px-4 pt-1 hover:bg-muted/50 active:bg-muted">
        <span className="font-mono font-medium">{word.word}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-2 -mt-1">
        <p className="text-sm text-muted-foreground">{word.definition}</p>
      </CollapsibleContent>
    </Collapsible>
  )
}

type Props = {
  word: Word
}
