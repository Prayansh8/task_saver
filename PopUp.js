// Get references to the modal elements
const loginModal = document.getElementById("login-modal");
const registerModal = document.getElementById("register-modal");
const userModal = document.getElementById("user-modal");
const seeTaskModal = document.getElementById("see-task-modal");

// Get references to the links that open the modals
const loginLink = document.getElementById("login-link");
const registerLink = document.getElementById("register-link");
const userLink = document.getElementById("user-icon");

// Get references to the close buttons
const loginModalCloseButton = document.getElementById(
  "login-modal-close-button"
);
const registerModalCloseButton = document.getElementById(
  "register-modal-close-button"
);

const userModalCloseButton = document.getElementById("user-modal-close-button");
const seeTaskModalCloseButton = document.getElementById("see-task-modal-close-button")
// Function to open a modal
function openModal(modal) {
  modal.style.display = "flex";
}

// Function to close a modal
function closeModal(modal) {
  modal.style.display = "none";
}

// Event listeners to open and close modals
loginLink.addEventListener("click", () => openModal(loginModal));
registerLink.addEventListener("click", () => openModal(registerModal));
userLink.addEventListener("click", () => openModal(userModal));
loginModalCloseButton.addEventListener("click", () => closeModal(loginModal));
registerModalCloseButton.addEventListener("click", () =>
  closeModal(registerModal)
);
userModalCloseButton.addEventListener("click", () => closeModal(userModal));
seeTaskModalCloseButton.addEventListener("click", () => closeModal(seeTaskModal));
function openModalT() {
  var modalT = document.getElementById("task-modal");
  modalT.style.display = "block";
}

function closeModalT() {
  var modalT = document.getElementById("task-modal");
  modalT.style.display = "none";
}

// Attach event listener to "Create Task" buttons
var createTaskButtons = document.querySelectorAll(".create-task-button");
createTaskButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    openModalT();
  });
});

const taskModalCloseButton = document.getElementById("task-close");
taskModalCloseButton.addEventListener("click", () => closeModalT());
