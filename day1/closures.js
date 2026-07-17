const { log } = require("node:console");

console.log("COUNTER");
function createCounter(initialValue = 0) {
  let count = initialValue; // Private variable
  const initial = initialValue;

  return {
    increment: function () {
      count += 1;
      return count;
    },
    decrement: function () {
      count -= 1;
      return count;
    },
    getCount: function () {
      return count;
    },
    reset: function () {
      count = initial;
      return count;
    },
  };
}
const myCounter = createCounter(10);
console.log(myCounter.increment()); // 11
console.log(myCounter.decrement()); // 10
console.log(myCounter.decrement()); // 9
console.log(myCounter.getCount()); // 9
console.log(myCounter.reset()); // 10
// Attempting to access the variable directly will fail
console.log(myCounter.count); // undefined

//memoize
console.log("\nMEMOIZE");
function memoize(fn) {
  const cache = new Map();

  return function (input) {
    if (cache.has(input)) {
      return cache.get(input); // If the result is already in the map, return it immediately
    }

    const result = fn(input); // Else, calculate using the original slow function
    cache.set(input, result);
    return result;
  };
}

function slowFibonacci(n) {
  if (n < 2) return n;
  return slowFibonacci(n - 1) + slowFibonacci(n - 2);
}

const fastFibonacci = memoize(slowFibonacci);

const testValue = 40;

const start1 = performance.now();
const result1 = fastFibonacci(testValue);
const end1 = performance.now();
console.log(`First Call Result: ${result1}`);
console.log(`First Call Time: ${(end1 - start1).toFixed(4)} ms`);

const start2 = performance.now();
const result2 = fastFibonacci(testValue);
const end2 = performance.now();
console.log(`Second Call Result: ${result2}`);
console.log(`Second Call Time: ${(end2 - start2).toFixed(4)} ms`);

//once
console.log("\nONCE");
function once(fn) {
  let hasRun = false;
  let cachedResult = null;

  return function () {
    if (hasRun == true) {
      return cachedResult;
    }

    cachedResult = fn();
    hasRun = true;
    return cachedResult;
  };
}

function calculate() {
  console.log("The once message");
  return "Applied";
}

const initializeOnce = once(calculate);

initializeOnce();
initializeOnce();
initializeOnce();

//Rate Limiter
console.log("\nRATE LIMITER");
function CreateRateLimiter(fn, maxCalls, windowMs) {
  let callTimestamps = [];

  return function () {
    const currentTime = performance.now();
    const windowStartTime = currentTime - windowMs;

    callTimestamps = callTimestamps.filter(
      (timeStamp) => timeStamp >= windowStartTime,
    );

    if (callTimestamps.length >= maxCalls) {
      console.log(`Error at time:", ${currentTime}`);
      throw new Error("XXXXX === Maximum rate limit reached! ==== XXX");
      return;
    }
    callTimestamps.push(currentTime);
    console.log(`Msg sending at time:", ${currentTime}`);
    return fn(); //Actually running the passed function.
  };
}

function sendMsg() {
  console.log("Message successfully sent!");
}

const limitedSend = CreateRateLimiter(sendMsg, 2, 1000);

try {
  limitedSend();
} catch (e) {
  console.error(e.message);
}

try {
  limitedSend();
} catch (e) {
  console.error(e.message);
}

try {
  limitedSend();
} catch (e) {
  console.error(e.message);
}

try {
  limitedSend();
} catch (e) {
  console.error(e.message);
}
