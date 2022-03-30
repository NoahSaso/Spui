import type { NextPage } from "next"
import InfiniteScroll from "react-infinite-scroll-component"
import { useInfiniteQuery } from "react-query"

import { Header, LoaderRow, PlaylistRow } from "@/components"
import { useRequireAuthentication, useWindowDimensions } from "@/hooks"
import { Playlists } from "@/services/api"
import { ApiError } from "@/services/api/common"
import { GetPlaylistsResponse } from "@/services/api/playlists"

// TODO: Add playlists to state to cache the list using jotai instead of recoil.
const PlaylistsPage: NextPage = () => {
  const { accessToken } = useRequireAuthentication()

  const { height } = useWindowDimensions()
  // Roughly the amount that will show on one page.
  // 4.5rem (row height) is 72px
  const pageSize = Math.ceil(height / 72) || 20

  const { data, error, isError, fetchNextPage, hasNextPage } = useInfiniteQuery<
    GetPlaylistsResponse | undefined,
    ApiError
  >(
    "infinitePlaylists",
    async ({ pageParam = 1 }) => {
      if (!accessToken) return undefined
      const response = await Playlists.get(
        accessToken,
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

  const playlists = (
    (data?.pages.filter(Boolean) as GetPlaylistsResponse[]) ?? []
  ).flatMap(({ items }) => items)

  return (
    <>
      <Header title="Playlists" />

      <div
        id="scrollable-container"
        className="flex-1 overflow-y-auto visible-scrollbar self-stretch"
      >
        {isError && !!error && <p>{error.message}</p>}

        <InfiniteScroll
          dataLength={playlists.length}
          next={fetchNextPage}
          hasMore={hasNextPage ?? true}
          loader={<LoaderRow />}
          scrollableTarget="scrollable-container"
        >
          {playlists.map((playlist) => (
            <PlaylistRow
              key={playlist.id}
              id={playlist.id}
              _playlist={playlist}
            />
          ))}
        </InfiniteScroll>
      </div>
    </>
  )
}

export default PlaylistsPage
