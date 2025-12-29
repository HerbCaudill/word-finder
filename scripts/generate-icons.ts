import { execSync } from "child_process"
import { existsSync } from "fs"

const sizes = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
]

const svgPath = "scripts/icon.svg"
const outputDir = "public"

// Check if ImageMagick is available
try {
  execSync("which magick", { stdio: "ignore" })
} catch {
  console.error("ImageMagick is required. Install with: brew install imagemagick")
  process.exit(1)
}

if (!existsSync(svgPath)) {
  console.error(`SVG file not found: ${svgPath}`)
  process.exit(1)
}

for (const { name, size } of sizes) {
  const output = `${outputDir}/${name}`
  console.log(`Generating ${name} (${size}x${size})...`)
  execSync(
    `magick -background none -density 300 ${svgPath} -resize ${size}x${size} ${output}`
  )
}

// Generate favicon.ico (multi-size)
console.log("Generating favicon.ico...")
execSync(
  `magick -background none -density 300 ${svgPath} -define icon:auto-resize=48,32,16 ${outputDir}/favicon.ico`
)

console.log("Done! Icons generated in public/")
