// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const {autoUpdater} = require('electron-updater');
const path = require('path')

let mainWindow;

function createWindow () {
  // 윈도우 브라우저 초기 셋팅
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // minWidth: 100, // 최소 가로
    // minHeight: 50, // 최소 세로
    webPreferences: {
      /**
       * TypeError: window.require is not a function 일때 추가
       * electron에 빌드된 react 같이 개발하기 위해서 false 로 설정
       */
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  mainWindow.on('closed', function(){
    mainWindow = null;
  });

  // 개발자 툴 실행
  // mainWindow.webContents.openDevTools()
}

app.on('ready', ()=>{
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
  // autoUpdater.checkForUpdates();
});

// Electron 초기화 마치고 브라우처 창을 생성할 준비가 되면 호출
app.whenReady().then(() => {
  createWindow()
}

// 완전히 종료 될 때 호출
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// 앱이 실행될 때 기본 프로세스 정의
app.on('activate', function(){
  if(mainWindow === null){
    createWindow();
  }
});

// 앱 버전 리턴하는 리스너
ipcMain.on('app_version', (event)=>{
  try{
    event.sender.send('app_version', {version: app.getVersion()});
  }
  catch(err){
    console.log("err", err);
  }
});

// 1. 신규 버전 릴리즈 확인 시 호출
autoUpdater.on("checking-for-update", () => {
  mainWindow.webContents.send('app_version', {version: "Checking for update..."});
});

// 업데이트 할 신규 버전이 없을 시 호출
autoUpdater.on("update-not-available", (info) => {
  mainWindow.webContents.send('app_version', {version: "Update not available."});
});

// 업데이트 프로세스 중 에러 방생 시 호출
autoUpdater.on("error", (err) => {
  mainWindow.webContents.send('app_version', {version: "Error in auto-updater. " + err});
});

// 2. 업데이트 할 신규 버전이 있을 시 호출 됨
autoUpdater.on('update-available', ()=>{
  console.log("update-available");
  mainWindow.webContents.send('update_available');
});

// 3. 업데이트 설치 파일 다운로드 상태 수신
// 1~3 단계까지 자동으로 진행 됨
autoUpdater.on('download-progress', progressObj => {
  let percent = progressObj.percent.toFixed(2);
  console.log(`다운로드중... ${percent}%(${progressObj.transferred}/${progressObj.total})`);
});

// 업데이트 설치 파일 다운로드 완료 시 업데이트 진행 여부 선택
autoUpdater.on('update-downloaded', ()=>{
  console.log("update_downloaded");
  mainWindow.webContents.send('update_downloaded');

  const option = {
    type: 'info',
    buttons: ['업데이트'],
    defaultId: 0,
    title: '업데이트 마법사',
    message: '업데이트 버튼을 클릭하여 업데이트를 진행해주세요.'
  };

  dialog.showMessageBox(option).then(function (res) {
    autoUpdater.quitAndInstall();
  });
});
