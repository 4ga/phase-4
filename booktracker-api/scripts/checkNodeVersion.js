import { readFileSync } from "node:fs";

const projectRoot = new URL("../", import.meta.url);

const requiredNodeVersion = readFileSync(new URL(".nvmrc", projectRoot), "utf8")
  .trim()
  .replace(/^v/, "");

const packageJson = JSON.parse(
  readFileSync(new URL("package.json", projectRoot), "utf8"),
);

const declaredNodeVersion = packageJson.engines?.node;
const currentNodeVersion = process.versions.node;

let hasError = false;

if (!requiredNodeVersion) {
  console.error("Node.js version check failed: .nvmrc is empty.");
  hasError = true;
}

if (declaredNodeVersion !== requiredNodeVersion) {
  console.error(
    "Node.js version check failed: package.json and .nvmrc disagree.",
  );
  console.error(`.nvmrc: ${requiredNodeVersion}`);
  console.error(`package.json: ${declaredNodeVersion ?? "not declared"}`);

  hasError = true;
}

if (currentNodeVersion !== requiredNodeVersion) {
  console.error("Node.js version check failed.");
  console.error(`Required: v${requiredNodeVersion}`);
  console.error(`Current:  v${currentNodeVersion}`);
  console.error("Switch to the project Node.js version before continuing.");

  hasError = true;
}

if (hasError) {
  process.exitCode = 1;
} else {
  console.log(`Node.js version check passed: v${currentNodeVersion}.`);
}
