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
import { randomString, sha256Base64URLEncoded } from "@/utils"

import { postAccountForm } from "./common"

// Stores state and codeVerifier in localStorage to be retrieved on callback.
export const generateLogin = async (clientId: string): Promise<string> => {
  const state = randomString(stateChars, authLen)
  localStorage.setItem(localStorageStateKey, state)

  const codeVerifier = randomString(authChars, authLen)
  localStorage.setItem(localStorageCodeVerifierKey, codeVerifier)

  const codeChallenge = await sha256Base64URLEncoded(codeVerifier)

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

type ApiTokenResponse = {
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
): Promise<ApiTokenResponse> =>
  postAccountForm("/api/token", {
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier,
  })

export const requestRefreshedAccessToken = async (
  clientId: string,
  refreshToken: string
): Promise<ApiTokenResponse> =>
  postAccountForm("/api/token", {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
  })
