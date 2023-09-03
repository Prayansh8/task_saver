//  Detele Task

function deleteTask(taskId) {
  const db = firebase.database();
  const ref = db.ref("tasks"); // Replace with the path to your data node

  ref
    .child(taskId)
    .remove()
    .then(() => {
      showToast("Data deleted successfully");
    })
    .catch((error) => {
      showToast("Error deleting data:", error);
    });
}

// Function to get task data by taskId from Firebase
function getTaskById(taskId) {
  const db = firebase.database();
  const taskRef = db.ref("tasks/" + taskId); // Replace with the path to your data node

  return taskRef
    .once("value")
    .then((snapshot) => {
      const taskData = snapshot.val();
      if (taskData) {
        return taskData;
      } else {
        throw new Error("Task not found");
      }
    })
    .catch((error) => {
      console.error("Error getting task data:", error);
      throw error;
    });
}

// Function to open the edit task modal
function openEditTaskModal(taskId) {
  const modal = document.getElementById("edit-task-modal");
  const closeModal = document.getElementById("edit-task-close-button");

  // Declare these variables outside the Promise callback
  let taskTitleInput, taskDescriptionInput;

  // Populate the form with existing task data (if needed)
  getTaskById(taskId)
    .then((task) => {
      taskTitleInput = document.getElementById("edit-task-title");
      taskDescriptionInput = document.getElementById("edit-task-description");

      taskTitleInput.value = task.taskTitle || "";
      taskDescriptionInput.value = task.taskDescription || "";
    })
    .catch((error) => {
      console.error("Error getting task data:", error);
    });

  // Show the modal
  modal.style.display = "block";

  // Close the modal when the "X" button is clicked
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close the modal when the user clicks outside of it
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Handle the form submission (you can implement this part)
  const editTaskForm = document.getElementById("edit-task-form");
  editTaskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    // Get the updated task data from the form
    const updatedTask = {
      taskTitle: taskTitleInput.value,
      taskDescription: taskDescriptionInput.value,
    };
    // Implement a function to update the task data in your database
    updateTask(taskId, updatedTask);
    // Close the modal
    modal.style.display = "none";
  });
}

function updateTask(taskId, updatedTask) {
  const db = firebase.database();
  const ref = db.ref("tasks"); // Replace with the path to your data node

  // Update the data at the specified ID
  ref
    .child(taskId)
    .update(updatedTask)
    .then(() => {
      showToast("Data updated successfully");
    })
    .catch((error) => {
      showToast("Error editing data:", error);
    });
}

function openTaskModalBySee(taskId) {
  const modal = document.getElementById("see-task-modal");
  const modalTitle = modal.querySelector("#modal-title");
  const modalDescription = modal.querySelector("#modal-description");
  const modalStatus = modal.querySelector("#modal-status");

  // You can use taskId to fetch the relevant task details from tasksData
  const task = tasksData[taskId];

  // Set the modal content based on the task
  modalTitle.textContent = task.taskTitle;
  modalDescription.textContent = task.taskDescription;
  modalStatus.textContent = task.taskStatus;

  // Make the modal visible
  modal.style.display = "block";
}

// Function to close see-task-modal
function closeSeeTaskModal() {
  const modal = document.getElementById("see-task-modal");
  modal.style.display = "none"; // Hide the modal
}

const seeTaskModalCloseButton = document.getElementById(
  "see-task-modal-close-button"
);

seeTaskModalCloseButton.addEventListener("click", () => {
  closeSeeTaskModal();
});
