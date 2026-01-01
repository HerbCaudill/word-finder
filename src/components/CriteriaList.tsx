import { useEffect, useRef, useState } from 'react'
import { FilterMode } from '@/lib/filters'
import type { Criterion } from '@/lib/words'
import { CriterionRow } from './CriterionRow'

export function CriteriaList({ criteria, onChange }: Props) {
  const prevLengthRef = useRef(criteria.length)
  const [focusState, setFocusState] = useState<{ index: number; trigger: number } | null>(null)

  // Re-focus when criteria length decreases (delete/reset)
  useEffect(() => {
    if (criteria.length < prevLengthRef.current) {
      const emptyIndex = criteria.findIndex(c => c.value === '')
      if (emptyIndex >= 0) {
        setFocusState(prev => ({ index: emptyIndex, trigger: (prev?.trigger ?? 0) + 1 }))
      }
    }
    prevLengthRef.current = criteria.length
  }, [criteria])

  const updateCriterion = (index: number, criterion: Criterion) => {
    const next = [...criteria]
    next[index] = criterion

    // Auto-add new criterion when the last one gets a value
    const isLast = index === criteria.length - 1
    const hadNoValue = !criteria[index].value
    const hasValue = !!criterion.value
    if (isLast && hadNoValue && hasValue) {
      next.push({ mode: FilterMode.Contains, value: '' })
    }

    onChange(next)
  }

  const removeCriterion = (index: number) => {
    if (criteria.length <= 1) return // Safety check
    onChange(criteria.filter((_, i) => i !== index))
  }

  return (
    <div className="p-3 space-y-2">
      {criteria.map((criterion, index) => (
        <CriterionRow
          key={index}
          criterion={criterion}
          onChange={c => updateCriterion(index, c)}
          onRemove={() => removeCriterion(index)}
          canRemove={criteria.length > index + 1}
          shouldFocus={focusState?.index === index ? focusState.trigger : undefined}
        />
      ))}
    </div>
  )
}

type Props = {
  criteria: Criterion[]
  onChange: (criteria: Criterion[]) => void
}
