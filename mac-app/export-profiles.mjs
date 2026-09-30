import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import { addSpecialCharacterFallbacks } from "../src/features/add-special-character-fallbacks.js";

const traverse = traverseModule.default;
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(scriptDirectory, "..", "src", "main.jsx");
const outputPath = process.argv[2];
const source = fs.readFileSync(sourcePath, "utf8");
const ast = parse(source, { sourceType: "module", plugins: ["jsx"] });
let profileExpression;

traverse(ast, {
  VariableDeclarator(nodePath) {
    if (nodePath.node.id.type === "Identifier" && nodePath.node.id.name === "LANGUAGE_PROFILES") {
      const { start, end } = nodePath.node.init;
      profileExpression = source.slice(start, end);
      nodePath.stop();
    }
  }
});

if (!profileExpression) {
  throw new Error("Could not find LANGUAGE_PROFILES in src/main.jsx");
}

const profiles = addSpecialCharacterFallbacks(
  Function(`"use strict"; return (${profileExpression});`)()
);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(profiles, null, 2)}\n`);
console.log(`Exported ${Object.keys(profiles).length} language profiles.`);
