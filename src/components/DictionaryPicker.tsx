import { useState } from "react"
import { Check, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DICTIONARY_LABELS, type Dictionary } from "@/lib/loadWords"

/** Settings popover for choosing the active dictionary. */
export function DictionaryPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0"
        >
          <Settings className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="end">
        {(Object.entries(DICTIONARY_LABELS) as [Dictionary, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => {
              onChange(key)
              setOpen(false)
            }}
            className={`w-full text-left text-sm px-3 py-1.5 rounded hover:bg-muted flex items-center gap-2 ${
              value === key ? "font-semibold" : ""
            }`}
          >
            <Check className={`h-3.5 w-3.5 shrink-0 ${value === key ? "opacity-100" : "opacity-0"}`} />
            {label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}

type Props = {
  value: Dictionary
  onChange: (dictionary: Dictionary) => void
}
