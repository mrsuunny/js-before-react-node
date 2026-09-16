/*
=====================================================
TOPIC: Destructuring
=====================================================
DEFINITION:
- Destructuring is a syntax that lets you "unpack" values from
  arrays or properties from objects into separate variables in
  one line, instead of accessing them one by one.

USAGE:
- Pulling specific fields out of API response objects.
- Grabbing props inside a React component: function Card({ title, price }) {}
- Swapping variables, returning multiple values from a function,
  giving default values to missing data.
=====================================================
*/

// ---------------- EXAMPLE 1: Object destructuring ----------------
// What this shows: pulling named properties out of an object.
const user = { name: "Sanaullah", age: 22, city: "Lahore" };

const { name, age } = user; // pick only what we need
console.log(name); // "Sanaullah"
console.log(age);  // 22

// Renaming while destructuring:
const { age: myAge } = user;
console.log(myAge); // 22

// Default value if the property doesn't exist:
const { country = "Pakistan" } = user;
console.log(country); // "Pakistan" -> user.country was undefined, so default kicks in

// WORKFLOW:
// 1. JS looks at the object on the right (`user`).
// 2. For each key named on the left ({ name, age }), it copies that property's value
//    into a new variable of the SAME name.
// 3. If the key is missing, the variable gets `undefined` unless you give a default (= value).


// ---------------- EXAMPLE 2: Array destructuring ----------------
// What this shows: unpacking array items by POSITION, not name.
const colors = ["red", "green", "blue"];

const [first, second] = colors;
console.log(first);  // "red"
console.log(second); // "green"

// Skipping an item with a comma:
const [, , third] = colors;
console.log(third); // "blue"

// Swapping two variables in one line (classic use case):
let a = 1;
let b = 2;
[a, b] = [b, a];
console.log(a, b); // 2 1

// WORKFLOW:
// 1. Array destructuring matches by INDEX/ORDER (0, 1, 2...), unlike object destructuring
//    which matches by KEY NAME.
// 2. [a, b] = [b, a] works because the right side [b, a] is fully evaluated into a
//    temporary array BEFORE any assignment happens, so no value gets overwritten early.


// ---------------- EXAMPLE 3: Nested destructuring + function parameters ----------------
// What this shows: destructuring straight in a function signature (very common in React).
const product = {
  title: "Laptop",
  price: 1200,
  specs: { ram: "16GB", storage: "512GB" }
};

// Nested: pull `ram` out of the inner `specs` object directly
const { specs: { ram } } = product;
console.log(ram); // "16GB"

// Destructuring inside a function parameter (this is EXACTLY how React props work):
function printProduct({ title, price }) {
  console.log(`${title} costs $${price}`);
}
printProduct(product); // "Laptop costs $1200"

// WORKFLOW:
// 1. When `printProduct(product)` runs, JS destructures the incoming argument object
//    immediately, before the function body even runs.
// 2. Inside the function, `title` and `price` are already plain local variables.
// 3. React does this constantly: function Card({ title, price }) { ... } is just
//    destructuring the single `props` object argument.
