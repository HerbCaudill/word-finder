import { useEffect, useRef } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { FilterMode, FILTER_LABELS } from "@/lib/filters"
import type { Criterion } from "@/lib/words"

export function CriterionRow({ criterion, onChange, onRemove, canRemove, shouldFocus }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (shouldFocus !== undefined) {
      inputRef.current?.focus()
    }
  }, [shouldFocus])

  return (
    <div className="flex items-center gap-2">
      <Select
        value={criterion.mode}
        onValueChange={(mode) => {
          onChange({ ...criterion, mode: mode as FilterMode })
          inputRef.current?.focus()
        }}
      >
        <SelectTrigger className="w-40 shrink-0 bg-white text-foreground border-transparent focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0 focus-visible:border-transparent">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.values(FilterMode).map((mode) => (
            <SelectItem key={mode} value={mode}>
              {FILTER_LABELS[mode]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        ref={inputRef}
        value={criterion.value}
        onChange={(e) => onChange({ ...criterion, value: e.target.value })}
        onFocus={(e) => e.target.select()}
        placeholder="Enter value..."
        className="flex-1 min-w-0 bg-white text-foreground border-transparent focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0"
      />
      {canRemove ? (
        <Button variant="ghost" size="icon" onClick={onRemove} className="shrink-0 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0">
          <Trash2 className="h-4 w-4" />
        </Button>
      ) : (
        <div className="w-9 shrink-0" />
      )}
    </div>
  )
}

type Props = {
  criterion: Criterion
  onChange: (criterion: Criterion) => void
  onRemove: () => void
  canRemove: boolean
  shouldFocus?: number
}
