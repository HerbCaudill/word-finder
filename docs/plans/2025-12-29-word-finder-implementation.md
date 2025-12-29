# Word Finder Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a mobile-first word finder app with multiple combinable search criteria and live results from the Collins Scrabble Dictionary.

**Architecture:** React SPA with embedded word data (JSON). Criteria state drives filtering on each keystroke. Infinite scroll for results. All filtering happens client-side.

**Tech Stack:** React, TypeScript, Vite, Tailwind v4, shadcn/ui, IBM Plex fonts

---

### Task 1: Scaffold Project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/index.css`

**Step 1: Initialize Vite project with React + TypeScript**

Run:
```bash
pnpm create vite . --template react-ts
```

**Step 2: Install dependencies**

Run:
```bash
pnpm install
```

**Step 3: Verify it runs**

Run: `pnpm dev`
Expected: Dev server starts, default Vite page loads

**Step 4: Commit**

```bash
git init
git add .
git commit -m "scaffold: Vite + React + TypeScript"
```

---

### Task 2: Configure Tailwind v4 + shadcn/ui

**Files:**
- Modify: `package.json`
- Modify: `src/index.css`
- Create: `components.json`

**Step 1: Install Tailwind v4**

Run:
```bash
pnpm add tailwindcss @tailwindcss/vite
```

**Step 2: Configure Vite for Tailwind**

Modify `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**Step 3: Add Tailwind to CSS**

Replace `src/index.css` with:
```css
@import "tailwindcss";
```

**Step 4: Install shadcn/ui**

Run:
```bash
pnpm dlx shadcn@latest init
```

Select: New York style, Zinc color, CSS variables: yes

**Step 5: Verify Tailwind works**

Modify `src/App.tsx` to include a Tailwind class, confirm styling applies.

**Step 6: Commit**

```bash
git add .
git commit -m "config: Tailwind v4 + shadcn/ui"
```

---

### Task 3: Add IBM Plex Fonts

**Files:**
- Modify: `src/index.css`

**Step 1: Install IBM Plex fonts**

Run:
```bash
pnpm add @fontsource/ibm-plex-sans @fontsource/ibm-plex-mono
```

**Step 2: Import fonts in CSS**

Add to top of `src/index.css`:
```css
@import "@fontsource/ibm-plex-sans/400.css";
@import "@fontsource/ibm-plex-sans/500.css";
@import "@fontsource/ibm-plex-sans/600.css";
@import "@fontsource/ibm-plex-mono/400.css";
```

**Step 3: Configure font family in Tailwind**

Add to `src/index.css` after the imports:
```css
@theme {
  --font-sans: "IBM Plex Sans", sans-serif;
  --font-mono: "IBM Plex Mono", monospace;
}
```

**Step 4: Verify fonts render**

Run: `pnpm dev`
Expected: Text renders in IBM Plex Sans

**Step 5: Commit**

```bash
git add .
git commit -m "config: IBM Plex fonts"
```

---

### Task 4: Parse Word Data

**Files:**
- Create: `scripts/parse-words.ts`
- Create: `src/data/words.json`

**Step 1: Download CSW21.txt**

Run:
```bash
mkdir -p scripts src/data
curl -o scripts/CSW21.txt "https://raw.githubusercontent.com/scrabblewords/scrabblewords/refs/heads/main/words/British/CSW21.txt"
```

**Step 2: Write parser script**

Create `scripts/parse-words.ts`:
```typescript
import { readFileSync, writeFileSync } from "fs"

const input = readFileSync("scripts/CSW21.txt", "utf-8")
const lines = input.split("\n").filter((line) => line && !line.startsWith("#"))

const words = lines.map((line) => {
  const match = line.match(/^(\S+)\s+(.+)$/)
  if (!match) return null
  return { word: match[1], definition: match[2] }
}).filter(Boolean)

writeFileSync("src/data/words.json", JSON.stringify(words))
console.log(`Parsed ${words.length} words`)
```

**Step 3: Run parser**

Run:
```bash
pnpm tsx scripts/parse-words.ts
```

Expected: `Parsed ~279000 words`

**Step 4: Add to .gitignore**

Add to `.gitignore`:
```
scripts/CSW21.txt
```

**Step 5: Commit**

```bash
git add .
git commit -m "data: parse Collins Scrabble Dictionary"
```

---

### Task 5: Create Filter Functions

**Files:**
- Create: `src/lib/filters.ts`
- Create: `src/lib/filters.test.ts`

**Step 1: Write failing tests**

Create `src/lib/filters.test.ts`:
```typescript
import { describe, it, expect } from "vitest"
import { applyFilter, FilterMode } from "./filters"

describe("applyFilter", () => {
  it("contains - matches substring", () => {
    expect(applyFilter("HELLO", FilterMode.Contains, "ELL")).toBe(true)
    expect(applyFilter("HELLO", FilterMode.Contains, "XYZ")).toBe(false)
  })

  it("startsWith - matches prefix", () => {
    expect(applyFilter("HELLO", FilterMode.StartsWith, "HE")).toBe(true)
    expect(applyFilter("HELLO", FilterMode.StartsWith, "LO")).toBe(false)
  })

  it("endsWith - matches suffix", () => {
    expect(applyFilter("HELLO", FilterMode.EndsWith, "LO")).toBe(true)
    expect(applyFilter("HELLO", FilterMode.EndsWith, "HE")).toBe(false)
  })

  it("doesNotContain - excludes substring", () => {
    expect(applyFilter("HELLO", FilterMode.DoesNotContain, "XYZ")).toBe(true)
    expect(applyFilter("HELLO", FilterMode.DoesNotContain, "ELL")).toBe(false)
  })

  it("containsAnyOf - at least one letter present", () => {
    expect(applyFilter("HELLO", FilterMode.ContainsAnyOf, "XYZ")).toBe(false)
    expect(applyFilter("HELLO", FilterMode.ContainsAnyOf, "AEI")).toBe(true)
  })

  it("containsAllOf - all letters present", () => {
    expect(applyFilter("HELLO", FilterMode.ContainsAllOf, "HEL")).toBe(true)
    expect(applyFilter("HELLO", FilterMode.ContainsAllOf, "HEX")).toBe(false)
  })

  it("containsNoneOf - no letters present", () => {
    expect(applyFilter("HELLO", FilterMode.ContainsNoneOf, "XYZ")).toBe(true)
    expect(applyFilter("HELLO", FilterMode.ContainsNoneOf, "AEI")).toBe(false)
  })

  it("matchesRegex - regex pattern matches", () => {
    expect(applyFilter("HELLO", FilterMode.MatchesRegex, "^H.*O$")).toBe(true)
    expect(applyFilter("HELLO", FilterMode.MatchesRegex, "^X")).toBe(false)
  })

  it("hasLength - exact length match", () => {
    expect(applyFilter("HELLO", FilterMode.HasLength, "5")).toBe(true)
    expect(applyFilter("HELLO", FilterMode.HasLength, "4")).toBe(false)
  })

  it("handles case insensitivity", () => {
    expect(applyFilter("HELLO", FilterMode.Contains, "ell")).toBe(true)
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/lib/filters.test.ts`
Expected: FAIL - module not found

**Step 3: Install vitest if needed**

Run:
```bash
pnpm add -D vitest
```

**Step 4: Implement filters**

Create `src/lib/filters.ts`:
```typescript
export enum FilterMode {
  Contains = "contains",
  StartsWith = "startsWith",
  EndsWith = "endsWith",
  DoesNotContain = "doesNotContain",
  ContainsAnyOf = "containsAnyOf",
  ContainsAllOf = "containsAllOf",
  ContainsNoneOf = "containsNoneOf",
  MatchesRegex = "matchesRegex",
  HasLength = "hasLength",
}

export const FILTER_LABELS: Record<FilterMode, string> = {
  [FilterMode.Contains]: "Contains",
  [FilterMode.StartsWith]: "Starts with",
  [FilterMode.EndsWith]: "Ends with",
  [FilterMode.DoesNotContain]: "Does not contain",
  [FilterMode.ContainsAnyOf]: "Contains any of",
  [FilterMode.ContainsAllOf]: "Contains all of",
  [FilterMode.ContainsNoneOf]: "Contains none of",
  [FilterMode.MatchesRegex]: "Matches regex",
  [FilterMode.HasLength]: "Has length",
}

export function applyFilter(
  word: string,
  mode: FilterMode,
  value: string
): boolean {
  const w = word.toUpperCase()
  const v = value.toUpperCase()

  switch (mode) {
    case FilterMode.Contains:
      return w.includes(v)
    case FilterMode.StartsWith:
      return w.startsWith(v)
    case FilterMode.EndsWith:
      return w.endsWith(v)
    case FilterMode.DoesNotContain:
      return !w.includes(v)
    case FilterMode.ContainsAnyOf:
      return [...v].some((char) => w.includes(char))
    case FilterMode.ContainsAllOf:
      return [...v].every((char) => w.includes(char))
    case FilterMode.ContainsNoneOf:
      return ![...v].some((char) => w.includes(char))
    case FilterMode.MatchesRegex:
      try {
        return new RegExp(value, "i").test(word)
      } catch {
        return false
      }
    case FilterMode.HasLength:
      return word.length === parseInt(value, 10)
    default:
      return true
  }
}
```

**Step 5: Run tests to verify they pass**

Run: `pnpm vitest run src/lib/filters.test.ts`
Expected: All tests PASS

**Step 6: Commit**

```bash
git add .
git commit -m "filters: add filter functions with tests"
```

---

### Task 6: Create Word Loading & Search

**Files:**
- Create: `src/lib/words.ts`
- Create: `src/lib/words.test.ts`

**Step 1: Write failing tests**

Create `src/lib/words.test.ts`:
```typescript
import { describe, it, expect } from "vitest"
import { filterWords, sortWords } from "./words"
import { FilterMode } from "./filters"

describe("sortWords", () => {
  it("sorts by length descending, then alphabetically", () => {
    const words = [
      { word: "CAT", definition: "" },
      { word: "APPLE", definition: "" },
      { word: "DOG", definition: "" },
      { word: "ZEBRA", definition: "" },
    ]
    const sorted = sortWords(words)
    expect(sorted.map((w) => w.word)).toEqual(["APPLE", "ZEBRA", "CAT", "DOG"])
  })
})

describe("filterWords", () => {
  const words = [
    { word: "APPLE", definition: "a fruit" },
    { word: "BANANA", definition: "yellow fruit" },
    { word: "CAT", definition: "a pet" },
  ]

  it("filters with single criterion", () => {
    const criteria = [{ mode: FilterMode.StartsWith, value: "A" }]
    const result = filterWords(words, criteria)
    expect(result.map((w) => w.word)).toEqual(["APPLE"])
  })

  it("filters with multiple criteria (AND)", () => {
    const criteria = [
      { mode: FilterMode.ContainsAllOf, value: "AN" },
      { mode: FilterMode.HasLength, value: "6" },
    ]
    const result = filterWords(words, criteria)
    expect(result.map((w) => w.word)).toEqual(["BANANA"])
  })

  it("returns all words when no criteria", () => {
    const result = filterWords(words, [])
    expect(result).toHaveLength(3)
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `pnpm vitest run src/lib/words.test.ts`
Expected: FAIL

**Step 3: Implement words module**

Create `src/lib/words.ts`:
```typescript
import { applyFilter, FilterMode } from "./filters"

export type Word = {
  word: string
  definition: string
}

export type Criterion = {
  mode: FilterMode
  value: string
}

export function sortWords(words: Word[]): Word[] {
  return [...words].sort((a, b) => {
    if (b.word.length !== a.word.length) {
      return b.word.length - a.word.length
    }
    return a.word.localeCompare(b.word)
  })
}

export function filterWords(words: Word[], criteria: Criterion[]): Word[] {
  if (criteria.length === 0) return words

  return words.filter((w) =>
    criteria.every((c) => c.value === "" || applyFilter(w.word, c.mode, c.value))
  )
}
```

**Step 4: Run tests to verify they pass**

Run: `pnpm vitest run src/lib/words.test.ts`
Expected: All tests PASS

**Step 5: Commit**

```bash
git add .
git commit -m "words: add filtering and sorting logic"
```

---

### Task 7: Create WordRow Component

**Files:**
- Create: `src/components/WordRow.tsx`

**Step 1: Install shadcn collapsible component**

Run:
```bash
pnpm dlx shadcn@latest add collapsible
```

**Step 2: Create WordRow component**

Create `src/components/WordRow.tsx`:
```typescript
import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Word } from "@/lib/words"

export function WordRow({ word }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="w-full text-left px-4 py-3 min-h-[44px] hover:bg-muted/50 active:bg-muted border-b border-border">
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
```

**Step 3: Verify it renders**

Temporarily import and render in App.tsx with test data.

**Step 4: Commit**

```bash
git add .
git commit -m "WordRow: tappable word with collapsible definition"
```

---

### Task 8: Create ResultsList Component

**Files:**
- Create: `src/components/ResultsList.tsx`

**Step 1: Create ResultsList with infinite scroll**

Create `src/components/ResultsList.tsx`:
```typescript
import { useEffect, useRef, useState } from "react"
import { Word } from "@/lib/words"
import { WordRow } from "./WordRow"

const PAGE_SIZE = 50

export function ResultsList({ words }: Props) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [words])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < words.length) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, words.length))
        }
      },
      { threshold: 0.1 }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [visibleCount, words.length])

  const visibleWords = words.slice(0, visibleCount)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 py-2 text-sm text-muted-foreground sticky top-0 bg-background border-b">
        {words.length.toLocaleString()} matches
      </div>
      <div>
        {visibleWords.map((word, index) => (
          <WordRow key={`${word.word}-${index}`} word={word} />
        ))}
      </div>
      {visibleCount < words.length && (
        <div ref={loaderRef} className="px-4 py-3 text-center text-muted-foreground text-sm">
          Loading more...
        </div>
      )}
    </div>
  )
}

type Props = {
  words: Word[]
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "ResultsList: infinite scroll word list"
```

---

### Task 9: Create CriterionRow Component

**Files:**
- Create: `src/components/CriterionRow.tsx`

**Step 1: Install shadcn components**

Run:
```bash
pnpm dlx shadcn@latest add select input button
```

**Step 2: Create CriterionRow component**

Create `src/components/CriterionRow.tsx`:
```typescript
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { FilterMode, FILTER_LABELS } from "@/lib/filters"
import { Criterion } from "@/lib/words"

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
```

**Step 3: Commit**

```bash
git add .
git commit -m "CriterionRow: dropdown + input + remove button"
```

---

### Task 10: Create CriteriaList Component

**Files:**
- Create: `src/components/CriteriaList.tsx`

**Step 1: Create CriteriaList component**

Create `src/components/CriteriaList.tsx`:
```typescript
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { FilterMode } from "@/lib/filters"
import { Criterion } from "@/lib/words"
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
```

**Step 2: Commit**

```bash
git add .
git commit -m "CriteriaList: manage multiple criteria"
```

---

### Task 11: Create App Shell

**Files:**
- Modify: `src/App.tsx`

**Step 1: Wire everything together**

Replace `src/App.tsx`:
```typescript
import { useEffect, useMemo, useState } from "react"
import { CriteriaList } from "@/components/CriteriaList"
import { ResultsList } from "@/components/ResultsList"
import { Criterion, filterWords, sortWords, Word } from "@/lib/words"
import { FilterMode } from "@/lib/filters"
import wordsData from "@/data/words.json"

export function App() {
  const [words, setWords] = useState<Word[]>([])
  const [criteria, setCriteria] = useState<Criterion[]>([
    { mode: FilterMode.Contains, value: "" },
  ])

  useEffect(() => {
    setWords(sortWords(wordsData as Word[]))
  }, [])

  const filteredWords = useMemo(() => {
    return filterWords(words, criteria)
  }, [words, criteria])

  return (
    <div className="h-dvh flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10">
        <CriteriaList criteria={criteria} onChange={setCriteria} />
      </header>
      <ResultsList words={filteredWords} />
    </div>
  )
}
```

**Step 2: Update main.tsx to use App**

Ensure `src/main.tsx` imports and renders `<App />`.

**Step 3: Clean up default files**

Remove `src/App.css` if present. Update `index.html` title to "Word Finder".

**Step 4: Verify full app works**

Run: `pnpm dev`
Expected: App loads with word list, criteria work, infinite scroll works, tap to expand works.

**Step 5: Commit**

```bash
git add .
git commit -m "App: wire up components into working app"
```

---

### Task 12: Final Polish

**Files:**
- Modify: various

**Step 1: Add PWA viewport meta**

In `index.html`, add:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#000000">
```

**Step 2: Test on mobile viewport**

Use browser dev tools to test at 375px width.

**Step 3: Run all tests**

Run: `pnpm vitest run`
Expected: All tests pass

**Step 4: Final commit**

```bash
git add .
git commit -m "polish: mobile viewport and final touches"
```

---

## Unresolved Questions

None - design is complete.
