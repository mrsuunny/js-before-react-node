/*
=====================================================
TOPIC: Essential Array Methods (map, filter, reduce, find, some/every, forEach)
=====================================================
DEFINITION:
- forEach: runs a function on every item. Returns undefined (used
  purely for side effects, like logging).
- map: runs a function on every item and returns a NEW array made
  of the RETURN VALUES. Same length as the original.
- filter: runs a test function on every item and returns a NEW
  array containing only the items where the test returned true.
- reduce: "boils down" an entire array into a single value by
  running an accumulator function over each item.
- find: returns the FIRST item that passes a test (or undefined).
- some / every: return true/false — "does AT LEAST ONE item pass?"
  / "do ALL items pass?"

USAGE:
- These are used constantly in Node.js (processing data/DB results)
  and React (rendering lists with .map(), filtering UI data).
=====================================================
*/

const products = [
  { name: "Laptop", price: 1200, inStock: true },
  { name: "Mouse", price: 25, inStock: true },
  { name: "Monitor", price: 300, inStock: false },
  { name: "Keyboard", price: 45, inStock: true }
];

// ---------------- EXAMPLE 1: map + filter (the React duo) ----------------
// What this shows: transforming data (map) and narrowing data (filter).
const names = products.map((p) => p.name);
console.log(names); // ["Laptop", "Mouse", "Monitor", "Keyboard"]

const inStockOnly = products.filter((p) => p.inStock === true);
console.log(inStockOnly.map((p) => p.name)); // ["Laptop", "Mouse", "Keyboard"]

// Chaining them: filter first, then map the result
const cheapInStockNames = products
  .filter((p) => p.inStock && p.price < 100)
  .map((p) => p.name);
console.log(cheapInStockNames); // ["Mouse", "Keyboard"]

// WORKFLOW:
// 1. map() visits EVERY item, calls the callback, and puts whatever it RETURNS
//    into a new array at the same position. Original array is never changed.
// 2. filter() visits every item, calls the callback, and KEEPS the item only if
//    the callback returned something truthy (true). It builds a new, possibly shorter array.
// 3. Chaining .filter().map() works because filter() returns a real array, which
//    itself has a .map() method — this "pipeline" style is very common in React lists.


// ---------------- EXAMPLE 2: reduce (the powerful one) ----------------
// What this shows: combining an entire array into one final value.
const totalPrice = products.reduce((total, p) => total + p.price, 0);
console.log(totalPrice); // 1570

// reduce can build objects too, not just numbers:
const groupedByStock = products.reduce((groups, p) => {
  const key = p.inStock ? "available" : "unavailable";
  if (!groups[key]) groups[key] = [];
  groups[key].push(p.name);
  return groups;
}, {}); // {} is the STARTING accumulator
console.log(groupedByStock);
// { available: ["Laptop", "Mouse", "Keyboard"], unavailable: ["Monitor"] }

// WORKFLOW:
// 1. reduce(callback, startingValue) begins with `total = 0` (the 2nd argument).
// 2. For EACH item, it calls callback(total, item), and whatever it returns
//    becomes the NEW `total` for the next item.
// 3. After the last item, whatever `total` ended up as is the final result of reduce().
// 4. Same exact mechanism builds the `groupedByStock` object — the accumulator
//    just happens to be an object instead of a number.


// ---------------- EXAMPLE 3: find, some, every, forEach ----------------
// What this shows: the "search/check" family of array methods.
const firstExpensive = products.find((p) => p.price > 500);
console.log(firstExpensive); // { name: "Laptop", price: 1200, inStock: true }

const anyOutOfStock = products.some((p) => p.inStock === false);
console.log(anyOutOfStock); // true -> Monitor is out of stock

const allInStock = products.every((p) => p.inStock === true);
console.log(allInStock); // false -> not ALL are in stock

products.forEach((p) => {
  console.log(`${p.name}: $${p.price}`); // just side effects, nothing returned/collected
});

// WORKFLOW:
// 1. find() stops looping as soon as it finds the FIRST match and returns that item directly
//    (not wrapped in an array, unlike filter).
// 2. some() stops as soon as ONE item passes (returns true immediately) — short-circuits early.
// 3. every() stops as soon as ONE item FAILS (returns false immediately) — also short-circuits.
// 4. forEach() always runs the callback for every single item and always returns undefined —
//    use it only for side effects (logging, pushing to an outside variable), never to build data.
