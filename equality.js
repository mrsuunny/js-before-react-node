/*
=====================================================
TOPIC: Equality (== vs ===) and Type Coercion
=====================================================
DEFINITION:
- "==" (loose equality) compares two values AFTER converting them
  to the same type (this is called "type coercion").
- "===" (strict equality) compares both VALUE and TYPE, with no
  conversion at all.
- Type coercion is JS automatically converting one data type into
  another (e.g. string "5" becoming number 5) so an operation can
  proceed.

USAGE:
- Almost always use "===" and "!==" in real code. It's predictable.
- "==" is mostly useful for ONE special case: checking for both
  null and undefined at once (x == null).
=====================================================
*/

// ---------------- EXAMPLE 1: == does hidden conversion ----------------
// What this shows: "==" converts types before comparing.
console.log(5 == "5");     // true  -> "5" is converted to number 5, then 5 == 5
console.log(5 === "5");    // false -> different types (number vs string), no conversion happens
console.log(0 == false);   // true  -> false is converted to 0, then 0 == 0
console.log(0 === false);  // false -> number vs boolean, different types

// WORKFLOW:
// 1. JS sees "==" and checks if types differ.
// 2. If they differ, it converts one side (following coercion rules) until types match.
// 3. Then it compares the converted values.
// 4. "===" skips step 1-2 entirely, so mismatched types are instantly false.


// ---------------- EXAMPLE 2: The null/undefined special case ----------------
// What this shows: the ONE place "==" is genuinely useful.
let userInput; // undefined (declared but never assigned)
let userInput2 = null;

console.log(userInput == null);   // true  -> undefined == null is a special built-in rule
console.log(userInput2 == null);  // true  -> null == null
console.log(userInput === null);  // false -> undefined is NOT strictly equal to null

// WORKFLOW:
// 1. "== null" catches BOTH "null" and "undefined" in a single check.
// 2. This is handy for "has this value never been set OR explicitly cleared?" checks.
// 3. Without this trick you'd need: userInput === null || userInput === undefined


// ---------------- EXAMPLE 3: Weird coercion traps (why === wins) ----------------
// What this shows: "==" has surprising, hard-to-remember edge cases.
console.log([] == false);        // true  -> [] becomes "" (empty string) becomes 0, false becomes 0
console.log("" == 0);            // true  -> "" becomes 0
console.log([] == "");           // true  -> [] becomes ""
console.log(null == undefined);  // true  -> special rule (see Example 2)
console.log(NaN == NaN);         // false -> NaN is never equal to anything, even itself

// The strict, predictable versions:
console.log([] === false);       // false
console.log("" === 0);           // false
console.log(Number.isNaN(NaN));  // true -> correct way to check for NaN

// WORKFLOW:
// 1. Arrays/objects get converted to primitives (string/number) before "==" compares them.
// 2. This chain of conversions is why "==" results feel random if you don't memorize the rules.
// 3. Using "===" removes the guesswork -> this is why style guides (and React/Node code) enforce it.
