const loginForm = document.getElementById("login-form");
const registrationForm = document.getElementById("registration-form");
const userEmail = document.getElementById("user-email");
const userDetailDiv = document.getElementById("user-details");
const logoutLi = document.getElementById("logout-li");
const logoutLink = document.getElementById("logout-link");
const loginLi = document.getElementById("login-li");
const registerLi = document.getElementById("register-li");
const userName = document.getElementById("user-name");
const userId = document.getElementById("user-id");
const userIconLi = document.getElementById("user-icon-li");
const userIcon = document.getElementById("user-icon");

function saveTokenToLocalStorage(token) {
  localStorage.setItem("authToken", token);
}

function getTokenFromLocalStorage() {
  return localStorage.getItem("authToken");
}

function removeTokenFromLocalStorage() {
  localStorage.removeItem("authToken");
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    saveTokenToLocalStorage(await user.getIdToken());
    userDetailDiv.style.display = "block";
    displayUserDetails();
    if (getTokenFromLocalStorage()) {
      window.location.reload(); // Reload the page if authToken is present
    }
  } catch (error) {
    console.error(error.message);
    showToast(error.message);
  }
});

registrationForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("reg-name").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;

  try {
    const userCredential = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    saveTokenToLocalStorage(await user.getIdToken());
    await user.updateProfile({
      displayName: name,
    });
    if (getTokenFromLocalStorage()) {
      window.location.reload(); // Reload the page if authToken is present
    }
  } catch (error) {
    console.error(error.message);
    showToast(error.message);
  }
});

function displayUserDetails() {
  const user = firebase.auth().currentUser;

  if (user) {
    userEmail.textContent = user.email;
    userName.textContent = user.displayName || "N/A"; // Use displayName or 'N/A' if not available
    userId.textContent = user.uid;
  } else {
    userEmail.textContent = "Not logged in";
    userName.textContent = "";
    userId.textContent = "";
  }
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    saveTokenToLocalStorage(getTokenFromLocalStorage());
    displayUserDetails();
  } else {
    removeTokenFromLocalStorage();
    userDetailDiv.style.display = "none";
  }
});

const authToken = getTokenFromLocalStorage();
const hasRedirected = localStorage.getItem("hasRedirected");

if (authToken && !hasRedirected) {
  localStorage.setItem("hasRedirected", "true");
  window.location.reload(); // Redirect to home page
}

logoutLink.addEventListener("click", () => {
  firebase.auth().signOut();
  window.location.reload();
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    saveTokenToLocalStorage(getTokenFromLocalStorage());
    displayUserDetails();
    loginLi.style.display = "none"; // Hide login link
    registerLi.style.display = "none"; // Hide registration link
    logoutLi.style.display = "block"; // Show logout link
    userIconLi.style.display = "block"; // Show user icon
  } else {
    removeTokenFromLocalStorage();
    userDetailDiv.style.display = "none";
    logoutLi.style.display = "none"; // Hide logout link
    loginLi.style.display = "block"; // Show login link
    registerLi.style.display = "block"; // Show registration link
    userIconLi.style.display = "none"; // Hide user icon
  }
});
