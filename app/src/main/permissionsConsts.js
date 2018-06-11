export const sudoOptions = {
  name: 'Herbivore'
}

export const messageBoxOptions = {
  buttons: ['OK'],
  title: 'Permissions prompt',
  message: "We need to set some permissions in order for Herbivore to function correctly. You'll be prompted for your user password after this."
}

export const lsPermissions = 'ls -l /dev/bpf*'

export const setPermissions = 'chmod o+r /dev/bpf*; sysctl -w net.inet.ip.forwarding=1; pfctl -e'
