// 1
function gradeToLetterIf(score) {
  let grade;
  if (score >= 90) {
    grade = "A";
  } else {
    if (score >= 80) {
      grade = "B";
    } else {
      if (score >= 70) {
        grade = "C";
      } else {
        if (score >= 60) {
          grade = "D";
        } else {
          if (score >= 50) {
            grade = "E";
          } else {
            grade = "F";
          }
        }
      }
    }
  }
  return grade;
}

function gradeToLetterSwitch(score) {
  switch (score) {
    case score >= 90:
      return "A";
    case score >= 80:
      return "B";
    case score >= 70:
      return "C";
    case score >= 60:
      return "D";
    case score >= 50:
      return "E";
    default:
      return "F";
  }
}

function gradeToLetterTernary(score) {
  score >= 90
    ? "A"
    : score >= 80
      ? "B"
      : score >= 80
        ? "C"
        : score >= 80
          ? "D"
          : score >= 80
            ? "E"
            : "F";
}

function gradeToLetterLookUp(score) {
  const scoreInTen = Math.max(5, Math.floor(score / 10));
  const lookup = { 10: "A", 9: "B ", 8: "C", 7: "D", 6: "E", 5: "F" };
  return lookup[scoreInTen] || "F";
}

// 1 M calls:
const iterations = 1_000_000;
const scores = Array.from({ length: iterations }, () =>
  Math.floor(Math.random() * 101),
);

console.time("If-else-time");
for (let i = 0; i < iterations; i++) {
  gradeToLetterIf(scores[i]);
}
console.timeEnd("If-else-time");

console.time("Switch-time");
for (let i = 0; i < iterations; i++) {
  gradeToLetterSwitch(scores[i]);
}
console.timeEnd("Switch-time");

console.time("Ternary-time");
for (let i = 0; i < iterations; i++) {
  gradeToLetterTernary(scores[i]);
}
console.timeEnd("Ternary-time");

console.time("LookUp-time");
for (let i = 0; i < iterations; i++) {
  gradeToLetterLookUp(scores[i]);
}
console.timeEnd("LookUp-time");

// 2
const processItem = (item) => console.log(`Processing: ${item}`);

function processQueueWhile(items) {
  const queue = [...items];
  while (queue.length > 0) {
    processItem(queue.shift());
  }
}

function processQueueDoWhile(items) {
  const queue = [...items];
  do {
    if (queue.length === 0) break;
    processItem(queue.shift());
  } while (queue.length > 0);
}

function processQueueMap(items) {
  const itemMap = new Map(items.map((item, index) => [index, item]));
  for (const [id, item] of itemMap) {
    processItem(`ID ${id}: ${item}`);
  }
}

const Queue = ["Email user", "Generate invoice", "Ship package"];

console.log("--- Running While Loop ---");
processQueueWhile(Queue);

console.log("--- Running Do/While Loop ---");
processQueueDoWhile(Queue);

console.log("--- Running Map Loop ---");
processQueueMap(Queue);

// 3
function validateUser(user) {
  // !! used to Double Not - convert any value into an exact boolean value rather than giving as string actual value
  return !!(
    user &&
    user.email &&
    user.email.includes("@") &&
    user.role === "admin"
  );
}


// 4 : making the deeply nested if/else to use early returns
function gradeToLetter(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  if (score >= 50) return "E";
  return "F";
}
