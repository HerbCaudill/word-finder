# Word Finder

A mobile-first PWA for finding words from the Collins Scrabble Dictionary (CSW21).

## Tech Stack

- React + TypeScript + Vite
- Tailwind v4 + shadcn/ui
- IBM Plex fonts
- vite-plugin-pwa for offline support

## Commands

```bash
pnpm dev        # Start dev server
pnpm build      # Production build
pnpm preview    # Preview production build
pnpm vitest run # Run tests
```

## Project Structure

```
src/
  components/
    App.tsx              # Main app shell
    CriteriaList.tsx     # List of criteria with add button
    CriterionRow.tsx     # Single criterion: dropdown + input + remove
    ResultsList.tsx      # Infinite scroll word list
    WordRow.tsx          # Tappable word with expandable definition
    ui/                  # shadcn/ui components
  lib/
    filters.ts           # Filter functions for each search mode
    filters.test.ts      # Filter tests
    words.ts             # Word types and filtering/sorting logic
    words.test.ts        # Word tests
  data/
    words.json           # Parsed word list (279k words)
scripts/
  parse-words.ts         # Converts CSW21.txt to words.json
```

## Search Modes

- Contains
- Starts with
- Ends with
- Does not contain
- Contains any of (letters)
- Contains all of (letters)
- Contains none of (letters)
- Matches regex
- Has length

Multiple criteria combine with AND logic.

## Regenerating Word Data

```bash
curl -o scripts/CSW21.txt "https://raw.githubusercontent.com/scrabblewords/scrabblewords/refs/heads/main/words/British/CSW21.txt"
pnpm tsx scripts/parse-words.ts
```
