import type { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import InfiniteScroll from "react-infinite-scroll-component"

import { Header, LargeImage, Loader, LoaderRow, TrackRow } from "@/components"
import { useRequireAuthentication, useWindowDimensions } from "@/hooks"
import { GetAlbumTracksResponse } from "@/services/api/albums"
import { useAlbum, useAlbumTracks } from "@/state"

const AlbumPage: NextPage = () => {
  const { accessToken } = useRequireAuthentication()
  const { isReady, query } = useRouter()

  const {
    data: album,
    isError: albumIsError,
    error: albumError,
    isLoading: albumIsLoading,
  } = useAlbum(
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
  } = useAlbumTracks(
    accessToken,
    isReady && typeof query.id === "string" ? query.id : "",
    pageSize
  )

  const tracks = (
    (tracksData?.pages.filter(Boolean) as GetAlbumTracksResponse[]) ?? []
  ).flatMap(({ items }) => items)

  return (
    <>
      <Head>
        <title>Spui | Album{album ? ` | ${album.name}` : ""}</title>
      </Head>

      <Header title={album?.name} />

      <div
        id="scrollable-container"
        className="flex-1 overflow-y-auto visible-scrollbar self-stretch my-1 flex flex-col items-stretch"
      >
        {albumIsLoading ? (
          <Loader expand />
        ) : albumIsError && albumError ? (
          <p>{albumError.message}</p>
        ) : album && album.images.length > 0 ? (
          <LargeImage
            images={album.images}
            alt={`${album.name} cover art`}
            className="my-4 self-center"
          />
        ) : null}

        {!albumIsLoading && (
          <>
            {tracksIsError && !!tracksError && <p>{tracksError.message}</p>}

            <InfiniteScroll
              dataLength={tracks.length}
              next={fetchNextPage}
              hasMore={hasNextPage ?? true}
              loader={<LoaderRow />}
              scrollThreshold={0.6}
              scrollableTarget="scrollable-container"
            >
              {tracks.map((track) => (
                <TrackRow key={track.id} _track={track} />
              ))}
            </InfiniteScroll>
          </>
        )}
      </div>
    </>
  )
}

export default AlbumPage
