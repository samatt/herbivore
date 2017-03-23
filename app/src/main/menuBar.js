import { Menu } from 'electron'
import sudo from 'sudo-prompt'

const options = {
  name: 'Herbivore'
}

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
    label: 'About',
    submenu: [
      {
        label: 'About',
        role: 'about'
      }
    ]
  },
  {
    label: 'Permissions',

    submenu: [
      {
        label: 'Set',
        click () {
          sudo.exec('chmod o+r /dev/bpf*', options, function (error, stdout, stderr) {
            if (error) console.log(error)
            sudo.exec('sysctl -w net.inet.ip.forwarding=1', options, function (error, stdout, stderr) {
              if (error) console.log(error)
              sudo.exec('sysctl -w net.inet.ip.fw.enable=1', options, function (error, stdout, stderr) {
                if (error) console.log(error)
              })
            })
          })

          console.log('Set Permissions')
        }
      },
      {
        label: 'Clear',
        click () {
          sudo.exec('chmod o-r /dev/bpf*', options, function (error, stdout, stderr) {
            if (error) console.log(error)
            sudo.exec('sysctl -w net.inet.ip.fw.enable=0', options, function (error, stdout, stderr) {
              if (error) console.log(error)
              sudo.exec('chmod o-r /dev/bpf*', options, function (error, stdout, stderr) {
                if (error) console.log(error)
              })
            })
          })
          console.log('Clear Permissions')
        }
      }
    ]
  }
]
export const menu = Menu.buildFromTemplate(template)
