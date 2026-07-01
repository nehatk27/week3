// 1
console.log("1"); // synchronous

setTimeout(() => {
  console.log("2"); // macrotask
}, 0);

console.log("3"); // synchronous
// output: 1 3 2

// 2
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3"); // microtask
});

console.log("4");
// output: 1 4 3 2

// 3
Promise.resolve().then(() => {
  console.log("1");
  Promise.resolve().then(() => {
    console.log("2");
  });
});

console.log("3");
// output: 3 1 2

// 4
setTimeout(() => console.log("1"), 0);
Promise.resolve().then(() => console.log("2"));
setTimeout(() => console.log("3"), 0);
Promise.resolve().then(() => console.log("4"));
// output: 2 4 1 3

// 5
Promise.resolve().then(() => console.log("1"));
setTimeout(() => console.log("2"), 10);
queueMicrotask(() => {
  console.log("3");
  queueMicrotask(() => console.log("4"));
});
console.log("5");
// output: 5 1 3 4 2

// 6
console.log("1");

queueMicrotask(() => {
  console.log("2");
});
Promise.resolve().then(() => {
  console.log("3");
});

console.log("4");
// output: 1 4 2 3

// 7
setTimeout(() => {
  console.log("1");
  Promise.resolve().then(() => {
    console.log("2");
  });
}, 0);

setTimeout(() => {
  console.log("3");
});
// output: 1 2 3

// 8
Promise.resolve().then(() => {
  console.log("1");
  queueMicrotask(() => console.log("2"));
});

setTimeout(() => {
  console.log("3");
}, 0);
// output: 1 2 3

// 9
console.log("1");

setTimeout(() => {
  console.log("2");
  Promise.resolve().then(() => console.log("3"));
}, 0);

queueMicrotask(() => {
  console.log("4");
  setTimeout(() => console.log("5"), 0);
});

Promise.resolve().then(() => console.log("6"));

console.log("7");
// output: 1 7 4 6 2 3 5

// 10
console.log("1");

setTimeout(() => {
  console.log("2");
  Promise.resolve()
    .then(() => {
      console.log("3");
    })
    .then(() => {
      console.log("4");
    });
}, 0);

Promise.resolve()
  .then(() => {
    console.log("5");
  })
  .then(() => {
    console.log("6");
  });

console.log("7");
// output: 1 7 5 6 2 3 4
