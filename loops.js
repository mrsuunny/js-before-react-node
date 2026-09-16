/*
=====================================================
TOPIC: Loops (for, while, break, continue)
=====================================================
DEFINITION:
- for loop: repeats code a KNOWN number of times, controlled by
  three parts — (start; condition; step) — all in one line.
- while loop: repeats code as long as a condition stays true.
  Better when you DON'T know the exact number of repeats ahead of time.
- break: immediately EXITS the loop entirely, skipping everything
  left in it and everything after it in that iteration.
- continue: skips ONLY the rest of the CURRENT iteration, then jumps
  straight to the next one (loop keeps going).

USAGE:
- for: iterating a fixed range, arrays by index.
- while: repeating until some external condition changes (waiting
  for input, processing until a value is found).
- break/continue: filtering out cases inside a loop without wrapping
  the rest of the loop body in an if/else.
=====================================================
*/

// Prctice for Loops in JavaScript for Arrays

// print numbers from 1 to 10 using a for loop

// for (let i = 1; i < 11; i++){
//     console.log(i);
// }

// WORKFLOW:
// 1. `let i = 1` runs ONCE, before the loop starts.
// 2. Before EVERY iteration, `i < 11` is checked — if true, the loop body runs.
// 3. AFTER every iteration, `i++` runs, then the condition is checked again.
// 4. Once `i` reaches 11, `i < 11` is false, and the loop stops — never running with i = 11.


// print numbers for 10 to 1 using a while loop

// let i = 10;
// while(i >= 1){
//     console.log(i);
//     i--;
// }

// WORKFLOW:
// 1. Unlike `for`, the counter (`i`) has to be declared BEFORE the loop and updated
//    (`i--`) manually INSIDE the loop body — `while` has no built-in "step" slot.
// 2. The condition `i >= 1` is checked before each run; once `i` becomes 0, it stops.
// 3. Forgetting `i--` here would cause an infinite loop — a common `while` pitfall
//    that `for` loops are less likely to have since the step is right there in the header.


// print even numbers from 1 to 20 using a for loop

// for (let i = 1; i <=20; i++){
//     if(i % 2 === 0){
//         console.log(i);
//     }
// }

// WORKFLOW:
// 1. The loop still visits EVERY number from 1 to 20, one at a time.
// 2. `i % 2 === 0` (remainder of i/2) is only true for even numbers — so the `console.log`
//    inside the `if` only actually runs on those, silently skipping odd ones.


// print odd numbers from 1 to 15 using a while loop

// let i = 1;
// while (i <= 15){
//     if(i % 2 !== 0){
//         console.log(i);
//     }
//     i++;
// }

// WORKFLOW:
// 1. Same filtering idea as the even-number example above, just with `while` syntax
//    and the opposite condition (`!== 0` -> remainder is NOT zero -> odd).
// 2. `i++` still has to run on EVERY iteration (even the ones that don't log), otherwise
//    `i` never changes and the loop never ends.


// print the multiplication table of 5 using a for loop

// for (let i = 1; i <= 50; i++){
//     if(i % 5 ===0){
//         console.log("5 x " + (i/5) + " = " + i);
//     }
// }

// WORKFLOW:
// 1. This loop actually runs 50 times total, but only logs when `i` is a multiple of 5
//    (5, 10, 15, ... 50) — a slightly roundabout way to build a "5 x n = result" table.
// 2. `i / 5` recovers which multiple we're on (e.g. when i=15, i/5=3, so it prints "5 x 3 = 15").
// 3. A more direct approach would be `for (let n = 1; n <= 10; n++) { console.log("5 x " + n + " = " + 5*n) }` —
//    same result, without needing the `if` filter at all.


// find the sum of numbers from 1 to 100 using a loop
// for loop

// let sum = 0;
// for (let i = 1; i <= 100; i++){
//     sum += i;
// }
// console.log(sum);

// while loop

// let temp = 0;
// let j = 1;
// while (j <= 100){
//     temp += j;
//     j++;
// }
// console.log(temp);

// WORKFLOW (both versions above):
// 1. `sum`/`temp` are "accumulators" — variables declared OUTSIDE the loop, updated
//    on every iteration, that carry a running total across all of them.
// 2. `sum += i` is shorthand for `sum = sum + i` — each pass adds the current i/j
//    onto whatever total has been built up so far.
// 3. Both loops produce the exact same result (5050) — `for` and `while` are
//    interchangeable here; `for` is just more compact when you already know the range.


// print all numbers from 1 to 50 that are divisible by 3

// for(let i = 1; i <= 50; i++){
//     if(i % 3 === 0){
//         console.log(i);
//     }
// }

// WORKFLOW:
// Same filtering pattern as the even/odd examples above, just checking `i % 3 === 0`
// (no remainder when divided by 3) instead.


// let val = prompt("Enter a number");

// for (let i =1; i<=100; i++){
//     if(i % 7 === 0){
//         break;
//     }
//     console.log(i);
// }

// WORKFLOW:
// 1. This loop logs 1, 2, 3, 4, 5, 6 — then STOPS completely the instant `i` becomes 7.
// 2. `break` doesn't just skip logging 7 — it exits the ENTIRE loop immediately,
//    so 8, 9, ... 100 never even get checked, unlike `continue` below.


// for (let i = 1; i <= 30; i++){
//     if(i % 3 === 0){
//         continue;
//     }
//     console.log(i);
// }

// WORKFLOW:
// 1. This loop logs every number from 1 to 30 EXCEPT multiples of 3 (3, 6, 9, ...).
// 2. `continue` skips only the rest of THAT ONE iteration (the console.log below it),
//    then the loop moves on normally to i+1 — unlike `break`, it does NOT stop the loop.


// let count = 0;
// for(let i = 1; i <= 100; i++){
//     if(i % 2 === 0) continue;
//     count++;
//     console.log(i);
//     if( count === 5) break;
// }

// WORKFLOW:
// 1. `if (i % 2 === 0) continue;` skips every even number entirely (count/log never run for them).
// 2. For odd numbers, `count` increments and the number is logged.
// 3. Once 5 odd numbers have been logged (`count === 5`, i.e. after logging 1,3,5,7,9),
//    `break` stops the whole loop immediately — even though `i` has only reached 9,
//    nowhere near 100.
// 4. This combo (continue to FILTER + break to LIMIT how many results you want) is a
//    very common real-world loop pattern.


let calculateArea = (width, height) => {
    return width * height;
}
console.log(calculateArea(5, 4)); // 20

// WORKFLOW:
// 1. This isn't a loop — it's an arrow function (see functiontypes.js) that takes
//    `width` and `height` and returns their product.
// 2. It's left here uncommented as a leftover/scratch line; calling it with (5, 4)
//    confirms it works: 5 * 4 = 20.
