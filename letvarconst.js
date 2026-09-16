/*
=====================================================
TOPIC: var vs let vs const, Scope & Hoisting
=====================================================
DEFINITION:
- var: FUNCTION-scoped (or global if declared outside any function).
  Ignores block boundaries ({ }) entirely. Can be redeclared and
  reassigned freely. Hoisted AND pre-initialized as `undefined`.
- let: BLOCK-scoped — trapped inside the nearest { } it's declared in.
  Can be reassigned, but CANNOT be redeclared in the same scope.
  Hoisted, but left in the "Temporal Dead Zone" (unusable) until its
  own line actually runs.
- const: block-scoped exactly like `let`, but the VARIABLE BINDING
  can never be reassigned after its first value. Important nuance:
  this only locks the binding, NOT the data — if a const holds an
  object/array, its contents can still be freely changed.

USAGE:
- Default to `const` everywhere.
- Use `let` only when you know the variable must be reassigned later
  (loop counters, running totals, values that change over time).
- Avoid `var` in modern code — it's kept in this file only to see,
  side by side, exactly why `let`/`const` were introduced.
=====================================================
*/

// ---------------- SECTION 1: var leaks out of blocks, let doesn't ----------------
// What this shows: `var` ignores the `if` block's { }, but `let` respects it.
if (true) {
  var globalVar = "I leak out!";
  let blockLet = "I am trapped inside!";
}
console.log(globalVar); // Logs: "I leak out!"
console.log(blockLet);  // ❌ ReferenceError: blockLet is not defined

// WORKFLOW:
// 1. `var globalVar` is hoisted all the way up to the nearest FUNCTION (or global scope
//    here, since there's no function), completely ignoring the `if` block it's written in.
//    So it's still accessible after the `if` block ends.
// 2. `let blockLet` is hoisted only to the top of the `if` block's { }. Once that block
//    ends, `blockLet` no longer exists anywhere — trying to read it outside throws.
// 3. This is the single biggest reason `let`/`const` are preferred: `var`'s scoping is
//    easy to misuse by accident (a variable "escaping" further than you intended).


//.................//


// ---------------- SECTION 2: let cannot be redeclared in the same scope ----------------
// What this shows: `let` protects you from accidentally declaring the same name twice.
let x = { name: "Sanaullah", age: 22 };
x.name = "Sunny"; // ✅ Allowed — we're modifying a PROPERTY of the object, not reassigning `x` itself
let x2 = { name: "Sunny", age: 21 }; // (renamed to x2 here — seeing why below)
// let x = { name: "Sunny", age: 21 }; // ❌ SyntaxError: Identifier 'x' has already been declared

const y = 10.5;
// y = 10;
// console.log(y) // ❌ TypeError: Assignment to constant variable.

const z = { name: "Sanaullah", age: 22 };
z.name = "Sunny"; // ✅ Allowed, same reason as `x` above — mutating the object, not reassigning `z`
// z = { name: "Sunny", age: 21 }; // ❌ TypeError: Assignment to constant variable.

//......................//

// WORKFLOW:
// 1. `x.name = "Sunny"` is safe because `x` still points at the SAME object the whole
//    time — only a property INSIDE that object changed (see copyingmutation.js for
//    the deeper "reference vs value" explanation of why this distinction matters).
// 2. `let x = {...}` a second time in the SAME scope throws a SyntaxError. Important
//    detail: SyntaxErrors are caught while JS is still PARSING the file, before a
//    single line has actually run — meaning if that redeclaration were left uncommented,
//    even `console.log(globalVar)` above it in Section 1 would NEVER run, because the
//    whole file fails to load. That's exactly why it's commented out here.
// 3. `const y = 10.5; y = 10;` throws a TypeError instead, and only at RUNTIME, once
//    execution actually reaches that reassignment line — the rest of the file before
//    it still runs fine.
// 4. `const z = {...}; z.name = "Sunny";` is allowed for the same reason as `x.name`:
//    `const` only freezes the BINDING (`z` must always point at this one object), not
//    the object's own properties. Only `z = {...}` (replacing the whole object) fails.
