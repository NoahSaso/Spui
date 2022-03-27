import {
  authChars,
  authLen,
  codeChallengeMethod,
  localStorageCodeVerifierKey,
  localStorageStateKey,
  redirectUri,
  scope,
  stateChars,
} from "@/config"
import { randomString, sha256 } from "@/utils"

// Stores state and codeVerifier in localStorage to be retrieved on callback.
export const generateLogin = async (clientId: string): Promise<string> => {
  const state = randomString(stateChars, authLen)
  localStorage.setItem(localStorageStateKey, state)

  const codeVerifier = randomString(authChars, authLen)
  localStorage.setItem(localStorageCodeVerifierKey, codeVerifier)

  const codeChallenge = await sha256(codeVerifier)

  return (
    "https://accounts.spotify.com/authorize?" +
    new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: redirectUri,
      scope: scope,
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: codeChallengeMethod,
    }).toString()
  )
}

export interface ApiTokenResponse {
  access_token: string
  token_type: string
  scope: string
  expires_in: number
  refresh_token: string
}

export const requestAccessToken = async (
  clientId: string,
  codeVerifier: string,
  code: string
): Promise<ApiTokenResponse> => {
  const body = Object.entries({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier,
  }).reduce((formData, [key, value]) => {
    formData.append(key, value)
    return formData
  }, new FormData())

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
  if (response.status !== 200) {
    throw new Error(`Error requesting access token: ${response.status}`)
  }

  return (await response.json()) as ApiTokenResponse
}

export interface ApiRefreshTokenResponse {
  access_token: string
  token_type: string
  scope: string
  expires_in: number
}

export const requestRefreshedAccessToken = async (
  clientId: string,
  refreshToken: string
): Promise<ApiRefreshTokenResponse> => {
  const body = Object.entries({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
  }).reduce((formData, [key, value]) => {
    formData.append(key, value)
    return formData
  }, new FormData())

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
  if (response.status !== 200) {
    throw new Error(
      `Error requesting refreshed access token: ${response.status}`
    )
  }

  return (await response.json()) as ApiRefreshTokenResponse
}
