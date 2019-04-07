const {Menu} = require('electron')
const electron = require('electron')

const app = electron.app

const template = [
  {
    label: 'Tools',
    submenu: [
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools()
        }
      },
    ]}
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
