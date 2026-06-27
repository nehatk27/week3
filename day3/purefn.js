"use strict";

// 1. pure and impure updateUser(users, id, changes)
console.log("================== 1 =======================");

// IMPURE VERSION: (mutates the array)
function updateUserImpure(users, id, changes) {
  const user = users.find((u) => u.id === id);
  if (user) {
    Object.assign(user, changes); // Object.assign(target, ...sources) -> this copy properties from source objcts to target objects.
  }
  return users;
}

// testing
const initialUsersImpure = [
  { id: 1, name: "Neha", active: true },
  { id: 2, name: "Aami", active: false },
];

const usersBeforeImpure = initialUsersImpure;
console.log("Users before applying impure function:", usersBeforeImpure);

const usersAfterImpure = updateUserImpure(initialUsersImpure, 2, {
  name: "Aysha",
  active: true,
});
console.log("Users after applying impure function:", usersAfterImpure);
console.log("Initial Users now: (They are also changed)", initialUsersImpure);

// PURE VERSION (Returns a new copy, leaves original untouched)
function updateUserPure(users, id, changes) {
  const finalResultArray = users.map((user) => {
    if (user.id === id) {
      return { ...user, ...changes };
    }
    return user;
  });
  return finalResultArray;
}

// testing
const initialUsersPure = [
  { id: 1, name: "Neha", active: true },
  { id: 2, name: "Aami", active: false },
];

const usersBeforePure = initialUsersPure;
console.log("Users before applying pure function:", usersBeforePure);

const usersAfterPure = updateUserPure(initialUsersPure, 2, {
  name: "Manu",
  active: true,
});
console.log("Users after applying impure function:", usersAfterPure);
console.log("Initial Users now: (They are not changed)", initialUsersPure);

// 2. five-step pipeline
console.log("================== 2 =======================");

// Takes a raw string and converts it into an array of raw objects.
function parseCSV(csvText) {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const rowObject = {};

    headers.forEach((header, index) => {
      rowObject[header.trim()] = values[index] ? values[index].trim() : "";
    });
    return rowObject;
  });
}

// Checks each record. Returns a NEW object adding an 'isValid' flag
function validateRows(rows) {
  return rows.map((row) => {
    const isValidRecord = row.name !== "" && row.rollno !== "";
    return {
      ...row,
      isValid: isValidRecord,
    };
  });
}

// Cleans up the valid data
function transformRows(rows) {
  return rows.map((row) => {
    if (row.isValid) {
      return {
        ...row,
        name: row.name.toUpperCase(),
        rollno: Number(row.rollno),
      };
    }
    return row;
  });
}

// Filter out invalid records using array .filter(
function filterInvalid(rows) {
  return rows.filter((row) => row.isValid === true);
}

// Converts the clean array of objects into a final presentation layout.
function formatOutput(rows) {
  return rows.map((row) => {
    return `Student ${row.name} holds Roll Number ${row.rollno}.`;
  });
}

const rawCSVData = `name,rollno
Neha,34
Aami,4
BrokenUser,
Rahul,47`;

const pipe =
  (...functions) =>
  (initialValue) => {
    return functions.reduce((currentValue, currentFunction) => {
      return currentFunction(currentValue);
    }, initialValue);
  };

const logStep1 = (data) => {
  console.log("\n[Step 1 Output - parseCSV]:\n", data);
  return data;
};
const logStep2 = (data) => {
  console.log("\n[Step 2 Output - validateRows]:\n", data);
  return data;
};
const logStep3 = (data) => {
  console.log("\n[Step 3 Output - transformRows]:\n", data);
  return data;
};
const logStep4 = (data) => {
  console.log("\n[Step 4 Output - filterInvalid]:\n", data);
  return data;
};

const studentProcessingPipeline = pipe(
  parseCSV,
  logStep1,
  validateRows,
  logStep2,
  transformRows,
  logStep3,
  filterInvalid,
  logStep4,
  formatOutput,
);

const finalOutput = studentProcessingPipeline(rawCSVData);
console.log(finalOutput);

// 3. deep freeze
console.log("================== 3 =======================");

const deepFreeze = (obj) => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  Object.keys(obj).forEach((key) => {
    deepFreeze(obj[key]);
  });
  return Object.freeze(obj);
};

const studentRecord = {
  name: "Manu",
  academic: {
    rollno: 36,
    location: {
      city: "Calicut",
      state: "Kerala",
    },
  },
  hobbies: ["Coding", "Reading"],
};

deepFreeze(studentRecord);

try {
  studentRecord.name = "Aami";
} catch (error) {
  console.log("[Test 1] Top-level change blocked:", error.message);
}

try {
  studentRecord.academic.rollno = 45;
} catch (error) {
  console.log("[Test 2] Nested level change blocked:", error.message);
}

try {
  studentRecord.academic.location.city = "Wayanad";
} catch (error) {
  console.log("[Test 3] Deeply nested level change blocked:", error.message);
}

try {
  studentRecord.hobbies.push("Gaming");
} catch (error) {
  console.log("[Test 4] Array push modification blocked:", error.message);
}

console.log("\nFinal verification of object contents:");
console.log(studentRecord);
