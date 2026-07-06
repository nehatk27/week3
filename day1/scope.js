//Blockscoping - 1
{
  var a = 1;
  let b = 2;
  const c = 3;
}
console.log(a); //only this works because var is function/global scoped
console.log(b); //Uncaught ReferenceError. Because let is block-scoped
console.log(c); //Uncaught ReferenceError. Because const is block-scoped

//Blockscoping - 2
{
  var a = 1;
  let b = 2;
  const c = 3;
  console.log(a); // 1
  console.log(b); // 2
  console.log(c); // 3
}

//hoisting
if (true) {
  console.log(x);
  var x = 5; //undefined

  console.log(y);
  let y = 10; //Uncaught ReferenceError: y is not defined

  console.log(z);
  const z = 10; //Uncaught ReferenceError: z is not defined
}

// Temporal dead zone
// In let, it throws a ReferenceError whereas in var it shows only undefined.
{
  console.log(Let_Variable); // Uncaught ReferenceError: Let_Variable is not defined
}
let Let_Variable = "This is let";
console.log(Let_Variable); // "This is let"

{
  console.log(Var_Variable); // undefined
}
var Var_Variable = "This is var";
console.log(Var_Variable); // "This is var"

//functions
function outerFunction() {
  const outerVar = "This is outer scope";
  function middleFunction() {
    const middleVar = "This is middle scope";
    function innerFunction() {
      const innerVar = "This is inner scope";
      console.log(outerVar);
      console.log(middleVar);
      console.log(innerVar);
    }
    innerFunction();
  }
  middleFunction();
}
outerFunction();

// var-in-loop closure bug
for (var i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 1000); // 4 4 4
}
for (let i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 1000); // 1 2 3
}
