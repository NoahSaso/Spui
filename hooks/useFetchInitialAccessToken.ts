import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"

import { localStorageCodeVerifierKey, localStorageStateKey } from "@/config"
import { requestAccessToken } from "@/services/api/auth"
import { accessTokenAtom, clientIdAtom, refreshTokenAtom } from "@/state"

export const useFetchInitialAccessToken = () => {
  const { push: routerPush } = useRouter()
  const clientId = useRecoilValue(clientIdAtom)
  const setAccessToken = useSetRecoilState(accessTokenAtom)
  const setRefreshToken = useSetRecoilState(refreshTokenAtom)
  const [error, setError] = useState<string>()

  const fetchInitialAccessToken = useCallback(
    async (code: string) => {
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

        if (response.success) {
          setAccessToken({
            accessToken: response.data.access_token,
            expiresAtEpoch: Date.now() + response.data.expires_in * 1000,
          })
          setRefreshToken(response.data.refresh_token)
        } else {
          throw new Error(response.error.known || response.error.description)
        }
      } catch (error) {
        console.error(error)
        setError(error instanceof Error ? error.message : `${error}`)
        return
      }

      // Clear the local storage.
      localStorage.removeItem(localStorageStateKey)
      localStorage.removeItem(localStorageCodeVerifierKey)

      // Redirect home now that we're authenticated.
      routerPush("/")
    },
    [clientId, setAccessToken, setRefreshToken, routerPush, setError]
  )

  return { fetchInitialAccessToken, error }
}
