import type { NextPage } from "next"
import { useRouter } from "next/router"
import InfiniteScroll from "react-infinite-scroll-component"

import { Header, LargeImage, Loader, LoaderRow, TrackRow } from "@/components"
import { useRequireAuthentication, useWindowDimensions } from "@/hooks"
import { Playlists } from "@/services/api"
import { usePlaylist, usePlaylistTracks } from "@/state"

const PlaylistPage: NextPage = () => {
  const { accessToken } = useRequireAuthentication()

  const { isReady, query } = useRouter()

  const {
    data: playlist,
    isError: playlistIsError,
    error: playlistError,
    isLoading,
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
    (tracksData?.pages.filter(
      Boolean
    ) as Playlists.GetPlaylistTracksResponse[]) ?? []
  ).flatMap(({ items }) => items)

  const isError = playlistIsError || tracksIsError
  const error = playlistError || tracksError

  return (
    <>
      <Header title={playlist?.name} />

      <div
        id="scrollable-container"
        className="flex-1 overflow-y-auto visible-scrollbar self-stretch my-1 flex flex-col items-stretch"
      >
        {isLoading && <Loader expand />}
        {isError && !!error && <p>{error.message}</p>}

        {playlist && playlist.images.length > 0 && (
          <LargeImage
            images={playlist.images}
            alt={`${playlist.name} cover art`}
            className="my-4 self-center"
          />
        )}

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
