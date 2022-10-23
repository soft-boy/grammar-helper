const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("registerGrammarlyAuthCallback", (cb) => {
  ipcRenderer.on("grammarly:handleOAuthCallback", (_event, url) => {
    cb(url);
  });
});
