//  Select elements
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const errorMessage = document.querySelector("#error-message");
const taskList = document.querySelector("#task-list");
const summary = document.querySelector("#summary");
const emptyState = document.querySelector("#empty-state");
const clearDoneButton = document.querySelector("#clear-done");

//  Data
const MAX_LENGTH = 60; // maksimal kata
let nextId = 1;

const initialTasks = [
  { text: "Write semantic HTML for the profile page", done: true },
  { text: "Add CSS Grid and a mobile breakpoint", done: true },
  { text: "Finish the DOM & events exercise", done: false },
];

//  Functions
function validateTask(text) {
  if (text.length === 0) {
    return "Task can't be empty.";
  }
  if (text.length > MAX_LENGTH) {
    return `Keep it under ${MAX_LENGTH} characters (now ${text.length}).`;
  }
  return "";
}

function createTaskElement(text, done = false) {
  const li = document.createElement("li");
  li.className = "task-item";
  li.dataset.id = nextId;
  nextId++;

  const textSpan = document.createElement("span");
  textSpan.className = "task-text";
  textSpan.textContent = text;

  const toggleButton = document.createElement("button");
  toggleButton.type = "button";
  toggleButton.className = "toggle-button";

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-button";
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("aria-label", `Delete task: ${text}`);

  toggleButton.addEventListener("click", () => {
    // toggle() mengembalikan true kalau class-nya sekarang ada
    const isDone = li.classList.toggle("is-done");
    updateToggleLabel(toggleButton, isDone);
    updateSummary();
  });

  deleteButton.addEventListener("click", () => {
    li.remove();
    updateSummary();
  });

  if (done) {
    li.classList.add("is-done");
  }
  updateToggleLabel(toggleButton, done);

  li.append(textSpan, toggleButton, deleteButton);
  return li;
}

function updateToggleLabel(button, isDone) {
  button.textContent = isDone ? "Undo" : "Done";
}

function updateSummary() {
  const total = taskList.querySelectorAll(".task-item").length;
  const done = taskList.querySelectorAll(".task-item.is-done").length;
  const remaining = total - done;

  summary.textContent = `${done} of ${total} tasks done`;
  emptyState.hidden = total > 0;
  clearDoneButton.hidden = done === 0;
  summary.classList.toggle("all-done", total > 0 && remaining === 0);
}

function showError(message) {
  errorMessage.textContent = message;
  input.classList.toggle("has-error", message !== "");
}

//  Events
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();
  const error = validateTask(text);

  if (error) {
    showError(error);
    return;
  }

  showError("");
  taskList.append(createTaskElement(text));
  updateSummary();

  input.value = "";
  input.focus();
});

input.addEventListener("input", () => {
  if (errorMessage.textContent !== "") {
    showError("");
  }
});

clearDoneButton.addEventListener("click", () => {
  taskList
    .querySelectorAll(".task-item.is-done")
    .forEach((task) => task.remove());
  updateSummary();
});

//  Initial render
initialTasks.forEach((task) => {
  taskList.append(createTaskElement(task.text, task.done));
});

updateSummary();
