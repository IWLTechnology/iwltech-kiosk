var nOfSquares = 6;
var actions = [];
var dev_actions = [];
var sysData = {};
var socket;
var LOCKED = true;
var bgId;
var confirmActionDoes = "";

function initMenu() {
  socket = io();
  socket.on("serverSend", (data) => {
    recvData(data);
  });
  sendData({ mode: "requestData" });
}

function sendData(data) {
  socket.emit("clientSend", data);
}

function recvData(data) {
  switch (data.wyd) {
    case "requestData":
      if (data.success) {
        sysData = data.result;
        sendData({ mode: "requestActions" });
      } else {
        displayError("Failed to fetch system data.");
      }
      break;
    case "requestActions":
      if (data.success) {
        actions = data.result.actions;
        dev_actions = data.result.dev_actions;
        parseActions();
        parseDevActions();
        parseSysData();
        LOCKED = false;
        document.getElementById("enabled").style.display = "block";
      } else {
        displayError("Failed to fetch actions.");
      }
      break;
    case "action":
      if (data.success) {
        actionResult(data.result);
      } else {
        displayError("Failed to perform action. Error: " + data.result);
      }
      break;
    case "dev_action":
      if (data.success) {
        actionResult(data.result);
      } else {
        displayError("Failed to perform action. Error: " + data.result);
      }
      break;
  }
}

function displayError(err) {
  document.getElementById("error").innerHTML = err;
  document.getElementById("errorBox").style.display = "block";
  document.getElementById("enabled").style.display = "none";
}

function parseActions() {
  var actionText = "";
  var actionTitle = "";
  var buttonSize = Math.floor(window.innerWidth / (nOfSquares + 1));
  if (buttonSize > window.innerHeight * 0.9) {
    buttonSize = window.innerHeight;
  }
  for (var i = 0; i < actions.length; i++) {
    actionTitle = actions[i][0];
    if (actions[i][2] == null || actions[i][2] == undefined) {
      actionText = `<p>${actionTitle}</p>`;
    } else {
      actionText = actions[i][2];
      actionText = `<img src="./programIcons/${actionText}" class="actionIcon w3-round-xxlarge" alt="${actionTitle}">`;
    }

    document.getElementById("actions").innerHTML +=
      `<button class="action w3-btn w3-round-xxlarge" style="width: ${buttonSize}px; height: ${buttonSize}px;" onclick="performAction(${i})" title="${actionTitle}">${actionText}</button>`;
    if ((i + 1) / nOfSquares == Math.ceil((i + 1) / nOfSquares) && i != 0) {
      document.getElementById("actions").innerHTML += `<br><br>`;
    }
  }
}

function parseDevActions() {
  var actionText = "";
  var actionTitle = "";
  var buttonSize = Math.floor(window.innerWidth / (nOfSquares + 1));
  if (buttonSize > window.innerHeight * 0.9) {
    buttonSize = window.innerHeight;
  }
  for (var i = 0; i < dev_actions.length; i++) {
    actionTitle = dev_actions[i][0];
    if (dev_actions[i][2] == null || dev_actions[i][2] == undefined) {
      actionText = `<p>${actionTitle}</p>`;
    } else {
      actionText = dev_actions[i][2];
      actionText = `<img src="./programIcons/${actionText}" class="actionIcon w3-round-xxlarge" alt="${actionTitle}">`;
    }

    document.getElementById("dev_actions").innerHTML +=
      `<button class="action w3-btn w3-round-xxlarge" style="width: ${buttonSize}px; height: ${buttonSize}px;" onclick="performDevAction(${i})" title="${actionTitle}">${actionText}</button>`;
    if ((i + 1) / nOfSquares == Math.ceil((i + 1) / nOfSquares) && i != 0) {
      document.getElementById("dev_actions").innerHTML += `<br><br>`;
    }
  }
}

function parseSysData() {
  sysData.hostname = sysData.hostname.split("\n")[0];
  document.getElementById("hostname").innerHTML = sysData.hostname;
  document.getElementById("hostname2").innerHTML = sysData.hostname;
  setBackground();
}

function performAction(n) {
  if (!LOCKED) {
    sendData({ mode: "action", toExec: n });
    LOCKED = true;
  }
}

function performDevAction(n) {
  if (!LOCKED) {
    sendData({ mode: "dev_action", toExec: n });
    LOCKED = true;
  }
}

function powerBtn() {
  document.getElementById("powerOptions").style.display = "block";
  document.getElementById("enabled").style.display = "none";
}
function powerBtn2() {
  document.getElementById("powerOptions").style.display = "block";
  document.getElementById("devMenu").style.display = "none";
}

function powerMenu(opt) {
  switch (opt) {
    case 0:
      document.getElementById("confirmAction").innerHTML = "Shut down";
      confirmActionDoes = "shutdown";
      document.getElementById("confirmScreen").style.display = "block";
      document.getElementById("powerOptions").style.display = "none";
      break;
    case 1:
      document.getElementById("confirmAction").innerHTML = "Restart";
      confirmActionDoes = "restart";
      document.getElementById("confirmScreen").style.display = "block";
      document.getElementById("powerOptions").style.display = "none";
      break;
    case 2:
      document.getElementById("confirmAction").innerHTML = "Log Out";
      confirmActionDoes = "logout";
      document.getElementById("confirmScreen").style.display = "block";
      document.getElementById("powerOptions").style.display = "none";
      break;
    case 3:
      document.getElementById("enabled").style.display = "block";
      document.getElementById("powerOptions").style.display = "none";
      break;
  }
}

function confirmScreen(opt) {
  switch (opt) {
    case 0:
      document.getElementById("powerOptions").style.display = "block";
      document.getElementById("confirmScreen").style.display = "none";
      break;
    case 1:
      sendData({ mode: "action", toExec: confirmActionDoes });
      break;
  }
}

function devBtn(opt) {
  if (opt == 0) {
    document.getElementById("devMenu").style.display = "block";
    document.getElementById("enabled").style.display = "none";
  } else {
    document.getElementById("enabled").style.display = "block";
    document.getElementById("devMenu").style.display = "none";
  }
}

function actionResult(res) {
  LOCKED = false;
}

function setBackground() {
  bgId = Math.floor(Math.random() * sysData.noOfBackgrounds) + 1;
  document.body.style.backgroundImage = `url("./backgrounds/${bgId}")`;
}
