/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */

/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2014, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */

/* global chrome */


// things to store:
// username/pw, remember me checkbox for: tidepool
// information for individual devices is stored by device ID
// default server
// timezone

var contexts = [ 'page' ];

var contextMenus = [
  {
    type: 'normal',
    id: 'MENUROOT',
    title: 'Server',
    contexts: contexts
  },
  {
    type: 'radio',
    id: 'Local',
    title: 'Local',
    contexts: contexts,
    parentId: 'MENUROOT',
    checked: false
  },
  {
    type: 'radio',
    id: 'Development',
    title: 'Development',
    contexts: contexts,
    parentId: 'MENUROOT',
    checked: false
  },
  {
    type: 'radio',
    id: 'Staging',
    title: 'Staging',
    contexts: contexts,
    parentId: 'MENUROOT',
    checked: false
  },
  {
    type: 'radio',
    id: 'Integration',
    title: 'Integration',
    contexts: contexts,
    parentId: 'MENUROOT',
    checked: false
  },
  {
    type: 'radio',
    id: 'Production',
    title: 'Production',
    contexts: contexts,
    parentId: 'MENUROOT',
    checked: true
  }
];

function setServer(window, info) {
  var serverdata = {
    Local: {
      API_URL: 'http://localhost:8009',
      UPLOAD_URL: 'http://localhost:9122',
      DATA_URL: 'http://localhost:8077',
      BLIP_URL: 'http://localhost:3000'
    },
    Development: {
      API_URL: 'https://dev-api.tidepool.org',
      UPLOAD_URL: 'https://dev-uploads.tidepool.org',
      DATA_URL: 'https://dev-api.tidepool.org/dataservices',
      BLIP_URL: 'https://dev-blip.tidepool.org'
    },
    Staging: {
      API_URL: 'https://stg-api.tidepool.org',
      UPLOAD_URL: 'https://stg-uploads.tidepool.org',
      DATA_URL: 'https://stg-api.tidepool.org/dataservices',
      BLIP_URL: 'https://stg-blip.tidepool.org'
    },
    Integration: {
      API_URL: 'https://int-api.tidepool.org',
      UPLOAD_URL: 'https://int-uploads.tidepool.org',
      DATA_URL: 'https://int-api.tidepool.org/dataservices',
      BLIP_URL: 'https://int-blip.tidepool.org'
    },
    Production: {
      API_URL: 'https://api.tidepool.org',
      UPLOAD_URL: 'https://uploads.tidepool.org',
      DATA_URL: 'https://api.tidepool.org/dataservices',
      BLIP_URL: 'https://blip.tidepool.org'
    }
  };

  console.log('will use', info.menuItemId, 'server');
  var serverinfo = serverdata[info.menuItemId];
  window.api.setHosts(serverinfo);
}

/*
chrome.app.runtime.onLaunched.addListener(function(launchData) {
  // launchData.url, if it exists, contains the link clicked on by
  // the user in blip. We could use it for login if we wanted to.
  console.log('launchData: ', launchData);
  var token = null;
  if (launchData.id && launchData.id === 'open_uploader') {
    var pat = /^[^?]+\?(.*)/;
    var query = launchData.url.match(pat)[1];
    if (query) {
      var parms = query.split('&');
      for (var p=0; p<parms.length; ++p) {
        var s = parms[p].split('=');
        console.log(s);
        if (s[0] === 'token') {
          token = s[1];
          break;
        }
      }
    }
    if (token) {
      console.log('got a token ', token);
      // now save the token where we can use it
    }
  }

  // Center window on screen.
  var screenWidth = screen.availWidth;
  var screenHeight = screen.availHeight;
  var width = 650;
  var height = 710;

  chrome.app.window.create('index.html', {
    id: 'tidepoolUniversalUploader',
    innerBounds: {
      width: width,
      height: height,
      left: Math.max(Math.round((screenWidth-width)/2),0) ,
      top: Math.max(Math.round((screenHeight-height)/2),0),
      minWidth: width,
      minHeight: height
    }
  }, function(createdWindow) {
    for (var i=0; i<contextMenus.length; ++i) {
      // In version 42 of Chrome, the create call throws an exception when the
      // app is reloaded after being closed (but Chrome itself continues to run).
      // I can't find anything wrong with the code or a way to prevent the
      // exception from occurring.
      // However, catching the exception and ignoring it allows things to
      // proceed, and the app still seems to be working properly -- the menu
      // items still work, etc.
      try {
        chrome.contextMenus.create(contextMenus[i], function()
          {
            var err = chrome.runtime.lastError;
            if (err) {
              console.log('Error creating menu item #', i, ', "', err, '"');
            }
          });
      } catch (exception) {
        // Leaving this here and commented out because it seems to be a bug
        // in Chrome that's causing the exception.
        // console.log('Caught exception in case ', i);
      }
    }

    var menucb = setServer.bind(null, createdWindow.contentWindow);
    chrome.contextMenus.onClicked.addListener(menucb);

    createdWindow.show();
    createdWindow.contentWindow.localSave = function() {};
    createdWindow.contentWindow.localLoad = function() {};
  });
});
*/
const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  var width = 650;
  var height = 710;
  // Create the browser window.
  mainWindow = new BrowserWindow({width: width, height: height, center: true});

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
