const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const totalSpan = document.getElementById("totalCount");
const doneSpan = document.getElementById("doneCount");
const clearAllBtn = document.getElementById("clearAllBtn");

function updateStats() {
  const allTasks = document.querySelectorAll(".task-item");
  const total = allTasks.length;
  const completed = Array.from(allTasks).filter((task) =>
    task.classList.contains("done"),
  ).length;
  totalSpan.textContent = total;
  doneSpan.textContent = completed;
}

function saveTasksToStorage() {
  const tasksArray = [];
  const allLiElements = document.querySelectorAll(".task-item");
  allLiElements.forEach((li) => {
    const textSpan = li.querySelector(".task-text");
    let taskText = "";
    if (textSpan) {
      taskText = textSpan.textContent.trim();
    } else {
      taskText = li.textContent.replace(/[✔️❌🗑]/g, "").trim();
    }
    const isDone = li.classList.contains("done");
    tasksArray.push({
      text: taskText,
      done: isDone,
    });
  });
  localStorage.setItem("tasksManagerApp", JSON.stringify(tasksArray));
}

function createTaskElement(taskText, isDone = false) {
  const li = document.createElement("li");
  li.className = "task-item";
  if (isDone) li.classList.add("done");

  const textSpan = document.createElement("span");
  textSpan.className = "task-text";
  textSpan.textContent = taskText;

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "task-actions";

  const doneBtn = document.createElement("button");
  doneBtn.innerHTML = "✔️";
  doneBtn.className = "done-btn";
  doneBtn.title = "Toggle Completion";

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "🗑";
  deleteBtn.className = "delete-btn";
  deleteBtn.title = "Delete Task";

  doneBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    li.classList.toggle("done");
    updateStats();
    saveTasksToStorage();
  });

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    li.remove();
    updateStats();
    saveTasksToStorage();
    checkEmptyListMessage();
  });

  textSpan.addEventListener("dblclick", (e) => {
    e.stopPropagation();
    li.classList.toggle("done");
    updateStats();
    saveTasksToStorage();
  });

  li.addEventListener("dblclick", (e) => {
    if (e.target.tagName === "BUTTON") return;
    li.classList.toggle("done");
    updateStats();
    saveTasksToStorage();
  });

  actionsDiv.appendChild(doneBtn);
  actionsDiv.appendChild(deleteBtn);
  li.appendChild(textSpan);
  li.appendChild(actionsDiv);

  return li;
}

function checkEmptyListMessage() {
  const existingEmptyMsg = document.querySelector(".empty-message");
  const allTasks = document.querySelectorAll(".task-item");
  if (allTasks.length === 0) {
    if (!existingEmptyMsg) {
      const emptyDiv = document.createElement("div");
      emptyDiv.className = "empty-message";
      emptyDiv.id = "emptyMsgPlaceholder";
      emptyDiv.textContent =
        "📭 No tasks yet... Add your first task from the top ✨";
      taskList.appendChild(emptyDiv);
    }
  } else {
    if (existingEmptyMsg) existingEmptyMsg.remove();
  }
}

function addNewTask() {
  const rawText = taskInput.value.trim();
  if (rawText === "") {
    taskInput.placeholder = "✏️ Please write a task before adding!";
    taskInput.classList.add("error-shake");
    setTimeout(() => {
      taskInput.placeholder =
        "Example: Complete the report, Read a book, Study JavaScript ...";
      taskInput.classList.remove("error-shake");
    }, 1000);
    return;
  }

  const emptyMsg = document.querySelector(".empty-message");
  if (emptyMsg) emptyMsg.remove();

  const newTaskLi = createTaskElement(rawText, false);
  taskList.appendChild(newTaskLi);

  taskInput.value = "";
  taskInput.focus();

  updateStats();
  saveTasksToStorage();
  checkEmptyListMessage();
}

function loadTasksFromStorage() {
  const storedData = localStorage.getItem("tasksManagerApp");
  let tasks = [];
  if (storedData) {
    try {
      tasks = JSON.parse(storedData);
      if (!Array.isArray(tasks)) tasks = [];
    } catch (e) {
      tasks = [];
    }
  }

  taskList.innerHTML = "";

  if (tasks.length === 0) {
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "empty-message";
    emptyDiv.textContent =
      "📭 No tasks yet... Add your first task from the top ✨";
    taskList.appendChild(emptyDiv);
  } else {
    tasks.forEach((task) => {
      const taskTextValue =
        task.text && typeof task.text === "string"
          ? task.text
          : "Unspecified task";
      const isCompleted = task.done === true;
      const liElement = createTaskElement(taskTextValue, isCompleted);
      taskList.appendChild(liElement);
    });
  }
  updateStats();
}

function clearAllTasks() {
  if (confirm("⚠️ Are you sure? All tasks will be deleted permanently.")) {
    const allItems = document.querySelectorAll(".task-item");
    allItems.forEach((item) => item.remove());
    updateStats();
    saveTasksToStorage();
    checkEmptyListMessage();
    if (document.querySelectorAll(".task-item").length === 0) {
      const existingEmpty = document.querySelector(".empty-message");
      if (!existingEmpty) {
        const emptyDiv = document.createElement("div");
        emptyDiv.className = "empty-message";
        emptyDiv.textContent =
          "📭 No tasks yet... Add your first task from the top ✨";
        taskList.appendChild(emptyDiv);
      }
    }
  }
}

function bindEvents() {
  addButton.addEventListener("click", () => {
    addNewTask();
  });

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addNewTask();
    }
  });

  clearAllBtn.addEventListener("click", clearAllTasks);
}

function init() {
  loadTasksFromStorage();
  bindEvents();
  updateStats();
}

const styleShake = document.createElement("style");
styleShake.textContent = `
            .error-shake {
            animation: shake 0.3s ease-in-out 0s 2;
            border-color: #c23b22 !important;
            }
            @keyframes shake {
            0%,100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
            }
        `;
document.head.appendChild(styleShake);

init();
