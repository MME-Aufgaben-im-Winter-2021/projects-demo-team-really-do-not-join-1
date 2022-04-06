import AppwriteService from "./services/AppwriteService.js";

var online = false;

function init() {
  document.querySelector(".login [name=\"login\"]").addEventListener("click",
    login);
  document.querySelectorAll(".light-container").forEach((el) => el
    .addEventListener("click", onColorClicked));
}

async function login() {
  let email = document.querySelector(".login [name=\"email\"]").value,
    password = document.querySelector(".login [name=\"password\"]").value,
    status = await AppwriteService.openSession(email, password);
  if (status === "OK") {
    online = true;
    AppwriteService.fetchGameState().then(onGameStateChanged);
    AppwriteService.subscribe(onGameStateChanged);
    setStatus("Online");
  }
}

function onGameStateChanged(state) {
    toggleColorState("red", state.red);
    toggleColorState("green", state.green);
    toggleColorState("blue", state.blue);
}

function toggleColorState(color, state) {
    let element = document.querySelector(`.light.${color}`);
    if (state === "true") {
        element.classList.remove("deactivated");
        element.parentElement.querySelector(".label").innerHTML = "Activated";
      } else {
        element.classList.add("deactivated");
        element.parentElement.querySelector(".label").innerHTML = "Deactivated";
      }
}

function onColorClicked(event) {
  let color = event.target.closest(".light-container").getAttribute(
      "data-color"),
    state = event.target.closest(".light-container").querySelector(".light")
    .classList.contains("deactivated").toString();
  if (online === true) {
    AppwriteService.updateGameState(color, state);
  }
}

function setStatus(status) {
  document.querySelector(".status").innerHTML = status;
}


init();