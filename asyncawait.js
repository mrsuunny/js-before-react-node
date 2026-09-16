/*
=====================================================
TOPIC: async / await (Async JS, Part 3)
=====================================================
DEFINITION:
- `async function` automatically wraps its return value in a
  Promise, and lets you use `await` inside it.
- `await` PAUSES the function (without freezing the rest of the
  app) until the Promise it's waiting on settles, then unwraps
  the resolved value directly — no `.then()` needed.
- If the awaited promise rejects, `await` THROWS that error, so
  you catch it with a normal try/catch block.

USAGE:
- This is the modern, standard way to write async code in
  Node.js and React (e.g. fetching data, reading files, DB calls).
  It reads like normal synchronous, top-to-bottom code.
=====================================================
*/

// ---------------- EXAMPLE 1: Basic async/await vs .then() chain ----------------
// What this shows: async/await is just cleaner syntax over the same Promise mechanism.
function getUser() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id: 1, name: "Sanaullah" }), 300);
  });
}

// The .then() way (see promises.js):
getUser().then((user) => console.log("via .then():", user));

// The async/await way (same result, reads top-to-bottom):
async function loadUser() {
  const user = await getUser(); // pauses HERE until getUser()'s promise resolves
  console.log("via await:", user); // runs only after the pause ends
}
loadUser();

console.log("This still logs FIRST, before either user log — await doesn't block the whole program.");

// WORKFLOW:
// 1. Calling loadUser() starts running it, but as soon as it hits `await getUser()`,
//    it PAUSES loadUser (only loadUser, not the whole script) until that promise resolves.
// 2. The rest of the program (console.log below) keeps running immediately.
// 3. Once getUser()'s 300ms timer resolves, loadUser() resumes exactly where it paused,
//    with `user` now holding the resolved value.


// ---------------- EXAMPLE 2: Error handling with try/catch ----------------
// What this shows: awaited rejections become normal thrown errors.
function riskyOperation(shouldFail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new Error("Operation failed!"));
      else resolve("Operation succeeded!");
    }, 200);
  });
}

async function run(shouldFail) {
  try {
    const result = await riskyOperation(shouldFail); // throws if rejected
    console.log("Result:", result);
  } catch (error) {
    console.log("Caught error:", error.message);
  } finally {
    console.log("This always runs, success or failure.");
  }
}
run(false); // "Result: Operation succeeded!"
run(true);  // "Caught error: Operation failed!"

// WORKFLOW:
// 1. `await riskyOperation(shouldFail)` pauses until the promise settles.
// 2. If it RESOLVES, `await` evaluates to the resolved value, and `result` gets it.
// 3. If it REJECTS, `await` throws that rejection reason as a normal JS error, which
//    the surrounding try/catch immediately catches — same mechanism as sync errors.
// 4. `finally` runs regardless, useful for cleanup (closing a loading spinner, etc.).


// ---------------- EXAMPLE 3: Sequential vs parallel await (a common performance trap) ----------------
// What this shows: awaiting one-by-one in a loop is SLOWER than running in parallel.
function delayedValue(value, ms) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

async function sequential() {
  const start = Date.now();
  const a = await delayedValue("A", 300); // waits 300ms...
  const b = await delayedValue("B", 300); // ...THEN waits another 300ms
  const c = await delayedValue("C", 300); // ...THEN another 300ms
  console.log([a, b, c], `Sequential took ~${Date.now() - start}ms`); // ~900ms
}

async function parallel() {
  const start = Date.now();
  // Start all 3 immediately, THEN await them together (see Promise.all in promises.js)
  const [a, b, c] = await Promise.all([
    delayedValue("A", 300),
    delayedValue("B", 300),
    delayedValue("C", 300)
  ]);
  console.log([a, b, c], `Parallel took ~${Date.now() - start}ms`); // ~300ms
}

sequential();
parallel();

// WORKFLOW:
// 1. In sequential(), each `await` fully pauses and waits before even STARTING the next
//    delayedValue() call — the three 300ms delays add up to ~900ms total.
// 2. In parallel(), all three delayedValue() calls are STARTED first (Promise.all's array
//    is built by calling all of them immediately), and only THEN do we await the combined result.
// 3. Since they all run at the same time, total time is ~300ms (the slowest one),
//    not 900ms — this is a very common real-world bug/optimization to know about.
