const { app, BrowserWindow, screen } = require("electron");
const path = require("path");

app.setPath("userData", path.join(app.getPath("temp"), "sharda-sakha"));

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  // Create a borderless, transparent always-on-top window
  const mainWindow = new BrowserWindow({
    width: 380,
    height: 520,
    // Position on the bottom right of the desktop above the taskbar
    x: width - 400,
    y: height - 560,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: true,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // Load the transparent desktop companion page from our local next dev server
  mainWindow.loadURL("http://localhost:3000/desktop-mate");

  // Keep it always on top of other windows
  mainWindow.setAlwaysOnTop(true, "screen-saver");

  // Handle close window
  mainWindow.on("closed", function () {
    app.quit();
  });
}

app.whenReady().then(() => {
  // Wait a moment for the local next server to ensure it is running
  setTimeout(createWindow, 1000);

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
