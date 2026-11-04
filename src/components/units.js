import { useSyncExternalStore } from 'react'

// The visitor's unit choice, kept in localStorage and shared by every component. US is the default.
const KEY = 'opel-units'
const listeners = new Set()
const read = () => (localStorage.getItem(KEY) === 'metric' ? 'metric' : 'us')

export function setUnits(u) {
  localStorage.setItem(KEY, u)
  listeners.forEach((l) => l())
}

export const useUnits = () =>
  useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    read,
    () => 'us',
  )
