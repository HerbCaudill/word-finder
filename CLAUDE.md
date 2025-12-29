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
    WordChip.tsx         # Word chip with popover definition
    ui/                  # shadcn/ui components
  lib/
    filters.ts           # Filter functions for each search mode
    filters.test.ts      # Filter tests
    words.ts             # Word types and filtering/sorting logic
    words.test.ts        # Word tests
    loadWords.ts         # Fetches and parses word data
    parseDefinition.ts   # Parses raw definitions into structured data
    parseDefinition.test.ts
public/
  words.json             # Parsed word list (279k words, gitignored)
scripts/
  setup-words.ts         # Downloads CSW21.txt and generates words.json if needed
  parse-words.ts         # Converts CSW21.txt to public/words.json
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

## Word Data

The word list is gitignored and generated automatically during `pnpm build`. To manually regenerate:

```bash
pnpm run setup   # Downloads CSW21.txt if needed and generates words.json
```

## Important

Never commit generated files like `public/words.json` to source control. They are gitignored and should be generated at build time via the setup script.
