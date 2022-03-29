import { useEffect } from "react"
import { useRecoilState, useRecoilValue } from "recoil"

import { requestRefreshedAccessToken } from "@/services/api/auth"
import { KnownError } from "@/services/api/common"
import { accessTokenAtom, clientIdAtom, refreshTokenAtom } from "@/state"

export const useTokenMonitor = (refreshCallback?: () => void) => {
  const clientId = useRecoilValue(clientIdAtom)
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom)
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenAtom)

  // Setup listener to refresh access token before it expires.
  useEffect(() => {
    // If there is no refresh token, we are not authenticated and
    // cannot refresh when needed.
    if (!refreshToken) return

    // Refresh access token if within 15 minutes of expiring.
    const refreshAccessToken = async () => {
      console.log("Refreshing access token...")

      if (
        accessToken &&
        // Ignore if expires in over 15 minutes.
        accessToken.expiresAtEpoch - Date.now() > 1000 * 60 * 15
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

      if (response.success) {
        // Update access token.
        setAccessToken({
          token: response.data.access_token,
          expiresAtEpoch: Date.now() + response.data.expires_in * 1000,
        })

        // Update refresh token.
        setRefreshToken(response.data.refresh_token)

        // Execute refresh callback if provided.
        refreshCallback?.()

        console.log("Refreshed access token!")
      } else {
        if (response.error.known === KnownError.RefreshTokenRevoked) {
          setRefreshToken(null)
          setAccessToken(null)
        } else {
          throw new Error(response.error.message)
        }
      }
    }

    // Every 5 minutes, check if the access token is about to expire.
    const interval = setInterval(refreshAccessToken, 1000 * 60 * 0.5)

    // Try to refresh immediately if access token is expired. Will also detect invalid refresh token and clear to indicate logged out.
    if (!accessToken || accessToken.expiresAtEpoch - 1000000000 < Date.now()) {
      refreshAccessToken()
    }

    return () => clearInterval(interval)
  }, [
    clientId,
    refreshToken,
    accessToken,
    setAccessToken,
    setRefreshToken,
    refreshCallback,
  ])
}
