import { useCallback, useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"

import { localStorageCodeVerifierKey, localStorageStateKey } from "@/config"
import { requestAccessToken } from "@/services/api/auth"
import { ApiError } from "@/services/api/common"
import { accessTokenAtom, clientIdAtom, refreshTokenAtom } from "@/state"

export const useFetchInitialAccessToken = () => {
  const clientId = useRecoilValue(clientIdAtom)
  const setAccessToken = useSetRecoilState(accessTokenAtom)
  const setRefreshToken = useSetRecoilState(refreshTokenAtom)

  const [error, setError] = useState<string>()

  const fetchInitialAccessToken = useCallback(
    async (code: string): Promise<boolean> => {
      setError(undefined)

      // Retrieve and validate saved client ID and code verifier.
      if (!clientId) {
        console.error("Missing client ID")
        setError("Missing client ID")
        return false
      }
      const codeVerifier = localStorage.getItem(localStorageCodeVerifierKey)
      if (!codeVerifier) {
        console.error("Missing code verifier")
        setError("Missing code verifier")
        return false
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
        return false
      }

      // Clear the local storage.
      localStorage.removeItem(localStorageStateKey)
      localStorage.removeItem(localStorageCodeVerifierKey)

      return true
    },
    [clientId, setAccessToken, setRefreshToken, setError]
  )

  return { fetchInitialAccessToken, error }
}
