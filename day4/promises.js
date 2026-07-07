// 1
let promise1 = new Promise((resolve, reject) => {
  setTimeout(() => resolve("done"), 200);
});
promise1.then((result) => console.log(result));

// 2
let promise2 = new Promise((resolve, reject) => {
  setTimeout(() => reject(new Error("rejected!!")), 500);
});
promise2.then(
  (result) => alert(result),
  (error) => console.log(error),
);

// 3
const promise3 = new Promise((resolve, reject) => {
  let isCompleted = true;

  if (isCompleted) {
    setTimeout(() => resolve("Task is completed"), 1000);
  } else {
    setTimeout(() => reject("Task is pending!"), 1000);
  }
});

promise3
  .then((result) => console.log(result))
  .catch((error) => console.log(error));

// 4
const promise4 = new Promise((resolve, reject) => {
  let isOkay = false;

  if (isOkay) {
    setTimeout(() => resolve("Okay"), 1000);
  } else {
    setTimeout(() => reject("Not okay"), 1000);
  }
});

promise4
  .then((result) => console.log(result))
  .catch((error) => console.log(error));

// 5
console.log("1");
const promise5 = new Promise((resolve, reject) => {
  console.log("inside promise");
  resolve();
  reject();
});
setTimeout(() => {
  console.log("2");
  promise5
    .then(() => {
      console.log("3");
    })
    .catch(() => {
      console.log("error"); // not displayed
    });
}, 0);

// chaining depended promises
function getUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("User data accessed");
      resolve({ id: null, name: "Neha" });
    }, 2500);
  });
}

function getOrders(userID) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!userID) {
        reject(new Error("User-ID is undefined"));
      } else {
        console.log(`Fetched orders for user ${userID}.`);
        resolve(["101", "102", "103"]);
      }
    }, 2500);
  });
}

function getOrderDetail(orderID) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Fetched details of the order: ${orderID}`);
      resolve({ id: orderID, items: ["Laptop", "Mouse"], total: 1250 });
    }, 2500);
  });
}

getUser()
  .then((user) => {
    console.log(`User is: ${user.name}`);
    return getOrders(user.id);
  })
  .then((ordersList) => {
    console.log(`Targeting Order ID: ${ordersList[1]}`);
    return getOrderDetail(ordersList[1]);
  })
  .then((detail) => {
    console.log("Final Result:", detail);
    console.log(`Order item are: ${detail.items.join(", ")}`);
  })
  .catch((error) => {
    console.error("Chain Failed:", error.message);
  });

// Promise.all , Promise.allSettled, Promise.race
const promise6 = new Promise((resolve) => {
  setTimeout(() => resolve("Promise 6 resolved"), 1000);
});
const promise7 = new Promise((resolve) => {
  setTimeout(() => resolve("Promise 7 resolved"), 500);
});
const promise8 = new Promise((resolve) => {
  setTimeout(() => resolve("Promise 8 resolved"), 800);
});

const promisesArray = [promise6, promise7, promise8];

Promise.all(promisesArray)
  .then((results) => {
    console.log("All promises are resolved:", results);
  })
  .catch((error) => {
    console.error("At least one promise rejected:", error);
  });

Promise.allSettled(promisesArray).then((results) => {
  console.log("All promises are settled: ", results);
});

Promise.race(promisesArray)
  .then((results) => {
    console.log("First promise resolved:", results);
  })
  .catch((error) => {
    console.error("At least one promise rejected:", error);
  });

const promise9 = new Promise((resolve) => {
  setTimeout(() => resolve("Promise 6 resolved"), 1000);
});
const promise10 = new Promise((resolve, reject) => {
  setTimeout(() => reject("Promise 7 rejected"), 500);
});
const promise11 = new Promise((resolve) => {
  setTimeout(() => resolve("Promise 8 resolved"), 800);
});

const promisesArray2 = [promise9, promise10, promise11];

Promise.all(promisesArray2)
  .then((results) => {
    console.log("All promises are resolved:", results);
  })
  .catch((error) => {
    console.error("At least one promise rejected:", error);
  });

Promise.allSettled(promisesArray2).then((results) => {
  console.log("All promises are settled: ", results);
});

Promise.race(promisesArray2)
  .then((results) => {
    console.log("First promise resolved:", results);
  })
  .catch((error) => {
    console.error("At least one promise rejected:", error);
  });
