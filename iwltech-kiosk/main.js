const express = require('express');
const http = require('http');
const socket = require('socket.io');
const hbs = require('hbs');
const join = require('join');
const path = require('path');
const settings = require('./settings.js');
const { exec, execSync } = require('child_process');

const os = require('os');
const fs = require('fs');

const sysData = {
    hostname: execSync("hostname").toString(),
    noOfBackgrounds: 0
};

try {
  sysData.noOfBackgrounds = fs.readdirSync(path.join(__dirname, 'public/backgrounds')).length;
} catch (err) {
}

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');
var server = http.createServer(app);
var io = socket(server, {
  connectionStateRecovery: {}
});

app.get("/", async (req, res) => {
  let params = req.query.raw ? {} : {};
  res.render('index', params);
});
io.on('connection', async (socket) => {
  socket.on('disconnect', () => {
  });
  socket.on('clientSend', async (data) => {
    var mySendData = {};
    var toExec;
    if (data.mode == "action") {
      if (data.toExec == "shutdown") {
        exec("poweroff");
      } else if (data.toExec == "restart") {
        exec("reboot");
      } else if (data.toExec == "logout") {
        exec("gnome-session-quit --logout --force");
      } else if (data.toExec > -1) {
        toExec = settings.menu[data.toExec][1];
        exec(toExec, (error, stdout, stderr) => {
          var mySendData = {};
          mySendData.result = "";
          mySendData.success = true;
          mySendData.result += stdout;
          mySendData.wyd = "action";
          socket.emit("serverSend", mySendData);
        });
      }
    } else if (data.mode == "dev_action") {
      if (data.toExec > -1) {
        toExec = settings.dev_menu[data.toExec][1];
        exec(toExec, (error, stdout, stderr) => {
          var mySendData = {};
          mySendData.result = "";
          mySendData.success = true;
          mySendData.result += stdout;
          mySendData.wyd = "dev_action";
          socket.emit("serverSend", mySendData);
        });
      }
    } else if (data.mode == "requestData") {
      mySendData = { success: true, wyd: data.mode, result: sysData };
      socket.emit("serverSend", mySendData);
    } else if (data.mode == "requestActions") {
      mySendData = { success: true, wyd: data.mode, result: {actions: settings.menu, dev_actions: settings.dev_menu} };
      socket.emit("serverSend", mySendData);
    }
  });
});

server.listen(3000, () => {
  console.log(`Kiosk server active.`);
});
