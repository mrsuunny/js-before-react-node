/*
=====================================================
TOPIC: Closures
=====================================================
DEFINITION:
- A closure is a function that "remembers" the variables from the
  scope it was CREATED in, even after that outer scope has finished
  running. The inner function keeps a live link to those variables
  instead of a snapshot/copy.

USAGE:
- Private variables / data hiding (counters, caches).
- Function factories (functions that generate customized functions).
- This is the mechanism behind React's `useState` and event handlers
  that "remember" a value between renders.
=====================================================
*/

// ---------------- EXAMPLE 1: Basic closure — remembering after the outer function ends ----------------
// What this shows: `inner` still has access to `message` even after `outer()` has already returned.
function outer() {
  const message = "I remember you!";
  function inner() {
    console.log(message); // uses `message` from outer's scope
  }
  return inner;
}

const rememberedFn = outer(); // outer() runs and FINISHES, returning `inner`
rememberedFn(); // "I remember you!" -> message still accessible, even though outer() is done

// WORKFLOW:
// 1. When outer() runs, it creates `message` and the function `inner`.
// 2. outer() returns `inner` and then normally its local scope would be thrown away.
// 3. BUT because `inner` references `message`, JS keeps that variable alive in memory,
//    attached to `inner` — this bundle of "function + remembered variables" is the closure.


// ---------------- EXAMPLE 2: Private counter (data hiding) ----------------
// What this shows: closures let you create variables that can ONLY be changed
// through specific functions — true "private" state.
function createCounter() {
  let count = 0; // not accessible from outside directly
  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getValue() {
      return count;
    }
  };
}

const counterA = createCounter();
const counterB = createCounter(); // a SEPARATE, independent closure

console.log(counterA.increment()); // 1
console.log(counterA.increment()); // 2
console.log(counterB.increment()); // 1 -> counterB has its own `count`, unaffected by counterA
console.log(counterA.getValue());  // 2

// WORKFLOW:
// 1. Each call to createCounter() creates a NEW `count` variable and a new set of functions
//    that close over THAT specific `count`.
// 2. counterA and counterB never share state — they are two independent closures.
// 3. There is no way to reach `count` from outside except through increment/decrement/getValue —
//    this is how JS simulates "private" variables without a special keyword.


// ---------------- EXAMPLE 3: Function factory + the classic var-in-a-loop trap ----------------
// What this shows: closures capture VARIABLES, not values — this causes a famous bug with `var`.
function multiplyBy(factor) {
  return function (n) {
    return n * factor; // closes over `factor`
  };
}
const double = multiplyBy(2);
const triple = multiplyBy(3);
console.log(double(5)); // 10
console.log(triple(5)); // 15

// The classic bug:
const fnsWithVar = [];
for (var i = 0; i < 3; i++) {
  fnsWithVar.push(function () {
    console.log(i); // closes over the SAME shared `i` (var is function/global scoped)
  });
}
fnsWithVar[0](); // 3 -> not 0! all three closures share the one final `i`
fnsWithVar[1](); // 3
fnsWithVar[2](); // 3

// The fix using `let` (block scoped -> a NEW `i` per loop iteration):
const fnsWithLet = [];
for (let j = 0; j < 3; j++) {
  fnsWithLet.push(function () {
    console.log(j); // each closure gets its OWN `j`
  });
}
fnsWithLet[0](); // 0
fnsWithLet[1](); // 1
fnsWithLet[2](); // 2

// WORKFLOW:
// 1. multiplyBy(2) and multiplyBy(3) each create a SEPARATE `factor` variable, so
//    `double` and `triple` behave independently — this is a "function factory".
// 2. In the `var` loop, there is only ONE `i` for the entire loop (var is not block-scoped).
//    All 3 pushed functions close over that SAME `i`, so by the time they run, `i` is already 3.
// 3. `let` creates a FRESH binding of `j` for every single loop iteration, so each closure
//    captures its own separate `j` — this is why `let` is preferred in loops.
