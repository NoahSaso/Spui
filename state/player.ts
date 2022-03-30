import { atom, selector } from "recoil"

import { Player } from "@/services/api"
import { validAccessTokenOrNull } from "@/state"
import { PlaybackState } from "@/types"

// Use to refresh the current playback.
export const currentPlaybackIdAtom = atom({
  key: "currentPlaybackId",
  default: 0,
})

export const getCurrentPlayback = selector<PlaybackState | false | undefined>({
  key: "getCurrentPlayback",
  get: async ({ get }) => {
    get(currentPlaybackIdAtom)

    const accessToken = get(validAccessTokenOrNull)
    if (!accessToken) return

    return await Player.getPlaybackState(accessToken)
  },
})
