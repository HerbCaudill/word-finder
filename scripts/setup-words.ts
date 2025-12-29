import { existsSync } from "fs"
import { execSync } from "child_process"

const SOURCE_URL =
  "https://raw.githubusercontent.com/scrabblewords/scrabblewords/refs/heads/main/words/British/CSW21.txt"
const SOURCE_PATH = "scripts/CSW21.txt"
const OUTPUT_PATH = "src/data/words.json"

// Skip if words.json already exists
if (existsSync(OUTPUT_PATH)) {
  console.log("words.json already exists, skipping setup")
  process.exit(0)
}

// Download source file if needed
if (!existsSync(SOURCE_PATH)) {
  console.log("Downloading CSW21.txt...")
  execSync(`curl -o ${SOURCE_PATH} "${SOURCE_URL}"`, { stdio: "inherit" })
}

// Generate words.json
console.log("Generating words.json...")
execSync("pnpm tsx scripts/parse-words.ts", { stdio: "inherit" })
