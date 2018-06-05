import { Menu } from 'electron'
import sudo from 'sudo-prompt'
import { exec } from 'child_process'
import { sudoOptions, 
  messageBoxOptions, 
  lsPermissions, 
  setPermissions } from './permissionsConsts'

const template = [
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      },
      {
        role: 'quit'
      }
    ]
  },
  {
    label: 'Herbivore',
    submenu: [
      {
        label: 'About',
        role: 'about'
      },
      {
        label: 'Permissions',
        submenu: [
          {
            label: 'Set',
            click () {
              exec(lsPermissions,
               (error, stdout, stderr) => {
                 if (error) console.log(`Exec error: ${error}`)
                 if (stdout.includes('crw-rw-r--') === false) {
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
          },
          {
            label: 'Clear',
            click () {
              const clearPermissions = 'chmod o-r /dev/bpf*; sysctl -w net.inet.ip.forwarding=0; pfctl -d'
              sudo.exec(
                clearPermissions,
                sudoOptions,
                (error, stdout, stderr) => {
                  if (error) {
                    console.log(`Sudo error: ${error}`)
                  } else {
                    console.log('Clear Permissions')
                  }
                })
            }
          }
        ]
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
      { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
      { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
    ]}
]
export const menu = Menu.buildFromTemplate(template)
