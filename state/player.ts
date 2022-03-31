import { useQuery } from "react-query"

import { Player } from "@/services/api"
import { ApiError } from "@/services/api/common"
import { PlaybackState } from "@/types"

export const useCurrentPlayback = (accessToken: string | null) =>
  useQuery<PlaybackState | false | undefined, ApiError>("currentPlayback", () =>
    accessToken ? Player.getPlaybackState(accessToken) : undefined
  )
