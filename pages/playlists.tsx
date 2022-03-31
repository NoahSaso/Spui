import type { NextPage } from "next"
import Head from "next/head"
import InfiniteScroll from "react-infinite-scroll-component"

import { Header, LoaderRow, PlaylistRow } from "@/components"
import { useRequireAuthentication, useWindowDimensions } from "@/hooks"
import { Playlists } from "@/services/api"
import { usePlaylists } from "@/state"

const PlaylistsPage: NextPage = () => {
  const { accessToken } = useRequireAuthentication()

  const { height } = useWindowDimensions()
  // Roughly the amount that will show on one page.
  // 4.5rem (row height) is 72px
  const pageSize = Math.ceil(height / 72) || 20

  const { data, error, isError, fetchNextPage, hasNextPage } = usePlaylists(
    accessToken,
    pageSize
  )

  const playlists = (
    (data?.pages.filter(Boolean) as Playlists.ListPlaylistsResponse[]) ?? []
  ).flatMap(({ items }) => items)

  return (
    <>
      <Head>
        <title>Spui | Playlists</title>
      </Head>

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
