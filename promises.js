/*
=====================================================
TOPIC: Promises (Async JS, Part 2)
=====================================================
DEFINITION:
- A Promise is an object representing a value that ISN'T ready
  yet, but will be at some point (or will fail). It has 3 states:
  1. pending   -> still working
  2. fulfilled -> succeeded, has a result value
  3. rejected  -> failed, has an error reason
- Once a Promise settles (fulfilled or rejected), it NEVER changes
  state again.
- `.then()` runs when it succeeds, `.catch()` runs when it fails,
  `.finally()` runs either way.

USAGE:
- Every modern async operation in Node.js/React (fetch, database
  calls, file reads) returns a Promise instead of using raw callbacks.
=====================================================
*/

// ---------------- EXAMPLE 1: Creating and consuming a basic Promise ----------------
// What this shows: the 3 states of a Promise, and how to react to them.
function checkAge(age) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (age >= 18) {
        resolve(`Access granted (age ${age})`); // moves to "fulfilled"
      } else {
        reject(new Error(`Access denied (age ${age})`)); // moves to "rejected"
      }
    }, 300);
  });
}

checkAge(22)
  .then((message) => console.log("Success:", message)) // runs if resolved
  .catch((error) => console.log("Failure:", error.message)); // runs if rejected

checkAge(15)
  .then((message) => console.log("Success:", message))
  .catch((error) => console.log("Failure:", error.message));

// WORKFLOW:
// 1. `new Promise((resolve, reject) => {...})` runs the given function IMMEDIATELY,
//    but the resolve/reject calls inside the setTimeout happen 300ms later.
// 2. calling resolve(value) settles the promise as "fulfilled" with that value.
// 3. calling reject(error) settles it as "rejected" with that error.
// 4. `.then()` is queued to run only once the promise resolves; `.catch()` only if it rejects.


// ---------------- EXAMPLE 2: Chaining .then() to avoid callback hell ----------------
// What this shows: each .then() returns a NEW promise, so you can chain steps FLAT
// instead of nesting them (compare with callbacks.js Example 3).
function step(name, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`${name} done`);
      resolve(name);
    }, delay);
  });
}

step("Step 1", 100)
  .then(() => step("Step 2", 100))
  .then(() => step("Step 3", 100))
  .then(() => console.log("All steps finished!"))
  .catch((err) => console.log("Something failed:", err)); // catches error from ANY step above

// WORKFLOW:
// 1. step("Step 1", 100) returns a promise; `.then()` waits for it to resolve.
// 2. Inside that `.then()`, we return ANOTHER promise (step("Step 2", ...)) —
//    returning a promise from `.then()` makes the CHAIN wait for it too.
// 3. This keeps the code flat (one line per step) instead of nesting deeper each time.
// 4. A single `.catch()` at the end catches a failure from ANY step in the whole chain.


// ---------------- EXAMPLE 3: Promise.all (running things in PARALLEL) ----------------
// What this shows: waiting for multiple independent promises at once, instead of one-by-one.
function fetchData(name, delay) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`${name} data`), delay);
  });
}

const startTime = Date.now();
Promise.all([
  fetchData("Users", 300),
  fetchData("Posts", 200),
  fetchData("Comments", 400)
]).then((results) => {
  console.log(results); // ["Users data", "Posts data", "Comments data"]
  console.log(`Took ~${Date.now() - startTime}ms`); // ~400ms, NOT 900ms (300+200+400)
});

// Promise.all rejects entirely if ANY promise rejects:
Promise.all([
  fetchData("Good", 100),
  Promise.reject(new Error("Bad request"))
])
  .then((results) => console.log(results)) // never runs
  .catch((err) => console.log("Promise.all failed:", err.message)); // "Bad request"

// WORKFLOW:
// 1. All 3 fetchData() calls START at the same time (they're not waiting on each other).
// 2. Promise.all() waits for ALL of them to finish, then resolves with an array of
//    results IN THE SAME ORDER they were passed in — total time = the SLOWEST one (~400ms),
//    not the sum of all delays.
// 3. If even ONE promise in the array rejects, Promise.all immediately rejects too,
//    skipping straight to .catch(), even if the others were still pending.
