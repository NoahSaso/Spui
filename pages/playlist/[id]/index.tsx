import type { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import InfiniteScroll from "react-infinite-scroll-component"

import { Header, LargeImage, Loader, LoaderRow, TrackRow } from "@/components"
import { useRequireAuthentication, useWindowDimensions } from "@/hooks"
import { GetPlaylistTracksResponse } from "@/services/api/playlists"
import { usePlaylist, usePlaylistTracks } from "@/state"

const PlaylistPage: NextPage = () => {
  const { accessToken } = useRequireAuthentication()
  const { isReady, query } = useRouter()

  const {
    data: playlist,
    isError: playlistIsError,
    error: playlistError,
    isLoading: playlistIsLoading,
  } = usePlaylist(
    accessToken,
    isReady && typeof query.id === "string" ? query.id : ""
  )

  const { height } = useWindowDimensions()
  // Roughly the amount that will show on one page.
  // 4.5rem (row height) is 72px
  const pageSize = Math.ceil(height / 72) || 20

  const {
    data: tracksData,
    error: tracksError,
    isError: tracksIsError,
    fetchNextPage,
    hasNextPage,
  } = usePlaylistTracks(
    accessToken,
    isReady && typeof query.id === "string" ? query.id : "",
    pageSize
  )

  const tracks = (
    (tracksData?.pages.filter(Boolean) as GetPlaylistTracksResponse[]) ?? []
  ).flatMap(({ items }) => items)

  return (
    <>
      <Head>
        <title>Spui | Playlist{playlist ? ` | ${playlist.name}` : ""}</title>
      </Head>

      <Header title={playlist?.name} />

      <div
        id="scrollable-container"
        className="flex-1 overflow-y-auto visible-scrollbar self-stretch my-1 flex flex-col items-stretch"
      >
        {playlistIsLoading ? (
          <Loader expand />
        ) : playlistIsError && playlistError ? (
          <p>{playlistError.message}</p>
        ) : playlist && playlist.images.length > 0 ? (
          <LargeImage
            images={playlist.images}
            alt={`${playlist.name} cover art`}
            className="my-4 self-center"
          />
        ) : null}

        {tracksIsError && !!tracksError && <p>{tracksError.message}</p>}
        <InfiniteScroll
          dataLength={tracks.length}
          next={fetchNextPage}
          hasMore={hasNextPage ?? true}
          loader={<LoaderRow />}
          scrollThreshold={0.6}
          scrollableTarget="scrollable-container"
        >
          {tracks.map(({ track }) => (
            <TrackRow key={track.id} _track={track} />
          ))}
        </InfiniteScroll>
      </div>
    </>
  )
}

export default PlaylistPage
