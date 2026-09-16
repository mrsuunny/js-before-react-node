/*
=====================================================
TOPIC: The Event Loop (Microtasks vs Macrotasks)
=====================================================
DEFINITION:
- JS runs on a SINGLE thread — it can only do one thing at a time.
- The Event Loop is what allows async behavior anyway: it keeps
  checking "is the main code finished? if so, is there queued
  work waiting to run?" and runs that queued work next.
- There are TWO queues of "waiting work":
  1. Microtask queue: Promise .then()/.catch()/.finally() callbacks,
     async/await continuations. HIGHER priority.
  2. Macrotask (a.k.a. "task") queue: setTimeout, setInterval, I/O.
     LOWER priority.
- Rule: after each single macrotask, JS drains the ENTIRE microtask
  queue before touching the next macrotask.

USAGE:
- Explains WHY promises sometimes appear to "jump ahead" of timers,
  and is essential for reasoning about ordering bugs in async code.
=====================================================
*/

// ---------------- EXAMPLE 1: Synchronous code always runs first ----------------
// What this shows: ALL synchronous code finishes before ANY async callback runs.
console.log("1: sync");
setTimeout(() => console.log("4: setTimeout (macrotask)"), 0);
Promise.resolve().then(() => console.log("3: promise (microtask)"));
console.log("2: sync");
// Actual order: 1, 2, 3, 4

// WORKFLOW:
// 1. Both console.log("1"/"2") run immediately — they're plain synchronous code.
// 2. setTimeout and Promise.resolve().then() both just SCHEDULE their callbacks;
//    they don't run yet, no matter how "fast" their delay is.
// 3. Once the synchronous code (the whole script, top to bottom) finishes,
//    the event loop checks microtasks FIRST (the promise), THEN macrotasks (the timer).


// ---------------- EXAMPLE 2: Microtasks (Promises) beat Macrotasks (setTimeout) ----------------
// What this shows: even a 0ms setTimeout loses to a Promise callback.
console.log("start");

setTimeout(() => console.log("timeout 1"), 0);

Promise.resolve()
  .then(() => console.log("promise 1"))
  .then(() => console.log("promise 2")); // a SECOND microtask, chained onto the first

setTimeout(() => console.log("timeout 2"), 0);

console.log("end");
// Actual order: start, end, promise 1, promise 2, timeout 1, timeout 2

// WORKFLOW:
// 1. "start" and "end" run first (synchronous).
// 2. Once the main script finishes, the event loop drains the ENTIRE microtask
//    queue before moving on — so BOTH "promise 1" and "promise 2" run before
//    EITHER timeout, even though the promise chain was written interleaved with the timeouts.
// 3. Only after microtasks are fully empty does it move to the macrotask queue,
//    running "timeout 1" then "timeout 2" in the order they were scheduled.


// ---------------- EXAMPLE 3: async/await is just microtasks in disguise ----------------
// What this shows: `await` pauses using the SAME microtask queue as .then().
async function asyncFn() {
  console.log("A: inside asyncFn, before await");
  await null; // pausing here queues the REST of this function as a microtask
  console.log("C: inside asyncFn, after await");
}

console.log("1: script start");
asyncFn();
console.log("2: script end");
// Actual order: 1, A, 2, C

// WORKFLOW:
// 1. Calling asyncFn() runs it immediately UP TO the first `await` — so "A" logs
//    right away, synchronously, before "2".
// 2. `await null` pauses the function and schedules everything AFTER it ("C") as
//    a microtask, then IMMEDIATELY returns control back to whoever called asyncFn().
// 3. That's why "2: script end" (still in the main synchronous code) logs BEFORE "C" —
//    "C" only runs once the main script finishes and the microtask queue is processed.
