/**
 * The preload script runs before `index.html` is loaded
 * in the renderer. It has access to web APIs as well as
 * Electron's renderer process modules and some polyfilled
 * Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
const { contextBridge, ipcRenderer } = require('electron');

function subscribe(channel, callback) {
  const listener = (_event, payload) => callback(payload);
  ipcRenderer.on(channel, listener);

  return () => ipcRenderer.removeListener(channel, listener);
}

contextBridge.exposeInMainWorld('lichen', {
  loadBootstrapData: () => ipcRenderer.invoke('app:load-bootstrap-data'),
  saveSettings: (settings) => ipcRenderer.invoke('app:save-settings', settings),
  validateServiceCredentials: (serviceId) => ipcRenderer.invoke('app:validate-service-credentials', serviceId),
  getHistory: () => ipcRenderer.invoke('app:get-history'),
  uploadFiles: (payload) => ipcRenderer.invoke('app:upload-files', payload),
  openHistoryWindow: () => ipcRenderer.invoke('app:open-history-window'),
  openFileDialog: () => ipcRenderer.invoke('app:open-file-dialog'),
  openExternalUrl: (url) => ipcRenderer.invoke('app:open-external-url', url),
  cancelUpload: () => ipcRenderer.invoke('app:cancel-upload'),
  onUploadProgress: (callback) => subscribe('app:upload-progress', callback),
});

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
