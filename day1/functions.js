// Function Declaration
function greet1(name, greeting = "Hello") {
  console.log(greeting + ", " + name);
}
greet1("Manu");

// Function Expression
const greet2 = function (name, greeting = "Hello") {
  console.log(greeting + ", " + name);
};
greet2("Riya");

// Arrow Function
const greet3 = (name, greeting = "Hello") => greeting + ", " + name;
greet3("Raju");

// Object Method
const person = {
  greet4(name, greeting = "Hello") {
    console.log(greeting + ", " + name);
  },
};
greet = person.greet4("Neha");
console.log(greet);

// CALCULATOR
const calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => {
    if (b === 0) {
      return "Error: Division by zero is not allowed.";
    }
    return a / b;
  },
};

console.log(calculator.add(10, 5)); // 15
console.log(calculator.subtract(10, 5)); // 5
console.log(calculator.multiply(10, 5)); // 50
console.log(calculator.divide(10, 2)); // 5
console.log(calculator.divide(10, 0)); // "Error: Division by zero is not allowed."

//multiplier fn
function createMultiplier(factor) {
  return function (number) {
    return factor * number;
  };
}
console.log(createMultiplier(3)(7) === 21); //true

// arguments object vs rest parameters
function showArgs() {
  console.log(arguments); // [Arguments] { '0': 'Hai', '1': 'Hello' }
}
showArgs("Hai", "Hello");

function showRest(...args) {
  console.log(args); // ['Hai', 'Hello']
}
showRest("Hai", "Hello");

// This throws an error or grabs a parent's arguments:
const badFunction = () => {
  console.log(arguments[0]); // ReferenceError: arguments is not defined
};

// This is the correct way to handle arguments in arrow functions
const goodFunction = (...args) => {
  console.log(args[0]); // Returns the first element
  console.log(`Total arguments: ${args.length}`);
};

goodFunction("Hai", "Hello", "Good Morning");
// Output: Hai
// Output: Total arguments: 3
