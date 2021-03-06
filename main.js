var app           = require('app')
  , BrowserWindow = require('browser-window')
  , ChildProcess  = require('child_process')
  , spawn         = ChildProcess.spawn
  , exec          = ChildProcess.exec
  , ipc           = require('ipc')
  , shell         = require('shell')
  , CrashReporter = require('crash-reporter')
  , mainWindow    = null
  ;

CrashReporter.start();

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  mainWindow.loadUrl('file://' + __dirname + '/app/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
    app.quit();
  });
});

ipc.on('start-script', function(event, arg) {
  exec(__dirname + '/app/script/test_script.sh', function(error, stdout, stderr) {
    if (error !== null) {
      event.sender.send('error-running-script', {error: error, stderr: stderr});
    } else {
      event.sender.send('success-running-script', stdout);
    }
  })
});

ipc.on('open-file', function(event, arg) {
  shell.openItem(arg);
});
