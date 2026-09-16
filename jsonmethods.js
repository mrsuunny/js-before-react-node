/*
=====================================================
TOPIC: JSON.stringify() and JSON.parse()
=====================================================
DEFINITION:
- JSON (JavaScript Object Notation) is a TEXT-based data format
  used to send/receive/store structured data (looks like JS
  objects, but is a plain STRING).
- JSON.stringify(value): converts a JS object/array INTO a JSON
  string. Used before SENDING data (to an API, to localStorage).
- JSON.parse(jsonString): converts a JSON string BACK INTO a real
  JS object/array. Used after RECEIVING data.

USAGE:
- Every API request/response body in Node.js/React apps.
- Saving structured data to localStorage (which only stores strings).
- Deep-copying simple data (a common quick trick, with limits).
=====================================================
*/

// ---------------- EXAMPLE 1: Basic stringify + parse round trip ----------------
// What this shows: object -> string -> object, and that they are NOT the same thing.
const user = { name: "Sanaullah", age: 22, isStudent: false };

const jsonString = JSON.stringify(user);
console.log(jsonString);         // '{"name":"Sanaullah","age":22,"isStudent":false}'
console.log(typeof jsonString);  // "string" -> NOT an object anymore!

const parsedBack = JSON.parse(jsonString);
console.log(parsedBack);         // { name: "Sanaullah", age: 22, isStudent: false }
console.log(typeof parsedBack);  // "object"

console.log(user === parsedBack); // false -> equal CONTENT, but a completely different object

// WORKFLOW:
// 1. JSON.stringify walks through `user` and converts it into TEXT that follows
//    the JSON format (keys always in double quotes, no trailing commas, etc.).
// 2. That text is just a normal string — you could save it to a file, send it over
//    the network, or store it in localStorage.
// 3. JSON.parse reads that text back and rebuilds a real, usable JS object from it —
//    but it's a NEW object, unrelated in memory to the original `user`.


// ---------------- EXAMPLE 2: What JSON CAN'T represent (functions, undefined, etc.) ----------------
// What this shows: stringify silently DROPS things JSON has no format for.
const complexData = {
  name: "Sanaullah",
  age: undefined,               // dropped entirely
  greet: function () { return "hi"; }, // dropped entirely (functions aren't data)
  createdAt: new Date("2026-01-01"), // converted to a STRING, not a real Date anymore
  score: NaN,                   // becomes null (NaN isn't valid JSON)
};

console.log(JSON.stringify(complexData));
// '{"name":"Sanaullah","createdAt":"2026-01-01T00:00:00.000Z","score":null}'
// -> notice: age and greet are just GONE, createdAt is now plain text, NaN became null

// WORKFLOW:
// 1. JSON only understands: strings, numbers, booleans, null, plain objects, and arrays.
// 2. Anything outside that (functions, undefined, Symbols) gets silently REMOVED
//    from the output — no error, no warning, just missing.
// 3. Special objects like Date get converted to their string form, and when parsed
//    back later, they come back as a plain STRING, not a real Date object again —
//    you'd need to manually convert it with `new Date(...)` after parsing.


// ---------------- EXAMPLE 3: Practical use — localStorage + quick deep copy ----------------
// What this shows: two real, everyday uses of stringify/parse together.

// Use case A: saving/loading structured data with localStorage (browser only;
// in Node.js you'd do the same trick with a real file, e.g. fs.writeFileSync).
const cart = { items: ["Laptop", "Mouse"], total: 1225 };
// localStorage.setItem("cart", JSON.stringify(cart));           // save as string
// const savedCart = JSON.parse(localStorage.getItem("cart"));   // load back as object

// Use case B: quick-and-easy deep copy (works ONLY for simple, JSON-safe data —
// compare with structuredClone in copyingmutation.js, which is the more correct tool)
const originalNested = { name: "Sanaullah", address: { city: "Karachi" } };
const deepCopyViaJSON = JSON.parse(JSON.stringify(originalNested));

deepCopyViaJSON.address.city = "Lahore";
console.log(originalNested.address.city);   // "Karachi" -> untouched, truly separate copy
console.log(originalNested.address === deepCopyViaJSON.address); // false

// WORKFLOW:
// 1. Turning an object into a JSON string and immediately parsing it back creates
//    a fully independent copy, because parsing always builds BRAND NEW objects/arrays.
// 2. This trick is convenient but LOSES anything JSON can't represent (see Example 2) —
//    functions, undefined, Dates (as real Date objects), etc. — so it's only safe
//    for plain data (strings/numbers/booleans/nested plain objects/arrays).
// 3. For anything more complex, prefer structuredClone() (see copyingmutation.js).
