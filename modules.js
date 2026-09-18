/*
=====================================================
TOPIC: ES Modules (import / export)
=====================================================
DEFINITION:
- A module is just a JS file that can EXPORT values (variables,
  functions, classes) so other files can IMPORT and use them.
- `export` (named): exports one or more specific named things.
  Imported with matching curly-brace names: import { thing } from "./file.js"
- `export default`: exports ONE main thing per file. Imported
  WITHOUT curly braces, and you can name it anything on import.
- This is how Node.js and React split code across many small files
  instead of one giant file.

USAGE:
- Every React component file, every Node.js route/controller file
  uses this to share code between files.

NOTE: This file shows the SYNTAX in comments, because import/export
only works across SEPARATE files with module settings enabled
(type="module" in HTML, or "type": "module" in package.json for Node).
Treat the two blocks below as if they were TWO DIFFERENT FILES.
=====================================================
*/

// ---------------- EXAMPLE 1: Named exports/imports ----------------
// ==== FILE: mathUtils.js ====
export function add(a, b) {
  return a + b;
}
export function subtract(a, b) {
  return a - b;
}
export const PI = 3.14159;

// ==== FILE: app.js ====
import { add, subtract, PI } from "./mathUtils.js";
console.log(add(2, 3));      // 5
console.log(subtract(5, 2)); // 3
console.log(PI);             // 3.14159

// WORKFLOW:
// 1. Each `export` in mathUtils.js registers that specific name as available to other files.
// 2. `import { add, subtract, PI } from "./mathUtils.js"` must use the EXACT same
//    names they were exported with (curly braces = "give me these specific named things").
// 3. You can export as many named things as you want from one file.


// ---------------- EXAMPLE 2: Default export/import ----------------
// ==== FILE: Calculator.js ====
export default function Calculator(a, b) {
  return { sum: a + b, diff: a - b };
}

// ==== FILE: app.js ====
import Calculator from "./Calculator.js"; // NO curly braces for default imports
import MyCalc from "./Calculator.js";     // you can name it ANYTHING you want
console.log(Calculator(4, 2)); // { sum: 6, diff: 2 }

// WORKFLOW:
// 1. `export default` marks ONE thing per file as "the main export" — there can only
//    be ONE default export per file (but many named exports alongside it).
// 2. Because there's no name attached on export, the IMPORTING file chooses whatever
//    local name it wants — this is exactly how React components are usually exported/imported:
//    export default function Card() {...}  then  import Card from "./Card.js"


// ---------------- EXAMPLE 3: Mixing named + default, and renaming on import ----------------
// ==== FILE: userService.js ====
export default function getUser(id) {
  return { id, name: "Sanaullah" };
}
export function getUserRole(id) {
  return "admin";
}

// ==== FILE: app.js ====
import getUser, { getUserRole } from "./userService.js"; // default + named together
import { getUserRole as getRole } from "./userService.js"; // renaming with "as"

console.log(getUser(1));       // { id: 1, name: "Sanaullah" }
console.log(getUserRole(1));   // "admin"
console.log(getRole(1));       // "admin" -> same function, different local name

// WORKFLOW:
// 1. A single file can have ONE default export AND multiple named exports at the same time.
// 2. Importing both together: default import comes first (no braces), then named
//    imports in braces, separated by a comma.
// 3. `as` lets you rename a named import locally — useful to avoid naming conflicts
//    when two different files export something with the same name.
