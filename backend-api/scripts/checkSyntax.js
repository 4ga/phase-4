import { readdirSync } from "node:fs";
import { extname, join } from "node:path";
import { spawnSync } from "node:child_process";

const directoriesToCheck = ["src", "test", "scripts"];

function collectJavaScriptFiles(directory) {
  const entries = readdirSync(directory, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return collectJavaScriptFiles(entryPath);
    }

    if (entry.isFile() && extname(entry.name) === ".js") {
      return [entryPath];
    }

    return [];
  });
}

const javaScriptFiles = directoriesToCheck.flatMap(collectJavaScriptFiles);

let hasSyntaxError = false;

for (const filePath of javaScriptFiles) {
  const result = spawnSync(process.execPath, ["--check", filePath], {
    stdio: "inherit",
  });

  if (result.status !== 0) {
    hasSyntaxError = true;
  }
}

if (hasSyntaxError) {
  console.error("Syntax check failed.");
  process.exitCode = 1;
} else {
  console.log(`Syntax check passed for ${javaScriptFiles.length} files.`);
}
