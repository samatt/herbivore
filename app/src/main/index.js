'use strict'

import { app, BrowserWindow, Menu, dialog } from 'electron'
import { menu } from './menuBar'
import { exec } from 'child_process'
import sudo from 'sudo-prompt'
import { sudoOptions, 
  messageBoxOptions, 
  lsPermissions, 
  setPermissions } from './permissionsConsts'

let mainWindow

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  Menu.setApplicationMenu(menu)
  mainWindow = new BrowserWindow({
    height: 840,
    width: 1280,
    titleBarStyle: 'hidden'
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // eslint-disable-next-line no-console
  console.log('mainWindow opened')
}

app.on('ready', createWindow)
app.on('ready', checkPermissions)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

function checkPermissions () {
  exec(lsPermissions,
    (error, stdout, stderr) => {
      if (error) console.log(`Exec error: ${error}`)
      if (stdout.includes('crw-rw-r--') === false) {
        dialog.showMessageBox(messageBoxOptions)
        sudo.exec(
          setPermissions,
          sudoOptions,
          (error) => { 
            if (error) {
              console.log(`Sudo error: ${error}`)
            } else {
              console.log('Set Permissions')
            }
          })
      } else {
        console.log('Permissions already set')
      }
    })
}
