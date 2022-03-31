import { useInfiniteQuery, useQuery } from "react-query"

import { Artists } from "@/services/api"
import { ApiError } from "@/services/api/common"
import { Artist, Track } from "@/types"

export const useArtist = (accessToken: string | null, id: string) =>
  useQuery<Artist | undefined, ApiError>(["artist", id], () =>
    accessToken && id ? Artists.get(accessToken, id) : undefined
  )

export const useArtistAlbums = (
  accessToken: string | null,
  id: string,
  pageSize: number
) =>
  useInfiniteQuery<Artists.GetArtistAlbumsResponse | undefined, ApiError>(
    ["artist", "infiniteAlbums", id],
    async ({ pageParam = 1 }) => {
      if (!accessToken || !id) return undefined

      const response = await Artists.getAlbums(
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
export const useArtistTopTracks = (accessToken: string | null, id: string) =>
  useQuery<Track[] | undefined, ApiError>(["artist", "topTracks", id], () =>
    accessToken && id ? Artists.getTopTracks(accessToken, id) : undefined
  )
