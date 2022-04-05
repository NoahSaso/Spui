import { useEffect } from "react"
import { useRecoilValue } from "recoil"

import { useCurrentPlayback, validAccessTokenOrNull } from "@/state"

export const useRefreshCurrentPlayback = () => {
  const accessToken = useRecoilValue(validAccessTokenOrNull)

  const { refetch } = useCurrentPlayback(accessToken)

  // Refresh playback every 5 seconds.
  useEffect(() => {
    const interval = setInterval(() => refetch(), 1000 * 5)
    // Refresh immediately.
    refetch()

    return () => clearInterval(interval)
  }, [refetch])
}
