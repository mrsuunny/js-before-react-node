/*
=====================================================
TOPIC: Copying & Mutation (Shallow vs Deep Copy)
=====================================================
DEFINITION:
- Mutation: changing the CONTENTS of an object/array in place,
  without creating a new one.
- Objects/arrays in JS are stored by REFERENCE — a variable holding
  an object doesn't hold the data itself, it holds a "pointer" to
  where that data lives in memory. Copying the variable copies the
  POINTER, not the data.
- Shallow copy: copies the TOP-LEVEL properties into a new
  object/array, but nested objects/arrays inside are still SHARED
  (same reference) with the original.
- Deep copy: copies EVERYTHING, including nested structures, so
  nothing is shared with the original at any level.

USAGE:
- CRITICAL for React: you must never mutate state directly —
  you always create a new copy so React can detect the change.
=====================================================
*/

// ---------------- EXAMPLE 1: Reference vs value — the core confusion ----------------
// What this shows: why two variables can "see" the same change.
let primitiveA = 10;
let primitiveB = primitiveA; // copies the VALUE 10
primitiveB = 20;
console.log(primitiveA); // 10 -> unaffected, primitives are copied by value

let objA = { count: 10 };
let objB = objA; // copies the REFERENCE (pointer), NOT a new object
objB.count = 20;
console.log(objA.count); // 20 -> changed too! objA and objB point to the SAME object

console.log(objA === objB); // true -> same object in memory

// WORKFLOW:
// 1. `primitiveB = primitiveA` copies the raw number 10 into a totally separate slot.
//    Changing primitiveB later has zero effect on primitiveA.
// 2. `objB = objA` copies the ADDRESS of the object, not the object itself.
//    objA and objB are two different labels pointing at the exact SAME data in memory.
// 3. This is why `objB.count = 20` is visible through objA too — there's only ONE object.


// ---------------- EXAMPLE 2: Shallow copy (spread / Object.assign / slice) ----------------
// What this shows: shallow copy fixes Example 1's top-level problem, but has a nested gotcha.
const original = {
  name: "Sanaullah",
  address: { city: "Karachi", zip: "74400" } // nested object
};

const shallowCopy = { ...original }; // top-level copy (see spreadrest.js)
shallowCopy.name = "Sunny"; // safe: top-level primitive, doesn't affect original
console.log(original.name);      // "Sanaullah" -> untouched
console.log(shallowCopy.name);   // "Sunny"

shallowCopy.address.city = "Lahore"; // DANGER: `address` is a nested object, still SHARED
console.log(original.address.city);  // "Lahore" -> original got mutated too!
console.log(original.address === shallowCopy.address); // true -> same nested object

// WORKFLOW:
// 1. `{ ...original }` creates a NEW top-level object, and copies `name` (a primitive,
//    genuinely independent) and `address` (a REFERENCE to the same nested object).
// 2. Changing `shallowCopy.name` is safe because strings are primitives — truly duplicated.
// 3. Changing `shallowCopy.address.city` is NOT safe — `address` itself was never
//    duplicated, only its reference was copied, so both objects still point to one address object.


// ---------------- EXAMPLE 3: Deep copy (structuredClone) + why React cares about this ----------------
// What this shows: a true deep copy, and the React-relevant mutation bug it prevents.
const originalDeep = {
  name: "Sanaullah",
  address: { city: "Karachi", zip: "74400" }
};

const deepCopy = structuredClone(originalDeep); // built-in deep clone (modern JS/Node)
deepCopy.address.city = "Lahore";
console.log(originalDeep.address.city); // "Karachi" -> untouched this time!
console.log(originalDeep.address === deepCopy.address); // false -> genuinely different objects

// The React-relevant lesson: NEVER mutate state directly.
function wrongWay(state) {
  state.items.push("new item"); // mutates the ORIGINAL array in place
  return state; // React can't tell this is "new" -> it looks like the same reference
}
function rightWay(state) {
  return { ...state, items: [...state.items, "new item"] }; // builds a brand new object + array
}

const appState = { items: ["a", "b"] };
const afterWrong = wrongWay(appState);
console.log(appState === afterWrong); // true -> SAME reference, React would skip re-rendering!

const afterRight = rightWay(appState);
console.log(appState === afterRight); // false -> DIFFERENT reference, React detects the change

// WORKFLOW:
// 1. structuredClone() recursively copies EVERY nested level, so the clone shares
//    NOTHING with the original — safe to mutate freely without side effects.
// 2. wrongWay() mutates the array that ALREADY existed, so the returned object is
//    literally the same object in memory (`===` is true) — React's change detection
//    (which just compares old vs new reference) would think "nothing changed."
// 3. rightWay() builds fresh objects/arrays every time (spread), guaranteeing a NEW
//    reference whenever data actually changes — this is exactly the pattern React
//    state updates (useState, Redux reducers) require.
