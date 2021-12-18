const path = require('path');
const url = require('url');
const { app, BrowserWindow, ipcMain } = require('electron');

const LibraryManager = require('./main_src/library-manager');

const libraryManager = new LibraryManager(
  'vDc2ysBDSEbdu7iIfc60Idaw1j2a2SB8WqV8ljXE'
);

ipcMain.on('download', (event, args) => {
  const progressUpdater = (progress) => {
    event.reply('downloadProgress', progress);
  };
  event.reply(
    'downloadComplete',
    libraryManager.downloadGame(...args, progressUpdater)
  );
});

ipcMain.on('downloadItch', (event, args) => {
  console.log(`the args: ${JSON.stringify(args)}`);
  const progressUpdater = (progress) => {
    event.reply('downloadProgress', progress);
  };

  return libraryManager.downloadItchGame(...args, progressUpdater).then((r) => {
    event.reply('downloadComplete', 'Success');
  });
});

ipcMain.on('requestLibraryPath', (event) => {
  event.reply('requestLibraryPathResponse', libraryManager.getLibraryPath());
});

ipcMain.on('BuildLibraryEntries', (event, args) => {
  libraryManager.buildLibraryEntries(...args).then((r) => {
    console.log(`The output: ${console.log(JSON.stringify(r))}`);
    event.reply('BuildLibraryEntriesResponse', r);
  });
});

let mainWindow;

let isDev = false;
if (
  process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV === 'development'
) {
  isDev = true;
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    show: false,
    fullscreen: true,
    backgroundColor: 'black',
    icon: `${__dirname}/assets/icon.png`,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  let indexPath;

  if (isDev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true,
    });
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true,
    });
  }

  mainWindow.loadURL(indexPath);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();

    // Open devtools if dev
    if (isDev) {
      const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS,
      } = require('electron-devtools-installer');

      installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
        console.log('Error loading React DevTools: ', err)
      );
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

// Stop error
app.allowRendererProcessReuse = true;
