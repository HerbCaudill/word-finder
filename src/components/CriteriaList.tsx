import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { FilterMode } from "@/lib/filters"
import type { Criterion } from "@/lib/words"
import { CriterionRow } from "./CriterionRow"

export function CriteriaList({ criteria, onChange }: Props) {
  const addCriterion = () => {
    onChange([...criteria, { mode: FilterMode.Contains, value: "" }])
  }

  const updateCriterion = (index: number, criterion: Criterion) => {
    const next = [...criteria]
    next[index] = criterion
    onChange(next)
  }

  const removeCriterion = (index: number) => {
    onChange(criteria.filter((_, i) => i !== index))
  }

  return (
    <div className="p-4 space-y-3 border-b bg-background">
      {criteria.map((criterion, index) => (
        <CriterionRow
          key={index}
          criterion={criterion}
          onChange={(c) => updateCriterion(index, c)}
          onRemove={() => removeCriterion(index)}
        />
      ))}
      <Button variant="outline" onClick={addCriterion} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add criterion
      </Button>
    </div>
  )
}

type Props = {
  criteria: Criterion[]
  onChange: (criteria: Criterion[]) => void
}
