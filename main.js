// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const {autoUpdater} = require('electron-updater');
const path = require('path')

let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // frame: false,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js')
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  mainWindow.on('closed', function(){
    mainWindow = null;
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

app.on('ready', ()=>{
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
  // autoUpdater.checkForUpdates();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.whenReady().then(() => {
//   createWindow()

//  app.on('activate', function () {
//     // On macOS it's common to re-create a window in the app when the
//     // dock icon is clicked and there are no other windows open.
//     if (BrowserWindow.getAllWindows().length === 0) createWindow()
//   })
// })

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

app.on('activate', function(){
  if(mainWindow === null){
    createWindow();
  }
});


ipcMain.on('app_version', (event)=>{
  try{
    console.log("app.getVersion()", app.getVersion());
    // event.reply('app_version', {version: app.getVersion()});
    event.sender.send('app_version', {version: app.getVersion()});
  
    // autoUpdater.checkForUpdatesAndNotify();
    // console.log("autoUpdater.checkForUpdatesAndNotify();")
  }
  catch(err){
    console.log("err", err);
  }
});

autoUpdater.on("checking-for-update", () => {
  // sendStatusToWindow("Checking for update...");
  mainWindow.webContents.send('app_version', {version: "Checking for update..."});
});

autoUpdater.on("update-not-available", (info) => {
  mainWindow.webContents.send('app_version', {version: "Update not available."});
  // sendStatusToWindow("Update not available.");
});
autoUpdater.on("error", (err) => {
  mainWindow.webContents.send('app_version', {version: "Error in auto-updater. " + err});
  // sendStatusToWindow("Error in auto-updater. " + err);
});

autoUpdater.on('update-available', ()=>{
  console.log("update-available");
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', ()=>{
  console.log("update_downloaded");
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', ()=>{
  console.log("restart_app");
  autoUpdater.quitAndInstall();
});