import { useCallback, useEffect, useState } from "react"
import { useRecoilValueLoadable, useSetRecoilState } from "recoil"

import { currentPlaybackIdAtom, getCurrentPlayback } from "@/state"
import { PlaybackState } from "@/types"

export const useCurrentPlayback = () => {
  const loadable = useRecoilValueLoadable(getCurrentPlayback)
  const setCurrentPlaybackId = useSetRecoilState(currentPlaybackIdAtom)
  const [cachedState, setCachedState] = useState<PlaybackState | false>()

  const updateCurrentPlayback = useCallback(
    () => setCurrentPlaybackId((id) => id + 1),
    [setCurrentPlaybackId]
  )

  // Cache and update only once ready so it doesn't blink loading.
  useEffect(() => {
    if (loadable.state === "hasValue") setCachedState(loadable.contents)
  }, [loadable])

  return {
    currentPlayback: cachedState,
    updateCurrentPlayback,
  }
}
