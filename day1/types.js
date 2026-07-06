console.log(typeof null); //object

console.log(typeof []); //object

console.log(typeof {}); //object

console.log(typeof NaN); //number

console.log(typeof function () {}); //function

console.log(0 == false); //true

console.log("" == false); //true

console.log(null == undefined); //true

console.log(null === undefined); //false

console.log(NaN === NaN); //false

console.log(1 + "2"); //12

console.log("3" - 1); //2

console.log(true + true); //2

console.log([] + []); //''

console.log({} + {}); //[object Object]

// typeof of primitive data types
console.log(typeof 27); //number

console.log(typeof "hello"); //string

console.log(typeof x); //undefined

let isComplete = true;
console.log(typeof isComplete); //boolean
console.log(typeof false); //boolean

let y = null;
console.log(y); //null
console.log(typeof y); //object
console.log(typeof null); //object

console.log(typeof 28243729n); //bigint

console.log(typeof Symbol("id")); //symbol
console.log(Symbol("id")); //Symbol(id)

// typeof of object and function
console.log(typeof { name: "neha" }); // "object"

console.log(typeof function () {}); // "function"

let a = new Array(1, 2, 3);
console.log(typeof a); //object
