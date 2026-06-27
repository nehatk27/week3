// 1
console.log("=================1==================");

// A: default binding
let favoriteColor = "Yellow";
function logColor() {
  console.log(`My favorite color is: ${this.favoriteColor}`);
}

logColor(); // standalone call - because nothing (object, constructor or explicit call et..) is being attached to it
// If no other context is provided, JavaScript automatically binds the this keyword to the global environment container (window in browsers, or global in Node.js).

// B: implicit binding
const car = {
  brand: "Toyota",
  startEngine() {
    console.log(`The ${this.brand} engine is roaring!`);
  },
};

car.startEngine(); // method call. car is the object referred as 'this' here.

// C: explicit binding
const student = {
  name: "Neha",
  rollno: 44,
};

function info(place) {
  console.log(
    `${this.name}'s roll no is ${this.rollno}. She lives in ${place}.`,
  );
}

info.call(student, "Calicut"); // call
info.apply(student, ["Calicut"]); // apply: in apply additional arguments have to be given in square brackets.

const studentInfo = info.bind(student, "Wayanad"); // bind: bind is a permenant change that we can reference over and over again with a variable.
studentInfo();
studentInfo(); // Reusable over and over again

// 4: new (constructor)
// example1: Using a Class (Modern Constructor)
class Animal {
  constructor(species) {
    this.type = species;
  }
}
const pet = new Animal("Cat");
console.log(pet.type);

// example2: Using a Constructor Function
function Animal2(species) {
  this.type = species;
}
const pet2 = new Animal2("Dog");
console.log(pet2.type);

// 2: this-loss
console.log("================= 2:this-loss ==================");
class User {
  constructor(username) {
    this.name = username;
  }
  logName() {
    console.log(`User: ${this.name}`);
  }
}

const profile = new User("Neha");
profile.logName(); // "User: Neha" -> works correctly

const detachedLog = profile.logName; // LOSS . Extracting the method into a plain variable.

try {
  detachedLog(); // when running this, 'this' becomes undefined.
} catch (e) {
  console.log("Error: ", e.message);
}

// three solutions:
// Fix 1: Arrow Function inside the Constructor
console.log("Fix 1: Arrow Function inside the Constructor:");
class FixedUser1 {
  constructor(username) {
    this.name = username;
    this.logName = () => {
      console.log(`User: ${this.name}`);
    };
  }
}

const profile1 = new FixedUser1("Neha");
const safeLog1 = profile1.logName;
safeLog1(); // "User: Neha"

// Fix 2: Hard-binding with '.bind(this)' in the Constructor
console.log("Fix 2: Hard-binding with .bind(this) in the Constructor:");
class FixedUser2 {
  constructor(username) {
    this.name = username;
    this.logName = this.logName.bind(this);
  }
  logName() {
    console.log(`User: ${this.name}`);
  }
}

const profile2 = new FixedUser2("Neha");
const safeLog2 = profile2.logName;
safeLog2(); // "User: Neha"

// Fix 3: Using Class Fields (Auto-bound Arrow Functions)
console.log("Fix 3: Using Class Fields (Auto-bound Arrow Functions)");
class FixedUser3 {
  constructor(username) {
    this.name = username;
  }
  logName = () => {
    console.log(`User: ${this.name}`);
  };
}

const profile3 = new FixedUser3("Neha");
const safeLog3 = profile3.logName;
safeLog3(); // "User: Neha"

// 3
console.log("================= 3: bindAll(obj) ==================");

function bindAll(obj) {
  const keys = Object.keys(obj);
  for (const key of keys) {
    if (typeof obj[key] === "function") {
      obj[key] = obj[key].bind(obj);
    }
  }
  return obj;
}

const child = {
  name: "Neha",
  rollno: 44,

  greet() {
    console.log(`Hello, I am ${this.name}.`);
  },
  showRoll() {
    console.log(`My roll number is ${this.rollno}.`);
  },
};

bindAll(child);
// Extract methods into loose, standalone variables
const Greet = child.greet;
const Roll = child.showRoll;
Greet(); // Output: "Hello, I am Neha."
Roll(); // Output: "My roll number is 44."

// 4
console.log(
  "============== 4: arrow class fields in setTimeout callbacks ===============",
);
class Greeter {
  constructor(name) {
    this.name = name;
  }

  // A. Standard Method (Loses context)
  sayHelloStandard() {
    console.log(`[Standard] Hello, my name is ${this.name}`);
  }

  // B. Arrow Class Field (Preserves context safely)
  sayHelloArrow = () => {
    console.log(`[Arrow Field] Hello, my name is ${this.name}`);
  };

  testTimers() {
    setTimeout(this.sayHelloStandard, 100); // Output: "[Standard] Hello, my name is undefined"
    setTimeout(this.sayHelloArrow, 200); // Output: "[Arrow Field] Hello, my name is Neha"
  }
}

const user = new Greeter("Neha");
user.testTimers();
