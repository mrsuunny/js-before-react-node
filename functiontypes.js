/*
=====================================================
TOPIC: Function Declarations vs Expressions vs Arrow Functions
=====================================================
DEFINITION:
- Function Declaration: `function name() {}` — a named, standalone
  statement. It is HOISTED (usable before its line in the file).
- Function Expression: `const name = function() {}` — a function
  stored in a variable. NOT hoisted (the variable exists but is
  undefined/uninitialized until this line runs).
- Arrow Function: `const name = () => {}` — shorter syntax, and
  crucially, it does NOT have its own `this` (see this.js) — it
  uses `this` from the surrounding scope instead.

USAGE:
- Declarations: general reusable functions, especially ones called
  before they're defined further down the file.
- Expressions/Arrows: callbacks, array method callbacks (map/filter),
  anywhere you want to avoid `this` rebinding issues.
=====================================================
*/

// ---------------- EXAMPLE 1: Hoisting difference ----------------
// What this shows: declarations can be called before they appear; expressions can't.
console.log(greetDeclared()); // "Hi!" -> WORKS even though called before definition below

function greetDeclared() {
  return "Hi!";
}

try {
  console.log(greetExpressed()); // throws
} catch (e) {
  console.log(e.message); // "greetExpressed is not a function" (it's undefined at this point)
}
var greetExpressed = function () {
  return "Hello!";
};

// WORKFLOW:
// 1. During the "hoisting" phase, JS scans the file and fully registers function
//    DECLARATIONS in memory before any code runs — so calling them early works.
// 2. `var greetExpressed` is hoisted too, but only the VARIABLE, not its value.
//    Its value (the function) is only assigned when execution reaches that line,
//    so calling it earlier fails.


// ---------------- EXAMPLE 2: Arrow function `this` behavior ----------------
// What this shows: arrow functions inherit `this` from where they're WRITTEN, not
// from how they're CALLED (unlike regular functions — see this.js for the regular case).
const timer = {
  seconds: 0,
  // Regular function as a method: `this` = the object that calls it (`timer`)
  startRegular() {
    setTimeout(function () {
      // BUG: inside a plain function passed to setTimeout, `this` is NOT `timer`
      console.log(this === timer); // false
    }, 10);
  },
  // Arrow function: `this` is captured from `startArrow`'s scope, which IS `timer`
  startArrow() {
    setTimeout(() => {
      console.log(this === timer); // true -> arrow "inherited" this from startArrow
    }, 10);
  }
};
timer.startRegular();
timer.startArrow();

// WORKFLOW:
// 1. `startRegular` calls `setTimeout` with a plain function. When that function
//    eventually runs, JS calls it with no specific owner, so `this` defaults away from `timer`.
// 2. `startArrow` calls `setTimeout` with an ARROW function. Arrow functions never set
//    their own `this` — they just reuse whatever `this` was in `startArrow` (which is `timer`).
// 3. This is exactly why arrow functions are preferred for callbacks inside methods.


// ---------------- EXAMPLE 3: Higher-order function (function that takes/returns a function) ----------------
// What this shows: functions as values — passed in and returned out.
function withLogging(fn) {          // takes a function as an argument
  return function (...args) {       // returns a brand NEW function
    console.log(`Calling with args:`, args);
    const result = fn(...args);
    console.log(`Result:`, result);
    return result;
  };
}

function add(a, b) {
  return a + b;
}

const loggedAdd = withLogging(add); // wrap `add` with logging behavior
loggedAdd(2, 3);
// Logs: "Calling with args: [2, 3]"
// Logs: "Result: 5"

// WORKFLOW:
// 1. `withLogging(add)` runs, capturing `add` in a closure (see closures.js) and
//    returning a new wrapper function — `add` itself never runs yet.
// 2. `loggedAdd(2, 3)` calls that wrapper. It logs the args, THEN calls the real
//    `add(2, 3)` inside, logs the result, and returns it.
// 3. This "wrap a function to add behavior" pattern is the foundation of middleware
//    in Express (Node.js) and Higher-Order Components/hooks in React.
