# Word Finder App Design

## Overview

A single-page React app for finding words from the Collins Scrabble Dictionary. Users add multiple search criteria that combine with AND logic. Results update live on each keystroke, sorted by length (descending) then alphabetically. Tap a word to reveal its definition.

## Data

- **Source:** Collins Scrabble Words 2021 (CSW21.txt) from [scrabblewords repo](https://raw.githubusercontent.com/scrabblewords/scrabblewords/refs/heads/main/words/British/CSW21.txt)
- **Format:** ~280k words with definitions, parsed to JSON at build time
- **Storage:** Bundled as static asset, loaded once on app start

## UI Layout (Mobile-First)

**Top section (sticky):**

- Criteria list - each criterion shows as a compact row: `[mode dropdown] [text input] [× remove]`
- "+ Add criterion" button below the list

**Results section (scrollable):**

- Word count badge (e.g., "1,234 matches")
- Word list with infinite scroll
- Tapping a word expands it inline to show definition; tapping again collapses

**Touch considerations:**

- Large tap targets (44px minimum height)
- Native mobile select for dropdowns
- Input fields sized for thumb typing

## Search Modes

| Mode             | Logic                                       |
| ---------------- | ------------------------------------------- |
| Contains         | `word.includes(input)`                      |
| Starts with      | `word.startsWith(input)`                    |
| Ends with        | `word.endsWith(input)`                      |
| Does not contain | `!word.includes(input)`                     |
| Contains any of  | at least one letter from input is in word   |
| Contains all of  | every letter from input is in word          |
| Contains none of | no letter from input is in word             |
| Matches regex    | `new RegExp(input).test(word)`              |
| Has length       | `word.length === parseInt(input)`           |

Multiple criteria combine with AND logic.

## Results

- Sorted by length (descending), then alphabetically
- Paginated: first 50 shown, infinite scroll loads more
- Tap word to expand/collapse definition

## Tech Stack

- React + TypeScript + Vite
- Tailwind v4 + shadcn/ui
- IBM Plex fonts

## File Structure

```
src/
  components/
    App.tsx              # Main app shell
    CriteriaList.tsx     # List of criteria with add button
    CriterionRow.tsx     # Single criterion: dropdown + input + remove
    ResultsList.tsx      # Infinite scroll word list
    WordRow.tsx          # Tappable word with expandable definition
  lib/
    words.ts             # Load and search word data
    filters.ts           # Filter functions for each mode
  data/
    words.json           # Parsed word list (generated at build)
scripts/
  parse-words.ts         # Converts CSW21.txt to words.json
```
