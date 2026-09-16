// function user() {
//     name: "Sanaullah";
//     age: "22";
// }

// function Hi() {
//     alert("Hello");
// }

// user.Hi = Hi;
// user.Hi();

// me = user;
// console.log(me.name)

// 1.

// let me = {
//     name: "Sanaullah",
//     age: 22,
//     greet() {
//         console.log(this.age)
//     }
// }

// me.greet();

// 2.

// const obj2 = {
//   name: "Sanaullah",
//   greet() {
//     console.log(this.name);
//   }
// };
// const fn = obj2.greet();
// fn;

// 3.

// const obj3 = {
//   name: "Sanaullah",
//   greet() {
//     console.log(this.name);
//   }
// };
// obj3.greet();

// 4.

// const obj4 = {
//   name: "Sanaullah",
//   greet() {
//     setTimeout(() => {
//       console.log(this.name);
//     }, 100);
//   }
// };
// obj4.greet();

// 5.

// function Person(name) {
//   this.name = name;
// }
// const p1 = new Person("Sanaullah"); // no "new"
// console.log(p1);
// console.log(p1.name); // (run this at top level of a script)

// 6.

// function sayName() {
//   console.log(this.name);
// }
// const personA = { name: "Ali" };
// const personB = { name: "Sanaullah" };
// sayName.call(personA);
// sayName.apply(personB);
// const bound = sayName.bind(personB);
// bound();


//.........................................//


// ---------------- EXAMPLE 7: Losing `this` when a method is pulled OUT of its object ----------------
// What this shows: `this` depends on HOW a function is called, not where it was defined
// or which object it "belongs" to. This is one of the most common real-world `this` bugs.
const obj7 = {
  name: "Sanaullah",
  greet() {
    console.log(this.name);
  }
};
obj7.greet(); // "Sanaullah" -> called AS obj7.greet(), so this = obj7

const extracted = obj7.greet; // just copies the FUNCTION, the link to obj7 is gone
extracted(); // undefined -> extracted() is called with nothing in front of it, this is NOT obj7 anymore

// WORKFLOW:
// 1. `this` is decided by HOW a function is CALLED, never by where it was defined or lives.
// 2. obj7.greet() works because it's called AS obj7.greet -> this = obj7.
// 3. extracted() is called with NOTHING in front of it -> this falls back to undefined
//    (strict mode) or the global object (sloppy mode) -> this.name is not "Sanaullah".
// 4. This exact bug happens constantly with callbacks:
//    setTimeout(obj7.greet, 100) or button.addEventListener("click", obj7.greet) breaks the same way,
//    because the callback strips the object away and calls the function plain.


// ---------------- EXAMPLE 8: The fix for Example 7 -- bind() it, or wrap it in an arrow ----------------
// What this shows: two standard ways to keep `this` locked to the right object.
const obj8 = {
  name: "Sanaullah",
  greet() {
    console.log(this.name);
  }
};

const fixedWithBind = obj8.greet.bind(obj8); // permanently locks `this` to obj8
fixedWithBind(); // "Sanaullah"

const fixedWithArrow = () => obj8.greet(); // arrow just calls obj8.greet() normally when invoked
fixedWithArrow(); // "Sanaullah"

// WORKFLOW:
// 1. .bind(obj8) returns a NEW function forever locked to obj8 as `this`, no matter
//    how or where it's later called (setTimeout, event listener, anything).
// 2. The arrow wrapper doesn't "fix" this directly -- it just calls obj8.greet() the
//    NORMAL way (obj8.greet()) once it runs, so the implicit binding rule applies correctly.
// 3. Prefer bind() when you're handing the function off to be called LATER by someone else
//    (a callback); the arrow wrapper is simplest when you're calling it yourself right away.


// ---------------- EXAMPLE 9: Default binding -- what `this` is with NO object involved ----------------
// What this shows: what `this` falls back to when a function is called completely plain.
function whoAmI() {
  console.log(this === globalThis); // sloppy mode: this falls back to the global object
}
whoAmI(); // true

function whoAmIStrict() {
  "use strict";
  console.log(this); // strict mode: no fallback, this stays undefined
}
whoAmIStrict(); // undefined

// WORKFLOW:
// 1. When a function is called with NOTHING in front of it (no obj.fn(), no call/apply/bind,
//    no `new`), JS falls back to the "default binding" rule.
// 2. Sloppy mode: default binding points `this` at the global object -- a classic source
//    of bugs (accidentally reading/writing global variables through `this`).
// 3. Strict mode (and this is ALWAYS true inside ES Modules and inside classes) sets
//    `this` to undefined instead -- safer, because this.something then throws a clear
//    error immediately instead of silently touching the wrong object.


// ---------------- EXAMPLE 10: Arrow function used AS an object method ----------------
// What this shows: a common footgun -- the opposite mistake from the regular method above.
const outerThis = this; // top-level `this` here is Node's module.exports, not globalThis

const obj10 = {
  name: "Sanaullah",
  greet: () => {
    console.log(this.name); // arrow -> `this` comes from where obj10 was DEFINED, not obj10 itself
  }
};
obj10.greet(); // undefined -- NOT "Sanaullah"
console.log(this === outerThis); // true -> proves greet's `this` is the outer scope, not obj10

// WORKFLOW:
// 1. Arrow functions NEVER get their own `this` -- they always inherit it from whatever
//    `this` was in the surrounding scope at the moment they were WRITTEN.
// 2. `greet` here is written at the top level of the file, so its surrounding `this`
//    is NOT obj10 -- it's whatever `this` is at that outer scope (module.exports in Node
//    CommonJS, undefined in an ES Module, the global object in a plain sloppy-mode script).
// 3. Rule of thumb: use a regular method shorthand (`greet() {}`, like Example 1 above) for
//    object methods that need `this` to mean "whatever object called me." Only reach for
//    an arrow method when you deliberately want the OUTER `this` instead (rare).


// ---------------- EXAMPLE 11: The precedence order of all 4 `this` rules ----------------
// What this shows: what happens when more than one `this` rule could apply at once.
function show() {
  console.log(this.name);
}
const objA = { name: "A" };
const objB = { name: "B" };

const boundShow = show.bind(objB); // rule: explicit bind -> locked to objB forever
objA.show = boundShow;             // now also attached as a method of objA

objA.show();           // "B" -> bind WINS over the implicit obj.method() rule
boundShow.call(objA);  // "B" -> even .call() can't override an existing .bind()!

// WORKFLOW:
// 1. JS decides `this` using a priority order, highest to lowest:
//    1) `new Fn()`                                (see Example 5 above)
//    2) `fn.bind(obj)`                             (locked permanently, beats everything below)
//    3) `obj.fn()` / `fn.call(obj)` / `fn.apply(obj)`  (decided at the moment of the call)
//    4) plain `fn()`                               (default binding -- see Example 9 above)
// 2. Even though `objA.show()` LOOKS like the implicit binding rule (obj.method()) should
//    win, `show` was already bound to objB earlier -- that lock can't be undone by
//    attaching it to another object or calling it with .call()/.apply() again.
// 3. This is why `.bind()` is considered the strongest, most permanent way to fix `this`.