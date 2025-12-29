import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { FilterMode, FILTER_LABELS } from "@/lib/filters"
import type { Criterion } from "@/lib/words"

export function CriterionRow({ criterion, onChange, onRemove }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={criterion.mode}
        onValueChange={(mode) => onChange({ ...criterion, mode: mode as FilterMode })}
      >
        <SelectTrigger className="w-[140px] shrink-0">
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
        value={criterion.value}
        onChange={(e) => onChange({ ...criterion, value: e.target.value })}
        placeholder="Enter value..."
        className="flex-1 min-w-0"
      />
      <Button variant="ghost" size="icon" onClick={onRemove} className="shrink-0">
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

type Props = {
  criterion: Criterion
  onChange: (criterion: Criterion) => void
  onRemove: () => void
}
