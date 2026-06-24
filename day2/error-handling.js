// 1
console.log("--- ValidationError ---");

class ValidationError extends Error {
  constructor(statusCode, message, field) {
    super(message); // Call the parent Error class constructor - it sets the message properly.
    this.name = "ValidationError"; //parent constructor also sets the name property to "Error", here it is overwritten.
    this.statusCode = statusCode;
    this.fieldName = field;
  }
}

// Testing
const errorInstance = new ValidationError(
  400,
  "Username is too short",
  "username",
);
console.log(errorInstance.name);
console.log(errorInstance.statusCode);
console.log(errorInstance.fieldName);

// 2
console.log("--- parseUserInput ---");
function parseUserInput(input) {
  if (typeof input !== "object" || input === null) {
    throw new TypeError("Input must be a valid configuration object");
  }

  if (typeof input.age === "number" && (input.age < 0 || input.age > 80)) {
    throw new RangeError("Age must be a realistic number between 0 and 80");
  }

  if (!input.username || input.username.trim() === "") {
    throw new ValidationError(400, "Username is a required field", "username");
  }

  return {
    username: input.username.trim(),
    age: input.age,
  };
}

// Testing
try {
  parseUserInput("Not an object");
} catch (err) {
  console.log(`Test 1 caught: ${err.name} - ${err.message}`);
}

try {
  parseUserInput({ username: "Alex", age: 150 });
} catch (err) {
  console.log(`Test 2 caught: ${err.name} - ${err.message}`);
}

try {
  parseUserInput({ username: "", age: 25 });
} catch (err) {
  console.log(
    `Test 3 caught: ${err.name} (Field: ${err.fieldName}) - ${err.message}`,
  );
}

try {
  const cleanData = parseUserInput({ username: "Alex Smith", age: 25 });
  console.log("Test 4 Success:", cleanData);
} catch (err) {
  console.log("Test 4 failed unexpectedly");
}

// 3
function handleInputSafely(input) {
  try {
    const result = parseUserInput(input);
    console.log("Success! Processed data:", result);
    return result;
  } catch (err) {
    if (err instanceof TypeError) {
      console.error(
        `[TypeError]: Fix your code argument structures. Details: ${err.message}`,
      );
    } else if (err instanceof RangeError) {
      console.warn(
        `[RangeError]: Value out of bounds. Details: ${err.message}`,
      );
    } else if (err instanceof ValidationError) {
      console.warn(
        `[ValidationError]: Field "${err.fieldName}" failed validation with status ${err.statusCode}. Message: ${err.message}`,
      );
    } else {
      console.error(
        `[Unhandled Runtime Error]: Unexpected issue: ${err.name} - ${err.message}`,
      );
    }
  }
}

// Testing
console.log("--- Executing Separate Catch Logic ---");
handleInputSafely("Invalid String Argument"); // TypeError
handleInputSafely({ username: "Jane", age: -5 }); // RangeError
handleInputSafely({ username: "", age: 30 }); // ValidationError
handleInputSafely({ username: "Alex Smith", age: 25 }); // Success

// 4
console.log("--- Global Handlers & Overlay ---");
function showOverlay(message) {
  const overlay = document.getElementById("error-overlay");
  const errorText = document.getElementById("error-text");

  if (overlay && errorText) {
    errorText.innerText = message;
    overlay.style.display = "block";
  }
}

// Catch regular synchronous errors that lack a try/catch block
window.onerror = function (message, url, line, col, error) {
  const fullMessage = `${message}\nLocation: ${url}:${line} \nStatus Code: ${error.statusCode} `;
  showOverlay(fullMessage);
  return false;
};

// Catch asynchronous Promise failures that lack a .catch() block
window.addEventListener("unhandledrejection", function (event) {
  // If the promise rejected an Error object, get its message. Otherwise, use the raw rejection reason.
  const reason = event.reason;
  const errorMessage = reason instanceof Error ? reason.message : reason;

  showOverlay("Unhandled Promise Rejection: " + errorMessage);
});

// Testing : one at a time
// Trigger 1 (Sync):
throw new ValidationError(500, "Global application form crashed!");
// Trigger 2 (Async):
// Promise.reject("Database failed to respond in time.");
