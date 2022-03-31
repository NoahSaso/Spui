import { useInfiniteQuery, useQuery } from "react-query"

import { Playlists } from "@/services/api"
import { ApiError } from "@/services/api/common"
import { Playlist } from "@/types"

export const usePlaylist = (accessToken: string | null, id: string) =>
  useQuery<Playlist | undefined, ApiError>(["playlist", id], () =>
    accessToken && id ? Playlists.get(accessToken, id) : undefined
  )

export const usePlaylistTracks = (
  accessToken: string | null,
  id: string,
  pageSize: number
) =>
  useInfiniteQuery<Playlists.GetPlaylistTracksResponse | undefined, ApiError>(
    ["playlist", "infiniteTracks", id],
    async ({ pageParam = 1 }) => {
      if (!accessToken || !id) return undefined

      const response = await Playlists.getTracks(
        accessToken,
        id,
        pageSize,
        (pageParam - 1) * pageSize
      )
      return response
    },
    {
      getNextPageParam: (lastPage) =>
        // If no next parameter, no more.
        !lastPage?.next
          ? undefined
          : Math.floor((lastPage?.offset ?? 0) / pageSize) + 1 + 1,
    }
  )
