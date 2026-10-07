import '@testing-library/jest-dom'

// jsdom does not implement scrolling; App scrolls to top when switching screens.
window.scrollTo = () => {}

// Node 25+ ships its own global localStorage, which shadows jsdom's and has no
// methods unless started with --localstorage-file. Swap in an in-memory Storage
// so tests behave the same on every Node version (CI runs Node 22).
if (typeof globalThis.localStorage?.clear !== 'function') {
  const store = new Map<string, string>()
  const memoryStorage: Storage = {
    get length() {
      return store.size
    },
    clear: () => store.clear(),
    getItem: (key) => store.get(key) ?? null,
    key: (index) => [...store.keys()][index] ?? null,
    removeItem: (key) => {
      store.delete(key)
    },
    setItem: (key, value) => {
      store.set(key, String(value))
    },
  }
  Object.defineProperty(globalThis, 'localStorage', { value: memoryStorage, configurable: true })
}
