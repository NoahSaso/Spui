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

export enum KnownError {
  RefreshTokenRevoked = "Refresh token revoked.",
}

const knownErrorMatchMap: Record<
  KnownError,
  { error: string; description: string }
> = {
  [KnownError.RefreshTokenRevoked]: {
    error: "invalid_grant",
    description: "Refresh token revoked",
  },
}
const KnownErrorMatchEntries = Object.entries(knownErrorMatchMap)

const matchKnownError = (
  error: string,
  description: string
): KnownError | undefined => {
  const matched = KnownErrorMatchEntries.find(
    ([_, expected]) =>
      expected.error === error && expected.description === description
  )
  return matched?.[0] as KnownError | undefined
}

type ApiResponse<D> =
  | {
      success: true
      data: D
    }
  | {
      success: false
      error: {
        known: KnownError | undefined
        status: number
        type: string
        description: string
      }
    }

const processResponse = async <D>(
  response: Response
): Promise<ApiResponse<D>> => {
  const data = await response.json().catch(() => undefined)

  if (response.status === 200) {
    return {
      success: true,
      data,
    }
  } else {
    const known = data && matchKnownError(data.error, data.error_description)
    return {
      success: false,
      error: {
        known,
        status: response.status,
        type: data?.error ?? "unknown",
        description: data?.error_description ?? JSON.stringify(data),
      },
    }
  }
}

type ApiTokenResponse = ApiResponse<{
  access_token: string
  token_type: string
  scope: string
  expires_in: number
  refresh_token: string
}>

export const requestAccessToken = async (
  clientId: string,
  codeVerifier: string,
  code: string
): Promise<ApiTokenResponse> =>
  processResponse(
    await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
  )

export const requestRefreshedAccessToken = async (
  clientId: string,
  refreshToken: string
): Promise<ApiTokenResponse> =>
  processResponse(
    await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
  )
