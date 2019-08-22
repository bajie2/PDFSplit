const {
    app,
    BrowserWindow,
    Menu,
} = require('electron')

function createWindow() {
    let debug = 0;
    let width = 600;
    let height = 200;
    if (debug) {
        width = 1200;
        height = 600;
    }
    // 创建浏览器窗口
    let win = new BrowserWindow({
        width,
        height,
        webPreferences: {
            nodeIntegration: true,
        }
    });
    Menu.setApplicationMenu(null);
    // 加载index.html文件
    win.loadFile('index.html');
    if (debug) {
        win.webContents.openDevTools();
    }
}

app.on('ready', createWindow)
