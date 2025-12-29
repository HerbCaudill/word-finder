import { FilterMode } from "@/lib/filters"
import type { Criterion } from "@/lib/words"
import { CriterionRow } from "./CriterionRow"

export function CriteriaList({ criteria, onChange }: Props) {
  const updateCriterion = (index: number, criterion: Criterion) => {
    const next = [...criteria]
    next[index] = criterion

    // Auto-add new criterion when the last one gets a value
    const isLast = index === criteria.length - 1
    const hadNoValue = !criteria[index].value
    const hasValue = !!criterion.value
    if (isLast && hadNoValue && hasValue) {
      next.push({ mode: FilterMode.Contains, value: "" })
    }

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
    </div>
  )
}

type Props = {
  criteria: Criterion[]
  onChange: (criteria: Criterion[]) => void
}
