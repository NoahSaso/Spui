import { useQuery } from "react-query"

import { Player, Tracks } from "@/services/api"
import { ApiError } from "@/services/api/common"
import { PlaybackState } from "@/types"

export interface CurrentPlayback extends PlaybackState {
  isItemSaved: boolean
}

export const useCurrentPlayback = (accessToken: string | null) =>
  useQuery<CurrentPlayback | false | undefined, ApiError>(
    "currentPlayback",
    async () => {
      if (!accessToken) return

      const state = await Player.getPlaybackState(accessToken)
      if (!state) return state

      // Silently fail if can't check saved status.
      let isItemSaved = false
      try {
        isItemSaved = await Tracks.isSaved(accessToken, state.item.id)
      } catch (err) {
        console.error(err)
      }

      return {
        ...state,
        isItemSaved,
      }
    }
  )
