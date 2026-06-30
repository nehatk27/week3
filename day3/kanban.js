let activeKeyboardCard = null;
const columnOrder = [
  "to-do-container",
  "in-progress-container",
  "done-container",
];

const columns = document.querySelectorAll(".task-container");
columns.forEach((column) => {
  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("text/plain");
    const draggedCard = document.getElementById(cardId);

    if (draggedCard) {
      const ulList = column.querySelector("ul");
      ulList.appendChild(draggedCard);
      saveState();
    }
    column.classList.remove("drop-hover");
  });

  column.addEventListener("dragenter", (e) => {
    column.classList.add("drop-hover");
  });

  column.addEventListener("dragleave", (e) => {
    column.classList.remove("drop-hover");
  });
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
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    newLi.remove();
    saveState();
  });

  newLi.addEventListener("keydown", (e) => {
    if (e.key === " ") {
      e.preventDefault();

      if (!activeKeyboardCard) {
        activeKeyboardCard = newLi;
        newLi.classList.add("keyboard-moving");
      } else if (activeKeyboardCard === newLi) {
        activeKeyboardCard = null;
        newLi.classList.remove("keyboard-moving");
        saveState();
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
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const text = e.target.value.trim();
      if (text) {
        const result = createTaskElement(text, Date.now());
        const parentContainer = input.closest(".task-container");
        const childUl = parentContainer.querySelector("ul");
        childUl.appendChild(result);
        saveState();
      }
      e.target.value = "";
    }
  });
});

function saveState() {
  let state = [];
  const currentTasks = document.querySelectorAll(".task");
  currentTasks.forEach((task) => {
    const text = task.querySelector(".task-text").textContent.trim();
    const taskUniqueId = task.id;
    const parentId = task.closest(".task-container").id;

    state.push({
      id: taskUniqueId,
      text: text,
      parentId: parentId,
    });
  });
  localStorage.setItem("kanban", JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem("kanban");
  if (saved) {
    const state = JSON.parse(saved);
    state.forEach((item) => {
      const newCard = createTaskElement(item.text, item.id);
      const parentCol = document.getElementById(item.parentId);
      if (parentCol) {
        parentCol.querySelector("ul").appendChild(newCard);
      }
    });
  }
}

loadState();
