/**
 * Regenerates readme-data.js from README_LightLabPRO_Features_Tutorial.md
 * Run: node embed-readme.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const readmePath = path.join(__dirname, "README_LightLabPRO_Features_Tutorial.md");
const outPath = path.join(__dirname, "readme-data.js");

const raw = fs.readFileSync(readmePath, "utf8");
const header =
  "/* Embedded copy of README_LightLabPRO_Features_Tutorial.md — run: node embed-readme.mjs */\n";
const body = `window.__README_MD__=${JSON.stringify(raw)};\n`;
fs.writeFileSync(outPath, header + body, "utf8");
console.log("Wrote", outPath);
