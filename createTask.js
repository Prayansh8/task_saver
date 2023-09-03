const auth = firebase.auth();
const taskFormDb = firebase.database().ref("tasks");

document.getElementById("task-form").addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();

  const user = auth.currentUser;

  if (user) {
    const userId = user.email;
    const taskTitle = getValueById("task-title");
    const taskDescription = getValueById("task-description");
    const taskStatus = getValueById("task-status");

    saveTaskData(userId, taskTitle, taskDescription, taskStatus)
      .then(() => {
        closeTaskModal();
        resetFormFields();
      })
      .catch((error) => {
        console.error("Error saving task data:", error);
        showToast("Error saving task data:", error);
      });
  } else {
    console.log("No user is signed in.");
    showToast("No user is signed in, Please signed first!");
  }
}

// Add this function to reset form fields
function resetFormFields() {
  document.getElementById("task-title").value = "";
  document.getElementById("task-description").value = "";
  // You may also reset other form fields if needed
}


function createTaskElement(title, description) {
  const taskElement = document.createElement("li");
  taskElement.textContent = title + ": " + description;
  taskElement.draggable = true;
  taskElement.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", title + ": " + description);
  });
  return taskElement;
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event, targetStatus) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text/plain");
  const taskListId = targetStatus.toLowerCase() + "-list";
  const taskList = document.getElementById(taskListId);
  const newTaskElement = document.createElement("li");
  newTaskElement.textContent = data;
  taskList.appendChild(newTaskElement);
}

function getValueById(id) {
  return document.getElementById(id).value;
}

function openTaskModal(status) {
  document.getElementById("task-status").value = status;
  const modal = document.getElementById("task-modal");
  modal.style.display = "block";
}

function closeTaskModal() {
  const modal = document.getElementById("task-modal");
  modal.style.display = "none";
}

document.getElementById("task-close").addEventListener("click", closeTaskModal);

const saveTaskData = (userId, taskTitle, taskDescription, taskStatus) => {
  const taskFormDb = firebase.database().ref("tasks"); // Reference to your Firebase database
  const newTaskData = taskFormDb.push();
  return newTaskData.set({
    userId: userId,
    taskTitle: taskTitle,
    taskDescription: taskDescription,
    taskStatus: taskStatus,
  });
};
