const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const ulList = document.getElementById("todo-ul");

addBtn.addEventListener("click", () => {
  const taskText = todoInput.value.trim();
  if (!taskText) return;

  const li = document.createElement("li");
  li.className = "todo-list";
  li.innerHTML = `<input type="checkbox" name="task-done" class="task-done">
                  <span class="todo-text"> ${taskText} </span>
                  <button class="delete-btn">Delete</button>`;

  ulList.appendChild(li);
  todoInput.value = "";
});

ulList.addEventListener("click", (event) => {
  //checkbox click (mark complete)
  const checkbox = event.target.closest(".task-done");
  if (checkbox) {
    const taskText = checkbox.nextElementSibling;
    taskText.style.textDecoration = checkbox.checked ? "line-through" : "none";
    return;
  }

  // delete button (remove)
  const deleteTask = event.target.closest(".delete-btn");
  if (deleteTask) {
    const itemToDelete = deleteTask.closest(".todo-list");
    itemToDelete.remove();
    return;
  }

  // text click
  const textToEdit = event.target.closest(".todo-text");
  if (textToEdit) {
    textToEdit.contentEditable = true;
    textToEdit.focus();

    //  Turn off editing when clicking away
    textToEdit.addEventListener(
      "blur",
      () => {
        textToEdit.contentEditable = false;
      },
      { once: true },
    );

    //  Turn off editing when clicking Enter
    textToEdit.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          textToEdit.blur();
        }
      },
      { once: true },
    );
  }
});
