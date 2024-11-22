import { globalShortcut, screen } from 'electron'

export class RegisterShortcut {
  private registeredShortcuts: string[] = []

  register(key: string, callback: () => void) {
    globalShortcut.register(key, callback)
    this.registeredShortcuts.push(key)
  }

  unregisterAll() {
    this.registeredShortcuts.forEach((key) => {
      globalShortcut.unregister(key)
    })
    this.registeredShortcuts = []
  }
}

export function getCurrentDisplay() {
  return screen.getDisplayNearestPoint(screen.getCursorScreenPoint())
}
