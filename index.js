'use strict';

const electron = require('electron');
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const electron = require('electron');
const jsonfile = require('jsonfile');
const mkdirp = require('mkdirp');

module.exports = function (window, options) {
  const app = electron.app || electron.remote.app;



  const [windowWidth, windowHeight] = window.getSize()

  let windowState = windowStateKeeper({
    defaultWidth: windowWidth,
    defaultHeight: windowHeight
  });

  state.visible = true;


  const config = Object.assign({
    file: 'window-state-menu.json',
    path: app.getPath('userData'),
  }, options);

  const fullStoreFileName = path.join(config.path, config.file);

  function resetStateToDefault() {

    // TODO: test
    state = {
      visible: false
    };
  }


  function saveState() {
    // Save state
    try {
      mkdirp.sync(path.dirname(fullStoreFileName));
      jsonfile.writeFileSync(fullStoreFileName, state);
    } catch (err) {
      // Don't care
    }
  }

  function closeHandler() {
    state.visible = false
  }

  function closedHandler() {
    // Unregister listeners and save state
    unmanage();
    saveState();
  }

  function manage(win) {
    // mange the window using electron-window-state
    windowState.manage(win);

    win.on('close', closeHandler);
    win.on('closed', closedHandler);
    winRef = win;
  }

  function unmanage() {
    if (winRef) {
      clearTimeout(stateChangeTimer);
      winRef.removeListener('close', closeHandler);
      winRef.removeListener('closed', closedHandler);
      winRef = null;
    }
  }

  // Load previous state
  try {
    state = jsonfile.readFileSync(fullStoreFileName);
  } catch (err) {
    // Don't care
  }

  // Set state fallback values
  state = Object.assign({
    width: config.defaultWidth || 800,
    height: config.defaultHeight || 600
  }, state);

  return {
    get visible() { return state.visible; },
    saveState,
    unmanage,
    manage,
    resetStateToDefault
  };
};
