// 1
const orders = [
  { id: 101, items: ["Laptop", "Mouse"] },
  { id: 102, items: ["Keyboard"] },
  { id: 103, items: ["Monitor", "HDMI Cable"] },
];

const itemsWithOrderId = orders.flatMap((order) =>
  order.items.map((item) => ({
    orderId: order.id,
    itemName: item,
  })),
);
console.log(itemsWithOrderId);

// 2
const logs = [
  { timestamp: "10.00", type: "INFO", message: "Server Started" },
  { timestamp: "10.05", type: "ERROR", message: "Database connection failed" },
  { timestamp: "10.15", type: "INFO", message: "User logged in" },
  { timestamp: "10.30", type: "ERROR", message: "API timeout" },
  { timestamp: "10.35", type: "ERROR", message: "Wrong password" },
];

const recentError = logs.findLast((log) => log.type === "ERROR");
const recentErrorIndex = logs.findLastIndex((log) => log.type === "ERROR");

console.log("Most recent Error:", recentError);
console.log("Found at Index:", recentErrorIndex);

// 3
function chunk(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

const data = [1, 2, 3, 4, 5, 6, 7, 8];
console.log("Original array: ", data);
console.log("Chunked array:", chunk(data, 3));

function zip(...arrays) {
  const minLength = Math.min(...arrays.map((arr) => arr.length));
  return Array.from({ length: minLength }, (_, i) =>
    arrays.map((arr) => arr[i]),
  );
}

const names = ["Alice", "Bob", "Charlie"];
const scores = [85, 92, 78, 45];
console.log("Names: ", names);
console.log("Scores: ", scores);
console.log("Zipping: ", zip(names, scores));

function groupBy(arr, keyFn) {
  const result = {};
  for (const item of arr) {
    const key = keyFn(item);
    if (!result[key]) result[key] = [];
    result[key].push(item);
  }
  return result;
}

const words = ["apple", "bat", "banana", "cat", "dog"];
const groupedByLength = groupBy(words, (word) => word.length);
console.log(groupedByLength);

// 4
const calendarMonths = Array.from({ length: 12 }, (_, i) => {
  const date = new Date(2026, i, 1);
  return {
    monthIndex: i,
    monthNumber: i + 1,
    shortName: date.toLocaleString("en-US", { month: "short" }),
    fullName: date.toLocaleString("en-US", { month: "long" }),
    daysInMonth: new Date(2026, i + 1, 0).getDate(),
  };
});

console.log(calendarMonths);
