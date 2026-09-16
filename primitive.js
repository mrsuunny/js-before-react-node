/*
=====================================================
TOPIC: Primitive vs Non-Primitive Data Types
=====================================================
DEFINITION:
- Primitive types: the 7 basic building-block types. They are
  stored and copied BY VALUE (see copyingmutation.js Example 1) —
  once created, a primitive value itself can never be mutated
  (you can only replace the variable's value entirely).
  number, bigint, boolean, undefined, string, null, symbol.
- Non-primitive (reference) types: everything else — object,
  array, function. Stored and copied BY REFERENCE, and their
  CONTENTS can be changed in place (mutated).

USAGE:
- Knowing which type something is decides whether copying it is
  "safe" (primitives) or needs care (objects/arrays — see
  copyingmutation.js), and explains typeof/comparison behavior.
=====================================================
*/

// // 7 types of primitive data types in JavaScript

// // number
// let num = 1
// let num2 =0.5 // float also included in number

// // bignit
// let bigNum = 249246293237237322322n

// // boolean
// let sunny = true;

// // undefined
// let x; // x is undefined

// // string
// let myNickName = "Sunny";

// // null
// let s = null;

// // symbol
// let sun = Symbol("SUN");

// WORKFLOW (primitives above):
// 1. `number` covers both integers and decimals (0.5) — JS has only ONE numeric type
//    for these (no separate "float"/"int" like some other languages).
// 2. `bigint` (the trailing `n`) exists because regular `number` loses precision above
//    2^53 — use it only when you truly need integers larger than that.
// 3. `undefined` is JS's own "nothing was assigned yet" — you rarely set it explicitly;
//    it's what a declared-but-empty variable gets automatically.
// 4. `null` is different: it means "intentionally empty," something YOU chose to set.
//    (`typeof null` is actually "object" — a famous, long-standing JS quirk.)
// 5. `symbol` creates a guaranteed-unique value, mostly used for special/hidden object keys.


// // NON PRIMITIVE DATA TYPES

// // object
// const me = { name: "Sanaullah", age: 22};

// // array
// const myFvrtLanguages = ["Love Language", "Carring Language", "Words of Affirmation"];

// // function
// function imSunny() {
//     return "I am Great";
// }

// WORKFLOW (non-primitives above):
// 1. Objects, arrays, AND functions are all technically "objects" under the hood in JS
//    (yes — functions are objects that happen to be callable).
// 2. Unlike primitives, these are stored by REFERENCE: a variable holding one doesn't
//    hold the data directly, it holds a pointer to where that data lives in memory.
//    See copyingmutation.js for exactly why that matters when copying them.


//  Just press Enter normally

// ---------------- Template literals (backtick strings) ----------------
// DEFINITION: strings wrapped in backticks (`) instead of quotes. They can span
// multiple lines as-written (no \n needed) and support ${expression} interpolation.
const htmlTemplate = `
  <div class="card">
    <h2>Welcome to the Site</h2>
    <p>Template literals maintain formatting easily.</p>
  </div>
`;

console.log(htmlTemplate);

const quote = `He said, "It's a beautiful day for coding."`;

console.log(quote);

// WORKFLOW:
// 1. Everything between the backticks — including the actual line breaks from pressing
//    Enter — is kept EXACTLY as typed. A regular "..." string would need \n manually
//    inserted to get the same multi-line result.
// 2. Because backticks are the delimiter (not quotes), you can freely use " and ' inside
//    the string (see `quote` above) without needing to escape them with \".


// ---------------- Block scope with `let` inside nested functions ----------------
// What this shows: each { } block gets its OWN `b`, even when nested and same-named.
function a() {
    let b = 10;
    if (true) {
        let b = 20;
        console.log(b); // Logs: 20
    }
    console.log(b); // Logs: 10
}
a();
let b = 30;
console.log(b); // Logs: 30

// WORKFLOW:
// 1. There are actually THREE separate `b` variables here, in three separate scopes:
//    the outer/global `b = 30`, the one inside function `a` (`b = 10`), and the one
//    inside the `if` block within `a` (`b = 20`).
// 2. Because `let` is block-scoped, the inner `if` block's `b = 20` completely SHADOWS
//    (hides) the outer `b = 10` only while inside that block — it never overwrites it.
// 3. Once the `if` block ends, `console.log(b)` inside `a()` sees `b = 10` again,
//    completely unaffected by the inner block's `b = 20`.
// 4. The global `let b = 30` is a fourth, totally independent scope — unrelated to
//    either `b` inside `a()` — which is why it logs 30 on its own.
