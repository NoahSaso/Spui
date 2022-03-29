import { useEffect } from "react"
import { toast } from "react-toastify"
import { useRecoilState, useRecoilValue } from "recoil"

import { requestRefreshedAccessToken } from "@/services/api/auth"
import { ApiError, KnownError } from "@/services/api/common"
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

      try {
        const response = await requestRefreshedAccessToken(
          clientId,
          refreshToken!
        )

        // Update access token.
        setAccessToken({
          token: response.access_token,
          expiresAtEpoch: Date.now() + response.expires_in * 1000,
        })

        // Update refresh token.
        setRefreshToken(response.refresh_token)

        // Execute refresh callback if provided.
        refreshCallback?.()

        console.log("Refreshed access token!")
      } catch (error) {
        if (!(error instanceof ApiError)) {
          console.error(error)
        }

        if (
          error instanceof ApiError &&
          error.data.known === KnownError.RefreshTokenRevoked
        ) {
          setRefreshToken(null)
          setAccessToken(null)
        } else {
          toast.error(
            "Error logging into Spotify. Please refresh the page or log out and log back in."
          )
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
