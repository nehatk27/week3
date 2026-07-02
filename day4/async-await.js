async function getUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("User data accessed");
      resolve({ id: 1, name: "Neha" });
    }, 2500);
  });
}


function getOrders(userID) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!userID) {
        reject(new Error("User ID is undefined"));
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
      resolve({ id: orderID, items: ["Laptop", "Mouse"], total: 1500 });
    }, 2500);
  });
}

async function executeOrder() {
  try {
    const user = await getUser();
    console.log(`User is: ${user.name}`);

    const orderList = await getOrders(user.id);
    console.log(`Targeting Order ID: ${orderList[1]}`);

    const detail = await getOrderDetail(orderList[1]);
    console.log("Final result: ", detail);
    console.log(`Order items are: ${detail.items.join(", ")}`);
  } catch (error) {
    console.error(error.message);
  }
}

executeOrder();

// 2: loadDashboard
async function loadDashboard(userID) {
  try {
    if (userID === undefined) throw new Error("Invalid User");
    let userResponse, postsResponse, todosResponse;

    try {
      [userResponse, postsResponse, todosResponse] = await Promise.all([
        fetch(`https://jsonplaceholder.typicode.com/users?id=${userID}`),
        fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userID}`),
        fetch(`https://jsonplaceholder.typicode.com/todos?userId=${userID}`),
      ]);
    } catch (err) {
      console.log("error while fetching parallel data");
      throw err;
    }

    let user, posts, todos;
    try {
      user = await userResponse.json();
      posts = await postsResponse.json();
      todos = await todosResponse.json();
      if (user.length === 0) throw Error("User does not exist");
      if (posts.length === 0) throw Error("User has no posts to fetch");
    } catch (err) {
      console.error("Data validation failed: ", err.message);
      throw err;
    }

    try {
      const firstPostId = posts[0].id;
      const commentsResponse = await fetch(
        `https://jsonplaceholder.typicode.com/comments?postId=${firstPostId}`,
      );
      const comments = await commentsResponse.json();

      console.log("Dashboard loaded successfully!");
      console.log({
        user: user[0],
        totalPosts: posts.length,
        totalTodos: todos.length,
        firstPostComments: comments,
      });
    } catch (err) {
      console.error("Error fetching or parsing comments");
      throw err;
    }
  } catch (Error) {
    console.error("Dashboard execution failed:", Error);
  }
}

loadDashboard(1);

// 3: sequential vs parallel
async function fetchSequentially() {
  try {
    console.time("sequential");
    const response1 = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data1 = await response1.json();
    // console.log("Response fetch1(sequential): ", data1);

    const response2 = await fetch("https://jsonplaceholder.typicode.com/users");
    const data2 = await response2.json();
    // console.log("Response fetch2(sequentail): ", data2);
    console.timeEnd("sequential");
  } catch (error) {
    console.error("Error in sequential approach:", error);
  }
}

async function fetchParallely() {
  try {
    console.time("parallel");
    const fetch1 = fetch("https://jsonplaceholder.typicode.com/posts");
    const fetch2 = fetch("https://jsonplaceholder.typicode.com/users");

    const [response1, response2] = await Promise.all([fetch1, fetch2]);

    const data1 = await response1.json();
    const data2 = await response2.json();

    // console.log("Response fetch1(parallel):", data1);
    // console.log("Response fetch2(parallel): ", data2);
    console.timeEnd("parallel");
  } catch (error) {
    console.error("Error in parallel approach:", error);
  }
}

fetchSequentially();
fetchParallely();

// 4: forEach async bug

const users = ["user1", "user2", "user3"];
function sendEmail(user) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Email send to: ${user}`);
      resolve();
    }, 1000);
  });
}

// forEach
console.log("-----Using forEach----");

async function sendAllEmails() {
  users.forEach(async (user) => {
    await sendEmail(user);
  });

  console.log("All emails sent!");
}

sendAllEmails();

// for..of
console.log("-----Using for..of----");

async function sendAllEmails() {
  for (const user of users) {
    await sendEmail(user);
  }
  console.log("All emails sent!");
}

sendAllEmails();

// Promise.all
console.log("-----Using Promise.all----");

async function sendAllEmails() {
  await Promise.all(
    users.map(async (user) => {
      await sendEmail(user);
    }),
  );
  console.log("All emails sent!");
}

sendAllEmails();
