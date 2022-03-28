import { selectorFamily } from "recoil"

import { Playlists } from "@/services/api"
import { validAccessTokenOrNull } from "@/state"

export const getPlaylists = selectorFamily<
  Playlists.GetPlaylistsResponse | undefined,
  { limit?: number; offset?: number }
>({
  key: "getPlaylists",
  get:
    ({ limit, offset }) =>
    async ({ get }) => {
      const accessToken = get(validAccessTokenOrNull)
      if (!accessToken) return

      return await Playlists.get(accessToken, limit, offset)
    },
})
