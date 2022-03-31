import { useInfiniteQuery, useQuery } from "react-query"

import { Albums } from "@/services/api"
import { ApiError } from "@/services/api/common"
import { Album } from "@/types"

export const useAlbum = (accessToken: string | null, id: string) =>
  useQuery<Album | undefined, ApiError>(["album", id], () =>
    accessToken && id ? Albums.get(accessToken, id) : undefined
  )

export const useAlbumTracks = (
  accessToken: string | null,
  id: string,
  pageSize: number
) =>
  useInfiniteQuery<Albums.GetAlbumTracksResponse | undefined, ApiError>(
    ["album", "infiniteTracks", id],
    async ({ pageParam = 1 }) => {
      if (!accessToken || !id) return undefined

      const response = await Albums.getTracks(
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
