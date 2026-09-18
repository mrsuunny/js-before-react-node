/*
=====================================================
TOPIC: Error Handling (try / catch / finally, throw)
=====================================================
DEFINITION:
- `try { }` wraps code that MIGHT throw an error.
- `catch (error) { }` runs ONLY if something inside `try` throws,
  and gives you the error object.
- `finally { }` runs ALWAYS, whether an error happened or not.
- `throw` manually creates and raises an error (stopping execution
  at that point, jumping straight to the nearest catch).

USAGE:
- Wrapping risky operations: parsing JSON, network requests,
  reading files, anything that depends on external/unpredictable input.
=====================================================
*/

// ---------------- EXAMPLE 1: Basic try/catch stopping a crash ----------------
// What this shows: catching an error keeps the whole program from crashing.
function parseUserData(jsonString) {
  try {
    const data = JSON.parse(jsonString); // throws if jsonString is invalid JSON
    console.log("Parsed successfully:", data);
    return data;
  } catch (error) {
    console.log("Failed to parse:", error.message);
    return null; // fallback value instead of letting the program crash
  }
}

parseUserData('{"name": "Sanaullah"}'); // "Parsed successfully: { name: 'Sanaullah' }"
parseUserData("not valid json{{{");     // "Failed to parse: Unexpected token..."
console.log("Program keeps running after the bad input, because we caught the error.");

// WORKFLOW:
// 1. JSON.parse() throws a SyntaxError immediately when it hits invalid JSON.
// 2. Because that line is inside `try`, execution jumps STRAIGHT to `catch`,
//    skipping the rest of the try block (the "Parsed successfully" log never runs for bad input).
// 3. Without try/catch, that thrown error would stop the entire script (uncaught exception).


// ---------------- EXAMPLE 2: throw — creating your own errors ----------------
// What this shows: manually rejecting invalid input with a custom, descriptive error.
function withdraw(balance, amount) {
  if (amount <= 0) {
    throw new Error("Withdrawal amount must be positive");
  }
  if (amount > balance) {
    throw new Error("Insufficient funds");
  }
  return balance - amount;
}

function safeWithdraw(balance, amount) {
  try {
    const newBalance = withdraw(balance, amount);
    console.log("New balance:", newBalance);
  } catch (error) {
    console.log("Withdrawal failed:", error.message);
  }
}

safeWithdraw(100, 50);   // "New balance: 50"
safeWithdraw(100, 500);  // "Withdrawal failed: Insufficient funds"
safeWithdraw(100, -10);  // "Withdrawal failed: Withdrawal amount must be positive"

// WORKFLOW:
// 1. `throw new Error("...")` immediately stops withdraw() from running any further —
//    it never reaches `return` on that call.
// 2. The thrown error travels UP to whoever called withdraw() — here, safeWithdraw()'s
//    try block — and gets caught there.
// 3. This lets you validate your OWN business rules (not just built-in JS errors) and
//    give clear, custom messages.


// ---------------- EXAMPLE 3: try/catch with async/await + finally cleanup ----------------
// What this shows: real-world pattern for handling a failed async operation with cleanup.
// function fetchFakeData(shouldFail) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (shouldFail) reject(new Error("Network error"));
//       else resolve({ id: 1, title: "Post" });
//     }, 200);
//   });
// }

// async function loadData(shouldFail) {
//   console.log("Loading started...");
//   try {
//     const data = await fetchFakeData(shouldFail); // may throw
//     console.log("Loaded:", data);
//   } catch (error) {
//     console.log("Could not load data:", error.message);
//   } finally {
//     console.log("Loading finished (spinner would hide here)."); // always runs
//   }
// }

// loadData(false);
// loadData(true);

// WORKFLOW:
// 1. `await fetchFakeData(shouldFail)` either resolves (data continues normally)
//    or rejects, which `await` converts into a normal thrown error.
// 2. `catch` handles the failure case gracefully instead of crashing the app.
// 3. `finally` runs in BOTH cases — this is exactly where you'd hide a loading
//    spinner or re-enable a button, regardless of success/failure.


function fetchFakeData (shouldFail)  {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new error("Kaam py gya ustad"));
        else resolve({ id: 1, name: "Sanaullah" });
    }, 200);
  });
}

async function loadData(shouldFail) {
  console.log("Hello G! Loading start ho gyi jy...")
  try{
    const data = await fetchFakeData(shouldFail)
    console.log("lo g mubarak hoye Data a gya jy: ", data) }
    catch (error) {
      console.log("Data load e nai hoya, a ty kaam harab aaa, lo g: ", error.Error)
    }
    finally{
      console.log("Lo g jo hona si ho gya, hun bas dua kiti ja sakdi")
    }
}

loadData(true);
loadData(false);