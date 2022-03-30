import { useCallback, useEffect, useState } from "react"
import { useRecoilValueLoadable, useSetRecoilState } from "recoil"

import { currentPlaybackIdAtom, getCurrentPlayback } from "@/state"
import { PlaybackState } from "@/types"

export const useCurrentPlayback = () => {
  const loadable = useRecoilValueLoadable(getCurrentPlayback)
  const setCurrentPlaybackId = useSetRecoilState(currentPlaybackIdAtom)
  const [cachedState, setCachedState] = useState<PlaybackState | false>()
  const [error, setError] = useState<string>()

  const updateCurrentPlayback = useCallback(
    () => setCurrentPlaybackId((id) => id + 1),
    [setCurrentPlaybackId]
  )

  // Cache and update only once ready so it doesn't blink loading.
  useEffect(() => {
    if (loadable.state === "hasValue") {
      setCachedState(loadable.contents)
      setError(undefined)
    } else if (loadable.state === "hasError") {
      setCachedState(undefined)
      setError(loadable.contents)
    }
  }, [loadable, setCachedState, setError])

  return {
    currentPlayback: cachedState,
    updateCurrentPlayback,
    error,
  }
}
