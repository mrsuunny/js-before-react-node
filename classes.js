/*
=====================================================
TOPIC: Classes (extends, super, methods)
=====================================================
DEFINITION:
- A class is a template/blueprint for creating objects that share
  the same structure and behavior. It's built on top of the same
  `this` + constructor function + prototype system you already
  saw in this.js (Example 5) — classes are just cleaner SYNTAX
  over that.
- `constructor()`: a special method that runs automatically when
  you create a new instance with `new ClassName()`.
- `extends`: lets one class INHERIT from another (a "subclass").
- `super()`: calls the PARENT class's constructor/method from
  inside a child class.

USAGE:
- Modeling real-world "things" with data + behavior (Users, Products).
- React class components (older style) and many Node.js
  frameworks/libraries use classes heavily.
=====================================================
*/

// ---------------- EXAMPLE 1: Basic class with constructor + methods ----------------
// What this shows: defining a blueprint and creating instances from it.
class Person {
  constructor(name, age) {
    this.name = name; // runs for EVERY new Person(...)
    this.age = age;
  }

  greet() { // a method shared by ALL instances (stored once on the prototype)
    return `Hi, I'm ${this.name} and I'm ${this.age} years old.`;
  }
}

const p1 = new Person("Sanaullah", 22);
const p2 = new Person("Ali", 30);
console.log(p1.greet()); // "Hi, I'm Sanaullah and I'm 22 years old."
console.log(p2.greet()); // "Hi, I'm Ali and I'm 30 years old."

// WORKFLOW:
// 1. `new Person("Sanaullah", 22)` creates a brand new empty object, then runs
//    `constructor` with `this` pointing at that new object, setting name/age on it.
// 2. `greet()` is NOT copied onto every instance individually — it lives once on
//    Person.prototype, and both p1/p2 share access to the same method definition.
// 3. Calling p1.greet() works because `this` inside greet() is set to whatever
//    object called it (p1) — same `this` rule as this.js.


// ---------------- EXAMPLE 2: Inheritance with extends + super ----------------
// What this shows: a subclass reusing and extending a parent class.
class Employee extends Person {
  constructor(name, age, role) {
    super(name, age); // MUST call this first -> runs Person's constructor
    this.role = role;
  }

  greet() { // overriding the parent's greet() method
    const base = super.greet(); // call the PARENT's version of greet()
    return `${base} I work as a ${this.role}.`;
  }
}

const emp = new Employee("Sanaullah", 22, "Developer");
console.log(emp.greet());
// "Hi, I'm Sanaullah and I'm 22 years old. I work as a Developer."
console.log(emp instanceof Person);   // true -> Employee IS-A Person
console.log(emp instanceof Employee); // true

// WORKFLOW:
// 1. `extends Person` makes Employee inherit everything Person has.
// 2. `super(name, age)` runs Person's constructor logic FIRST, so `this.name`/`this.age`
//    get set exactly like a plain Person would — Employee just adds `role` on top.
// 3. Employee's `greet()` OVERRIDES Person's, but `super.greet()` lets it still call
//    the original parent version and build on top of it, instead of rewriting it from scratch.


// ---------------- EXAMPLE 3: Private fields, getters/setters, static methods ----------------
// What this shows: extra class features useful for real encapsulated data.
class BankAccount {
  #balance; // "#" makes this a truly PRIVATE field — inaccessible from outside the class

  constructor(owner, startingBalance) {
    this.owner = owner;
    this.#balance = startingBalance;
  }

  deposit(amount) {
    this.#balance += amount;
    return this.#balance;
  }

  get balance() { // getter: lets you READ account.balance like a property, not account.balance()
    return this.#balance;
  }

  static createEmpty(owner) { // static: called on the CLASS itself, not on an instance
    return new BankAccount(owner, 0);
  }
}

const account = new BankAccount("Sanaullah", 100);
account.deposit(50);
console.log(account.balance); // 150 -> read like a plain property, via the getter
// console.log(account.#balance); // ❌ SyntaxError: private field, can't access from outside

const emptyAccount = BankAccount.createEmpty("Ali");
console.log(emptyAccount.balance); // 0

// WORKFLOW:
// 1. `#balance` can only be read/written from INSIDE the BankAccount class — this is
//    real, enforced privacy (closures in closures.js achieve something similar, differently).
// 2. `get balance()` lets callers write `account.balance` (no parentheses) while
//    secretly running a method behind the scenes — clean, property-like syntax.
// 3. `static createEmpty(...)` belongs to the CLASS, not instances — you call
//    `BankAccount.createEmpty(...)`, never `account.createEmpty(...)`. Useful for
//    "factory" helpers related to the class but not tied to one specific instance.
