import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { Word } from "@/lib/words"

export function WordRow({ word }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="w-full text-left px-4 py-3 min-h-11 hover:bg-muted/50 active:bg-muted border-b border-border">
        <span className="font-mono font-medium">{word.word}</span>
        <span className="ml-2 text-muted-foreground text-sm">({word.word.length})</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 py-3 bg-muted/30 border-b border-border">
        <p className="text-sm text-muted-foreground">{word.definition}</p>
      </CollapsibleContent>
    </Collapsible>
  )
}

type Props = {
  word: Word
}
