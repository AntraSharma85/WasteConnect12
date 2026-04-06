/********************************************
 * GLOBAL VARIABLES
 ********************************************/
let currentUser = null;
let pickupRequests = [];

/********************************************
 * LOCAL STORAGE HELPERS
 ********************************************/
function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadData(key) {
  return JSON.parse(localStorage.getItem(key)) || null;
}

/********************************************
 * NAVBAR ACCOUNT MENU
 ********************************************/
function updateAccountMenu() {
  const dropdown = document.getElementById("accountDropdown");
  if (!dropdown) return;

  dropdown.innerHTML = "";

  if (!currentUser) {
    // Not logged in
    dropdown.innerHTML = `
      <li><a href="login.html">Login</a></li>
      <li><a href="signup.html">Sign Up</a></li>
    `;
  } else {
    // Logged in
    dropdown.innerHTML = `
      <li><span style="padding:10px; display:block;">Hello, ${currentUser.name}</span></li>
      <li><a href="#" onclick="showPickupHistory()">Pickup History</a></li>
      <li><a href="#">Profile</a></li>
      <li><a href="#" onclick="logoutUser()">Logout</a></li>
    `;
  }
}

function logoutUser() {
  currentUser = null;
  saveData("currentUser", null);
  updateAccountMenu();
}

/********************************************
 * SIGNUP & LOGIN SYSTEM
 ********************************************/
function signupUser(name, email, password) {
  let users = loadData("users") || [];

  if (users.find(u => u.email === email)) {
    alert("User already exists with this email!");
    return false;
  }

  let newUser = { name, email, password, history: [] };
  users.push(newUser);
  saveData("users", users);

  alert("Signup successful! Please login.");
  window.location.href = "login.html";
  return true;
}

function loginUser(email, password) {
  let users = loadData("users") || [];
  let user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid email or password.");
    return false;
  }

  currentUser = user;
  saveData("currentUser", currentUser);

  alert("Welcome back, " + user.name + "!");
  window.location.href = "index.html";
  return true;
}

/********************************************
 * PICKUP REQUEST FORM
 ********************************************/
function submitPickupRequest(form) {
  if (!currentUser) {
    alert("Please login first to place a request.");
    return;
  }

  const name = form.querySelector("#reqName").value;
  const type = form.querySelector("#reqWaste").value;
  const address = form.querySelector("#reqAddress").value;

  const recyclableTypes = ["Plastic", "Paper", "Metal"];
  const recyclable = recyclableTypes.includes(type);

  let serviceCharge = recyclable ? 0 : 100;
  let benefits = recyclable ? "Zero service charge & reward points!" : "Safe disposal service";

  const request = {
    user: currentUser.email,
    name: name,
    type: type,
    address: address,
    recyclable: recyclable,
    serviceCharge: serviceCharge,
    benefits: benefits,
    date: new Date().toLocaleDateString(),
    status: "Scheduled (within 24 hrs)"
  };

  pickupRequests.push(request);

  let users = loadData("users") || [];
  let user = users.find(u => u.email === currentUser.email);
  if (user) {
    user.history.push(request);
    saveData("users", users);
    currentUser = user;
    saveData("currentUser", user);
  }

  alert(
    "Request submitted!\nWaste: " + type +
    "\n" + benefits +
    "\nService Charge: ₹" + serviceCharge +
    "\nPickup: " + request.status
  );

  form.reset();
}

/********************************************
 * PICKUP HISTORY
 ********************************************/
function showPickupHistory() {
  if (!currentUser || !currentUser.history || currentUser.history.length === 0) {
    alert("No pickup history found.");
    return;
  }

  let historyText = "Your Pickup History:\n\n";
  currentUser.history.forEach(item => {
    historyText += item.type + " - " + item.date + " - " + item.status + "\n";
  });

  alert(historyText);
}

/********************************************
 * PAGE INITIALIZATION
 ********************************************/
document.addEventListener("DOMContentLoaded", () => {
  currentUser = loadData("currentUser");
  updateAccountMenu();

  // Login form
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;
      loginUser(email, password);
    });
  }

  // Signup form
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("signupName").value;
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;
      signupUser(name, email, password);
    });
  }

  // Pickup request form
  const pickupForm = document.getElementById("pickupForm");
  if (pickupForm) {
    pickupForm.addEventListener("submit", e => {
      e.preventDefault();
      submitPickupRequest(pickupForm);
    });
  }
});

const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');

  menuToggle.addEventListener('click', () => {
    menu.classList.toggle('show');
  });