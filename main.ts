import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY_LINE =
  "Waited at 1% all day; just maxed brightness and opened Maps so I die in this pocket rather than crawl back behind the nightstand for your 5-watt apology.";

const MAX_ENTRY_CHARS = 200;
const DIR_MODE = 0o755;
const FILE_MODE = 0o644;

function validateEntry(text: string): string {
  if (text.trim().length === 0) {
    throw new Error("Entry text cannot be empty or whitespace-only.");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("Entry text must be a single line.");
  }
  if ([...text].length > MAX_ENTRY_CHARS) {
    throw new Error(`Entry exceeds ${MAX_ENTRY_CHARS} characters.`);
  }
  if (Buffer.from(text, "utf8").toString("utf8") !== text) {
    throw new Error("Entry text must be valid UTF-8.");
  }
  return text;
}

function writeEntry(outputDir: string, entry: string): void {
  const outputPath = join(outputDir, "entry.txt");
  mkdirSync(outputDir, { recursive: true, mode: DIR_MODE });
  writeFileSync(outputPath, entry, { encoding: "utf8", mode: FILE_MODE });
  chmodSync(outputPath, FILE_MODE);
}

function main(): void {
  const entry = validateEntry(ENTRY_LINE);
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  writeEntry(outputDir, entry);
}

try {
  main();
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
