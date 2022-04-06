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
  if (state.red === "true") {
    document.querySelector(".light.red").classList.remove("deactivated");
    document.querySelector(".light.red").parentElement.querySelector(".label")
      .innerHTML = "Activated";
  } else {
    document.querySelector(".light.red").classList.add("deactivated");
    document.querySelector(".light.red").parentElement.querySelector(".label")
      .innerHTML = "Deactivated";
  }
  if (state.green === "true") {
    document.querySelector(".light.green").classList.remove("deactivated");
    document.querySelector(".light.green").parentElement.querySelector(".label")
      .innerHTML = "Activated";
  } else {
    document.querySelector(".light.green").classList.add("deactivated");
    document.querySelector(".light.green").parentElement.querySelector(".label")
      .innerHTML = "Deactivated";
  }
  if (state.blue === "true") {
    document.querySelector(".light.blue").classList.remove("deactivated");
    document.querySelector(".light.blue").parentElement.querySelector(".label")
      .innerHTML = "Activated";
  } else {
    document.querySelector(".light.blue").classList.add("deactivated");
    document.querySelector(".light.blue").parentElement.querySelector(".label")
      .innerHTML = "Deactivated";
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