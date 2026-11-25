// SPDX-License-Identifier: MIT
// The Router Confesses — one line a home Wi-Fi router says to excuse itself
// for dropping the connection at the climax of a movie.
import { createHash } from "node:crypto";
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";

const ENTRY =
  "I didn't drop the connection — I know who the killer is, and I decided you don't deserve to find out tonight.";

function main(): void {
  // Fail fast: the gate is 1–200 UTF-8 characters, one non-blank line.
  const chars = [...ENTRY].length;
  if (chars < 1 || chars > 200) {
    throw new Error(`entry is ${chars} chars, outside the 1–200 gate`);
  }
  if (ENTRY.trim().length === 0) throw new Error("entry is blank");
  if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  mkdirSync("/output", { recursive: true });
  for (const name of readdirSync("/output")) {
    rmSync(`/output/${name}`, { recursive: true, force: true });
  }
  writeFileSync("/output/entry.txt", ENTRY, "utf8");
  // Read back and verify byte-identical output.
  const written = readFileSync("/output/entry.txt");
  const digest = createHash("sha256").update(written).digest("hex");
  const expected = createHash("sha256").update(ENTRY, "utf8").digest("hex");
  if (digest !== expected) {
    throw new Error("read-back mismatch: /output/entry.txt differs from ENTRY");
  }
}

main();
