/*
=====================================================
TOPIC: Spread (...) and Rest (...)
=====================================================
DEFINITION:
- Spread "..." EXPANDS an array/object/iterable into its
  individual elements/properties.
- Rest "..." does the OPPOSITE: it COLLECTS multiple remaining
  elements/arguments INTO a single array.
- Same three dots, opposite direction — spread "unpacks",
  rest "packs". Which one it is depends on WHERE it's used.

USAGE:
- Copying arrays/objects without mutating the original (important
  in React state updates: setState({ ...oldState, newField }))
- Merging objects/arrays.
- Functions that accept an unknown number of arguments.
=====================================================
*/

// ---------------- EXAMPLE 1: Spread to copy & merge arrays/objects ----------------
// What this shows: spread expands values out, useful for copies + merges.
const nums = [1, 2, 3];
const copyOfNums = [...nums]; // expands nums' elements into a brand new array
copyOfNums.push(4);
console.log(nums);         // [1, 2, 3]      -> original untouched
console.log(copyOfNums);   // [1, 2, 3, 4]

const person = { name: "Sanaullah", age: 22 };
const updatedPerson = { ...person, age: 23 }; // copy all fields, then override `age`
console.log(person);        // { name: "Sanaullah", age: 22 }  -> untouched
console.log(updatedPerson); // { name: "Sanaullah", age: 23 }

// WORKFLOW:
// 1. [...nums] reads each element of `nums` one by one and places it into the new array literal.
// 2. { ...person, age: 23 } copies every key from `person` first, THEN applies `age: 23`,
//    which overwrites the copied `age` because it comes later in the object literal.
// 3. This is exactly the pattern React/Redux use to update state immutably.


// ---------------- EXAMPLE 2: Spread to pass array items as function arguments ----------------
// What this shows: spreading an array out into separate arguments.
function sum3(a, b, c) {
  return a + b + c;
}
const values = [10, 20, 30];
console.log(sum3(...values)); // 60 -> same as sum3(10, 20, 30)

console.log(Math.max(...values)); // 30 -> Math.max normally takes separate args, not an array

// WORKFLOW:
// 1. sum3(...values) expands the array into individual arguments before the call is made.
// 2. It's equivalent to manually writing sum3(values[0], values[1], values[2]).


// ---------------- EXAMPLE 3: Rest to collect leftover items/arguments ----------------
// What this shows: rest gathers "everything else" into one array.
function sumAll(...numbers) { // rest parameter: collects ALL arguments into an array
  console.log(numbers); // e.g. [1, 2, 3, 4]
  return numbers.reduce((total, n) => total + n, 0);
}
console.log(sumAll(1, 2, 3, 4)); // 10

// Rest in destructuring: grab the first item, collect the rest
const [firstColor, ...restColors] = ["red", "green", "blue", "yellow"];
console.log(firstColor);  // "red"
console.log(restColors);  // ["green", "blue", "yellow"]

// WORKFLOW:
// 1. In a function signature, ...numbers must be the LAST parameter — it soaks up
//    every remaining argument into a real array (unlike the old `arguments` object).
// 2. In destructuring, ...restColors collects whatever wasn't already matched by
//    `firstColor`, again as a new array.
// 3. Rule of thumb: dots on the LEFT of an assignment/parameter list = rest (packing).
//    Dots INSIDE an array/object/call literal = spread (unpacking).
