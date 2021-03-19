const { app, BrowserWindow } = require("electron");
const gameService = require("./app/gameService");

let mainWindow;
let data;

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "ImageShrink",
    backgroundColor: "#000000",
    fullscreen: true,
    frame: false,
  });
  console.log("About to call service method");
  await gameService.getData((json) => {
    data = json;
  });
  console.log(data[0].gameInfo.description);

  console.log("Keep running the code");

  mainWindow.loadFile("./app/index.html");
}

app.on("ready", createMainWindow);
