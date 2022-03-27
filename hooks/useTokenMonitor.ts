import { useEffect } from "react"
import { useRecoilState, useRecoilValue } from "recoil"

import { requestRefreshedAccessToken } from "@/services/api/auth"
import { accessTokenAtom, clientIdAtom, refreshTokenAtom } from "@/state"

export const useTokenMonitor = (refreshCallback?: () => void) => {
  const clientId = useRecoilValue(clientIdAtom)
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom)
  const refreshToken = useRecoilValue(refreshTokenAtom)

  // Setup listener to refresh access token before it expires.
  useEffect(() => {
    // If there is no refresh token, we are not authenticated and
    // cannot refresh when needed.
    if (!refreshToken) return

    // Refresh access token if it is within 20 minutes of expiring.
    const refreshAccessToken = async () => {
      if (
        !accessToken ||
        // Ignore if expires in over 20 minutes.
        accessToken.expiresAtEpoch - Date.now() > 1000 * 60 * 20
      )
        return

      // Retrieve and validate saved client ID.
      if (!clientId) {
        console.error("Missing client ID")
        return
      }

      const response = await requestRefreshedAccessToken(
        clientId,
        refreshToken!
      )
      console.log(response)

      // Update access token.
      setAccessToken({
        accessToken: response.access_token,
        expiresAtEpoch: Date.now() + response.expires_in * 1000,
      })

      // Execute refresh callback if provided.
      refreshCallback?.()
    }

    // Every 5 minutes, check if the access token is about to expire.
    const interval = setInterval(refreshAccessToken, 1000 * 60 * 5)

    return () => clearInterval(interval)
  }, [clientId, refreshToken, accessToken, setAccessToken, refreshCallback])
}
