let tasksData;
function populateTaskLists(tasksData) {
  const taskGroups = {
    ToDo: document.getElementById("todo-list"),
    Doing: document.getElementById("doing-list"),
    Done: document.getElementById("done-list"),
  };

  const user = auth.currentUser; // Get the current user

  Object.keys(taskGroups).forEach((status) => {
    const taskList = taskGroups[status];
    taskList.innerHTML = "";

    Object.keys(tasksData).forEach((taskId) => {
      const task = tasksData[taskId];

      // Check if the user is signed in and the task belongs to the user
      if (user && task.userId === user.email && task.taskStatus === status) {
        const taskItem = document.createElement("li");
        taskItem.className = "task-list-item";
        

        // Create a container for the task title
        const titleContainer = document.createElement("div");
        titleContainer.className = "title-container";
        titleContainer.addEventListener("click", (event) => {
          event.preventDefault();
          openTaskModalBySee(taskId); // Pass the taskId of the clicked task
        });

        // Create a task title element
        const taskTitle = document.createElement("span");
        taskTitle.textContent = task.taskTitle;

        // Create a container for edit and delete buttons
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "button-container";

        titleContainer.appendChild(taskTitle);

        // Create an edit button with Font Awesome icon
        const editButton = document.createElement("button");
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.className = "edit-button";
        editButton.addEventListener("click", (event) => {
          event.preventDefault();
          openEditTaskModal(taskId);
        });

        // Create a delete button with Font Awesome icon
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.className = "delete-button";
        deleteButton.addEventListener("click", () => deleteTask(taskId)); // Implement deleteTask

        // Append the edit and delete buttons to the button container
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);
        // Append the elements to the task item
        taskItem.appendChild(titleContainer);
        taskItem.appendChild(buttonContainer);

        taskItem.draggable = true;
        taskItem.setAttribute("data-task-id", taskId);

        taskItem.addEventListener("dragstart", (event) => {
          event.dataTransfer.setData(
            "text/plain",
            event.target.getAttribute("data-task-id")
          );
        });

        taskList.appendChild(taskItem);
      }
    });
  });
}

taskFormDb.on(
  "value",
  (snapshot) => {
    tasksData = snapshot.val(); // Update tasksData with the fetched data

    if (tasksData) {
      populateTaskLists(tasksData);
    } else {
      showToast("No tasks found.");
    }
  },
  (error) => {
    showToast("Error fetching tasks data:", error);
  }
);

function allowDrop(event) {
  event.preventDefault();
}

// function drop(event, status) {
//   event.preventDefault();
//   const taskId = event.dataTransfer.getData("text/plain");

//   if (taskId) {
//     // Update the task's status in the tasksData object
//     tasksData[taskId].taskStatus = status;

//     // Update UI after drop
//     populateTaskLists(tasksData);

//     // Update the task's status in the Firebase database
//     const taskRef = taskFormDb.child(taskId);
//     taskRef.update({ taskStatus: status }).catch((error) => {
//       showToast("Error updating task status:", error);
//     });
//   } else {
//     showToast("Invalid task ID");
//   }
// }



// ..........

let scrollInterval; // Variable to store the scrolling interval

function drop(event, status) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData("text/plain");

  if (taskId) {
    // Update the task's status in the tasksData object
    tasksData[taskId].taskStatus = status;

    // Update UI after drop
    populateTaskLists(tasksData);

    // Update the task's status in the Firebase database
    const taskRef = taskFormDb.child(taskId);
    taskRef.update({ taskStatus: status }).catch((error) => {
      showToast("Error updating task status:", error);
    });

    // Additional action after dropping a task item
    // For example, you can display a success message
    showToast("Task moved to " + status);

    // Clear any existing scroll interval
    clearInterval(scrollInterval);

    // Calculate the scroll threshold (adjust as needed)
    const scrollThreshold = 50;
    const screenHeight = window.innerHeight;
    const cursorPosition = event.clientY;

    if (cursorPosition <= scrollThreshold) {
      // Scroll up
      scrollInterval = setInterval(() => {
        window.scrollBy(0, -10); // Adjust the scroll amount as needed
      }, 10);
    } else if (cursorPosition >= screenHeight - scrollThreshold) {
      // Scroll down
      scrollInterval = setInterval(() => {
        window.scrollBy(0, 10); // Adjust the scroll amount as needed
      }, 10);
    } else {
      // If cursor is not near top or bottom, stop scrolling
      clearInterval(scrollInterval);
    }
  } else {
    showToast("Invalid task ID");
  }
}

// Stop scrolling when the drag operation ends
document.addEventListener("dragend", () => {
  clearInterval(scrollInterval);
});
