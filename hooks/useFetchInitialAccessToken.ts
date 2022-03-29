import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"

import { localStorageCodeVerifierKey, localStorageStateKey } from "@/config"
import { requestAccessToken } from "@/services/api/auth"
import { ApiError } from "@/services/api/common"
import { accessTokenAtom, clientIdAtom, refreshTokenAtom } from "@/state"

export const useFetchInitialAccessToken = (redirectOnSuccess = "/search") => {
  const { push: routerPush } = useRouter()

  const clientId = useRecoilValue(clientIdAtom)
  const setAccessToken = useSetRecoilState(accessTokenAtom)
  const setRefreshToken = useSetRecoilState(refreshTokenAtom)

  const [error, setError] = useState<string>()

  const fetchInitialAccessToken = useCallback(
    async (code: string) => {
      setError(undefined)

      // Retrieve and validate saved client ID and code verifier.
      if (!clientId) {
        console.error("Missing client ID")
        setError("Missing client ID")
        return
      }
      const codeVerifier = localStorage.getItem(localStorageCodeVerifierKey)
      if (!codeVerifier) {
        console.error("Missing code verifier")
        setError("Missing code verifier")
        return
      }

      try {
        const response = await requestAccessToken(clientId, codeVerifier, code)

        setAccessToken({
          token: response.access_token,
          expiresAtEpoch: Date.now() + response.expires_in * 1000,
        })
        setRefreshToken(response.refresh_token)
      } catch (error) {
        if (!(error instanceof ApiError)) {
          console.error(error)
        }
        setError(error instanceof Error ? error.message : `${error}`)
        return
      }

      // Clear the local storage.
      localStorage.removeItem(localStorageStateKey)
      localStorage.removeItem(localStorageCodeVerifierKey)

      // Redirect once we're authenticated.
      routerPush(redirectOnSuccess)
    },
    [
      clientId,
      setAccessToken,
      setRefreshToken,
      routerPush,
      setError,
      redirectOnSuccess,
    ]
  )

  return { fetchInitialAccessToken, error }
}
