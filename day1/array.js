const { log } = require("node:console");
const { constants } = require("node:fs/promises");

const employees = [
  { name: "Rahul", dept: "Engineering", salary: 85000, yearsExp: 4 },
  { name: "Priya", dept: "HR", salary: 55000, yearsExp: 2 },
  { name: "Amit", dept: "Engineering", salary: 65000, yearsExp: 1 },
  { name: "Sneha", dept: "Marketing", salary: 72000, yearsExp: 5 },
  { name: "Vikram", dept: "Engineering", salary: 120000, yearsExp: 8 },
  { name: "Ananya", dept: "Sales", salary: 48000, yearsExp: 1 },
  { name: "Rohan", dept: "Engineering", salary: 95000, yearsExp: 5 },
  { name: "Meera", dept: "Finance", salary: 88000, yearsExp: 6 },
  { name: "Karan", dept: "Engineering", salary: 68000, yearsExp: 2 },
  { name: "Divya", dept: "HR", salary: 62000, yearsExp: 3 },
  { name: "Arjun", dept: "Engineering", salary: 71000, yearsExp: 3 },
  { name: "Deepa", dept: "Marketing", salary: 51000, yearsExp: 2 },
  { name: "Siddharth", dept: "Engineering", salary: 105000, yearsExp: 7 },
  { name: "Aditi", dept: "Sales", salary: 75000, yearsExp: 4 },
  { name: "Varun", dept: "Finance", salary: 93000, yearsExp: 5 },
  { name: "Pooja", dept: "Engineering", salary: 70000, yearsExp: 3 },
  { name: "Gaurav", dept: "Marketing", salary: 64000, yearsExp: 3 },
  { name: "Neha", dept: "Engineering", salary: 135000, yearsExp: 9 },
  { name: "Abhishek", dept: "Sales", salary: 53000, yearsExp: 2 },
  { name: "Ritu", dept: "HR", salary: 78000, yearsExp: 5 },
];

// 1
console.log("1");
const result = employees
  .filter((emp) => emp.dept === "Engineering" && emp.salary > 70000)
  .map((emp) => ({ name: emp.name, salary: emp.salary }))
  .sort((a, b) => b.salary - a.salary);

console.log(result);

// 2
console.log("\n2");
const config = {
  id: 101,
  server: { host: "localhost", port: 8080 },
  ui: { theme: "dark" },
};

// Single destructuring statement
const {
  id: myid, //can also give like this - giving a variable name
  server: { host, port },
  ui: { theme },
} = config;

console.log(`id: ${myid}`);
console.log(`host: ${host}`);
console.log(`port: ${port}`);
console.log(`theme: ${theme}`);

// 3
console.log("\n3");
const obj1 = { name: "Alice", role: "Dev" };
const obj2 = { role: "Lead", city: "Kochi" }; // 'role' will get overwritten by obj2
const merged = { ...obj1, ...obj2 }; // Merge using spread

console.log(Object.keys(merged));
console.log(Object.values(merged));
console.log(Object.entries(merged));

// 4
console.log("\n4");
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj; // return if it's not a valid object

  const clone = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = obj[key]; // Safe copy of the flat values
    }
  }
  return clone;
}
const original = { a: 1, b: 2 };
const clonedCopy = deepClone(original);

console.log("original:", original);
console.log("Cloned:", clonedCopy);
