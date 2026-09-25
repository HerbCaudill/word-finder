# Word Finder

A mobile-first PWA for finding words from the Collins Scrabble Dictionary (CSW21).

## Tech Stack

- React + TypeScript + Vite
- Tailwind v4 + shadcn/ui
- IBM Plex fonts
- vite-plugin-pwa for offline support
- [@herbcaudill/scrabble-words](https://www.npmjs.com/package/@herbcaudill/scrabble-words) for word data

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
    WordChip.tsx         # Word chip with popover definition
    ui/                  # shadcn/ui components
  lib/
    filters.ts           # Filter functions for each search mode
    filters.test.ts      # Filter tests
    words.ts             # Filtering/sorting logic and Criterion type
    words.test.ts        # Word tests
    loadWords.ts         # Imports word data from @herbcaudill/scrabble-words
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
