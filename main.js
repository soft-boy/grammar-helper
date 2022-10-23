const { app, BrowserWindow, shell } = require("electron");
const path = require("path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 700,
    height: 450,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  })

  win.loadFile('index.html')
}

app.setAsDefaultProtocolClient("grammar-helper");

function handleGrammarlyOAuthCallback(win) {
  app.on("open-url", (event, link) => {
    if (link.includes("grammarly-auth")) {
      event.preventDefault();
      win.webContents.send("grammarly:handleOAuthCallback", link);
    }
  });
}

function handleNewWindowLinks(win) {
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.includes('grammarly')) {
      // Grammarly's SDK works properly when the links open in the default browser
      // instead of the Electron app

      shell.openExternal(url); // open link in electron system's default browser
      return { action: "deny" }; // don't open link in electron window
    } else {
      // you can allow the app to open all other links within the electron app
      // if required
      return { action: "allow" }
    }
  });
}

app.whenReady().then(() => {
  createWindow()

  handleGrammarlyOAuthCallback(win)
  handleNewWindowLinks(win)
})
