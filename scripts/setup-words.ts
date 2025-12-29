import { existsSync } from "fs"
import { execSync } from "child_process"

const SOURCE_URL =
  "https://raw.githubusercontent.com/scrabblewords/scrabblewords/refs/heads/main/words/British/CSW21.txt"
const SOURCE_PATH = "scripts/CSW21.txt"
const OUTPUT_PATH = "public/words.json.gz"

// Skip if words.json.gz already exists
if (existsSync(OUTPUT_PATH)) {
  console.log("words.json.gz already exists, skipping setup")
  process.exit(0)
}

// Download source file if needed
if (!existsSync(SOURCE_PATH)) {
  console.log("Downloading CSW21.txt...")
  execSync(`curl -o ${SOURCE_PATH} "${SOURCE_URL}"`, { stdio: "inherit" })
}

// Generate words.json.gz
console.log("Generating words.json.gz...")
execSync("pnpm tsx scripts/parse-words.ts", { stdio: "inherit" })
