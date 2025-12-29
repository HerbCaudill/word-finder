import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { FilterMode, FILTER_LABELS } from "@/lib/filters"
import type { Criterion } from "@/lib/words"

export function CriterionRow({ criterion, onChange, onRemove, canRemove }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={criterion.mode}
        onValueChange={(mode) => onChange({ ...criterion, mode: mode as FilterMode })}
      >
        <SelectTrigger className="w-40 shrink-0 bg-white text-foreground focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0 focus-visible:border-transparent">
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
        className="flex-1 min-w-0 bg-white text-foreground focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-0"
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
}
