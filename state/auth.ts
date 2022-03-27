import { atom, selector } from "recoil"

import { localStorageEffectJSON } from "./effects"

export const clientIdAtom = atom<string | null>({
  key: "clientId",
  default: null,
  effects: [localStorageEffectJSON("clientId")],
})

interface AccessToken {
  accessToken: string
  expiresAtEpoch: number
}

// Used as underlying store for accessTokenSelector,
// which validates the token's expiry.
export const accessTokenAtom = atom<AccessToken | null>({
  key: "accessToken",
  default: null,
  effects: [localStorageEffectJSON("accessToken")],
})

export const refreshTokenAtom = atom<string | null>({
  key: "refreshToken",
  default: null,
  effects: [localStorageEffectJSON("refreshToken")],
})

export const validAccessTokenOrNull = selector({
  key: "validAccessTokenOrNull",
  get: ({ get }) => {
    const accessToken = get(accessTokenAtom)
    return accessToken && accessToken.expiresAtEpoch > Date.now()
      ? accessToken
      : null
  },
})

// Authentication status depends on the the ability to acquire a new
// access token at any given point because the user has already
// authorized. Thus, validate the refresh token and not the access token.
export const isLoggedInSelector = selector({
  key: "isLoggedIn",
  get: ({ get }) => !!get(refreshTokenAtom),
})
