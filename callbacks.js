/*
=====================================================
TOPIC: Callbacks & The Event Loop (Async JS, Part 1)
=====================================================
DEFINITION:
- A callback is a function passed INTO another function, to be
  called LATER (either immediately, or after some delay/event).
- The Event Loop is the mechanism that lets JS (which runs on a
  SINGLE thread) handle things like timers/network requests
  without freezing: slow work is handed off, and when it's done,
  its callback is queued to run once the current code finishes.
- "Callback Hell" refers to deeply nested callbacks that become
  hard to read — this is the exact problem Promises were made to fix.

USAGE:
- Understanding this is the foundation for Promises/async-await,
  which you WILL use constantly in Node.js and React.
=====================================================
*/

// ---------------- EXAMPLE 1: Synchronous vs Asynchronous callback ----------------
// What this shows: some callbacks run immediately, others run LATER.
function runNow(callback) {
  console.log("A");
  callback(); // called immediately, synchronously
  console.log("C");
}
runNow(() => console.log("B"));
// Logs in order: A, B, C  -> fully predictable, top to bottom

console.log("--- now the async version ---");

console.log("1: start");
setTimeout(() => {
  console.log("3: this runs LATER, after the timer");
}, 0); // even with 0ms delay, this is NOT immediate
console.log("2: end of script");
// Logs in order: "1: start", "2: end of script", "3: this runs LATER..."

// WORKFLOW:
// 1. runNow() calls its callback directly, in the middle of its own execution -> synchronous.
// 2. setTimeout hands its callback to the browser/Node "timer" system and moves on
//    immediately (it does NOT wait), so "2: end of script" logs before the timer fires.
// 3. Only after ALL synchronous code finishes does the Event Loop pick up the
//    timer's callback and run it — this is why "3" logs last, even with a 0ms delay.


// ---------------- EXAMPLE 2: A callback-based "fake" async operation ----------------
// What this shows: the classic pattern before Promises existed (still used in some Node APIs).
function fetchUserById(id, callback) {
  console.log(`Fetching user ${id}...`);
  setTimeout(() => {
    const fakeUser = { id, name: "Sanaullah" };
    callback(null, fakeUser); // convention: callback(error, result)
  }, 500);
}

fetchUserById(1, (error, user) => {
  if (error) {
    console.log("Something went wrong:", error);
    return;
  }
  console.log("Got user:", user); // runs ~500ms later
});
console.log("This logs BEFORE 'Got user' because fetchUserById doesn't block.");

// WORKFLOW:
// 1. fetchUserById starts a 500ms timer and returns immediately — it does NOT wait
//    for the timer, so the line right after the call runs first.
// 2. After ~500ms, the Event Loop runs the timer's callback, which calls OUR callback
//    with (null, fakeUser) — null means "no error" by convention.
// 3. This (error, result) callback signature is the classic Node.js pattern, and it's
//    exactly the pain point Promises/async-await were designed to remove.


// ---------------- EXAMPLE 3: Callback hell (why nesting gets messy) ----------------
// What this shows: chaining several async steps with callbacks nests deeper and deeper.
function step1(callback) {
  setTimeout(() => { console.log("Step 1 done"); callback(); }, 100);
}
function step2(callback) {
  setTimeout(() => { console.log("Step 2 done"); callback(); }, 100);
}
function step3(callback) {
  setTimeout(() => { console.log("Step 3 done"); callback(); }, 100);
}

step1(() => {
  step2(() => {
    step3(() => {
      console.log("All steps finished!");
      // Imagine 3 more steps here -> the indentation would keep growing sideways ("pyramid of doom")
    });
  });
});

// WORKFLOW:
// 1. step1 must fully finish (after its own 100ms timer) before it calls its callback,
//    which is where step2 gets STARTED.
// 2. Each step is nested INSIDE the previous one's callback, because that's the only
//    place we can guarantee the previous step has finished.
// 3. This nesting is called "callback hell" — readable for 3 steps, unreadable for 10.
//    See promises.js and asyncawait.js for how modern JS solves this exact problem.
