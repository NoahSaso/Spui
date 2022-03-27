import { AtomEffect } from "recoil"

const isBrowser = typeof window !== "undefined"

export const localStorageEffect =
  <T>(
    key: string,
    serialize: (value: T) => string,
    parse: (saved: string) => T
  ): AtomEffect<T> =>
  ({ setSelf, onSet }) => {
    const savedValue = isBrowser ? localStorage.getItem(key) : null
    if (savedValue != null) setSelf(parse(savedValue))

    onSet((newValue: T, _: any, isReset: boolean) => {
      if (isReset) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, serialize(newValue))
      }
    })
  }

export const localStorageEffectJSON = <T>(key: string): AtomEffect<T> =>
  localStorageEffect(key, JSON.stringify, JSON.parse)
