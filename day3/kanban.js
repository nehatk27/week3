let activeKeyboardCard = null;
const columnOrder = [
  "to-do-container",
  "in-progress-container",
  "done-container",
];

const kanbanDB = new OfflineDB("KanbanDatabase", 1);

const storesConfig = [{ name: "tasks", keyPath: "id" }];

const columns = document.querySelectorAll(".task-container");
columns.forEach((column) => {
  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", async (e) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("text/plain");
    const draggedCard = document.getElementById(cardId);

    if (draggedCard) {
      const ulList = column.querySelector("ul");
      ulList.appendChild(draggedCard);
      await saveState(); // Persistence
    }
    column.classList.remove("drop-hover");
  });

  column.addEventListener("dragenter", (e) =>
    column.classList.add("drop-hover"),
  );
  column.addEventListener("dragleave", (e) =>
    column.classList.remove("drop-hover"),
  );
});

function createTaskElement(text, id) {
  const newLi = document.createElement("li");
  newLi.classList.add("task");
  newLi.setAttribute("id", id);
  newLi.setAttribute("draggable", "true");
  newLi.setAttribute("tabindex", "0");

  newLi.innerHTML = `<span class="task-text">${text}</span><button class="delete-btn">X</button>`;

  newLi.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
  });

  const deleteBtn = newLi.querySelector("button");
  deleteBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    newLi.remove();
    await kanbanDB.deleteRecord("tasks", String(id));
  });

  newLi.addEventListener("keydown", async (e) => {
    if (e.key === " ") {
      e.preventDefault();

      if (!activeKeyboardCard) {
        activeKeyboardCard = newLi;
        newLi.classList.add("keyboard-moving");
      } else if (activeKeyboardCard === newLi) {
        activeKeyboardCard = null;
        newLi.classList.remove("keyboard-moving");
        await saveState();
      }
    }

    if (activeKeyboardCard === newLi) {
      const currentColumnId = newLi.closest(".task-container").id;
      let currentIdx = columnOrder.indexOf(currentColumnId);

      if (e.key === "ArrowRight") {
        if (currentIdx < columnOrder.length - 1) {
          currentIdx++;
          const targetCol = document.getElementById(columnOrder[currentIdx]);
          targetCol.querySelector("ul").appendChild(newLi);
          newLi.focus();
        }
      } else if (e.key === "ArrowLeft") {
        if (currentIdx > 0) {
          currentIdx--;
          const targetCol = document.getElementById(columnOrder[currentIdx]);
          targetCol.querySelector("ul").appendChild(newLi);
          newLi.focus();
        }
      }
    }
  });

  return newLi;
}

const inputTask = document.querySelectorAll(".input-field");
inputTask.forEach((input) => {
  input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      const text = e.target.value.trim();
      if (text) {
        // Stringify ID so primary keys map consistently
        const taskId = String(Date.now());
        const result = createTaskElement(text, taskId);
        const parentContainer = input.closest(".task-container");
        const childUl = parentContainer.querySelector("ul");
        childUl.appendChild(result);
        await saveState();
      }
      e.target.value = "";
    }
  });
});

async function saveState() {
  const currentTasks = document.querySelectorAll(".task");

  for (const task of currentTasks) {
    const text = task.querySelector(".task-text").textContent.trim();
    const taskUniqueId = task.id;
    const parentId = task.closest(".task-container").id;

    await kanbanDB.updateRecord("tasks", {
      id: taskUniqueId,
      text: text,
      parentId: parentId,
    });
  }
}

async function loadState() {
  try {
    const state = await kanbanDB.getAllRecords("tasks");
    if (state && state.length > 0) {
      state.forEach((item) => {
        const newCard = createTaskElement(item.text, item.id);
        const parentCol = document.getElementById(item.parentId);
        if (parentCol) {
          parentCol.querySelector("ul").appendChild(newCard);
        }
      });
    }
  } catch (err) {
    console.error("Could not load tasks:", err);
  }
}

async function initApp() {
  try {
    await kanbanDB.openDB(storesConfig);
    await loadState();
  } catch (error) {
    console.error("Database connection failure:", error);
  }
}

initApp();

//  =============== sync mechanism (mock API) ===========
async function syncDataOnline() {
  try {
    const states = await kanbanDB.getAllRecords("tasks");
    if (!states || states.length === 0) {
      console.log("Sync skipped: No local board data found to upload");
      return;
    }
    const data = states[0];
    console.log("Syncing states", data);
    const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Kanban Board",
        body: data,
        userId: 1,
      }),
    });
    if (response.ok) {
      const result = await response.json();
      console.log("Sync complete", result);
    } else {
      throw new Error(response.status);
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}

window.addEventListener("online", () => {
  syncDataOnline();
});
