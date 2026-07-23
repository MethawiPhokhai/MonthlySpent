import { useEffect, useState } from 'react'

/** Like useState, but persists the value in localStorage and restores it on load. */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key)
      if (saved) return JSON.parse(saved) as T
    } catch {
      // ignore
    }
    return initialValue
  })

  // Lifecycle: write the value to localStorage after every change.
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore
    }
  }, [key, value])

  return [value, setValue] as const
}
