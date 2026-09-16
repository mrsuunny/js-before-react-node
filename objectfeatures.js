/*
=====================================================
TOPIC: Modern Object Features
(shorthand, computed keys, optional chaining, nullish coalescing)
=====================================================
DEFINITION:
- Property shorthand: `{ name }` instead of `{ name: name }` when
  the variable name and key name match.
- Computed property keys: `{ [expression]: value }` — lets you use
  a variable or expression AS the key name.
- Optional chaining `?.`: safely reads a nested property WITHOUT
  crashing if something along the way is null/undefined.
- Nullish coalescing `??`: gives a fallback value ONLY when the
  left side is null or undefined (unlike `||`, which also falls
  back on 0, "", false).

USAGE:
- Optional chaining: reading nested API response data that might
  be missing (very common in real apps).
- Nullish coalescing: setting default values without accidentally
  overriding legitimate 0/""/false values.
=====================================================
*/

// ---------------- EXAMPLE 1: Property shorthand + computed keys ----------------
// What this shows: shorter object creation syntax.
const name = "Sanaullah";
const age = 22;

// Old way: const user = { name: name, age: age };
const user = { name, age }; // shorthand: key name = variable name
console.log(user); // { name: "Sanaullah", age: 22 }

// Computed key: the key itself comes from a variable/expression
const dynamicKey = "role";
const account = {
  [dynamicKey]: "admin",       // key becomes "role"
  [`${dynamicKey}Level`]: 5    // key becomes "roleLevel"
};
console.log(account); // { role: "admin", roleLevel: 5 }

// WORKFLOW:
// 1. `{ name, age }` is expanded by JS into `{ name: name, age: age }` automatically.
// 2. `[dynamicKey]` inside {} tells JS "evaluate this expression FIRST, then use the
//    result as the property key" — instead of literally naming the key "dynamicKey".


// ---------------- EXAMPLE 2: Optional chaining (?.) ----------------
// What this shows: safely accessing deeply nested data that might not exist.
const apiResponse1 = { user: { profile: { city: "Karachi" } } };
const apiResponse2 = { user: {} }; // profile is missing here
const apiResponse3 = null; // whole response missing (e.g. failed request)

console.log(apiResponse1.user?.profile?.city); // "Karachi" -> full path exists
console.log(apiResponse2.user?.profile?.city); // undefined -> stops safely at missing `profile`

// Without optional chaining this would throw:
// console.log(apiResponse2.user.profile.city); // ❌ TypeError: Cannot read properties of undefined

console.log(apiResponse3?.user?.profile?.city); // undefined -> stops safely, no crash

// Optional chaining also works for calling methods that might not exist:
const obj = { greet: null };
console.log(obj.greet?.()); // undefined -> doesn't try to CALL null, just skips it

// WORKFLOW:
// 1. `?.` checks: "is the thing on the left null or undefined?"
// 2. If YES, the WHOLE expression short-circuits immediately to `undefined` —
//    it never attempts to read further properties (which would normally crash).
// 3. If NO, it continues reading the next `.property` normally.


// ---------------- EXAMPLE 3: Nullish coalescing (??) vs || ----------------
// What this shows: why `??` is safer than `||` for default values.
const settings1 = { volume: 0, name: "" , theme: null };

// Using || (WRONG for falsy-but-valid values like 0 or ""):
console.log(settings1.volume || 50);  // 50 -> BUG! 0 is a valid volume, but || treats it as "empty"
console.log(settings1.name || "Guest"); // "Guest" -> BUG! "" was intentional, but got overridden

// Using ?? (CORRECT — only falls back on null/undefined):
console.log(settings1.volume ?? 50);   // 0  -> correctly keeps the real value 0
console.log(settings1.name ?? "Guest"); // "" -> correctly keeps the real empty string
console.log(settings1.theme ?? "light"); // "light" -> theme WAS null, so fallback applies correctly

// WORKFLOW:
// 1. `||` falls back whenever the left side is ANY "falsy" value: 0, "", false, null, undefined, NaN.
// 2. `??` only falls back when the left side is SPECIFICALLY null or undefined —
//    it treats 0, "", and false as perfectly valid, real values.
// 3. Rule of thumb: use `??` for default values, use `||` only when you truly want
//    ANY falsy value replaced.
