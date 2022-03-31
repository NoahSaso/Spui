import type { NextPage } from "next"
import { useRouter } from "next/router"
import InfiniteScroll from "react-infinite-scroll-component"

import {
  AlbumRow,
  Header,
  LargeImage,
  Loader,
  LoaderRow,
  TrackRow,
} from "@/components"
import { useRequireAuthentication, useWindowDimensions } from "@/hooks"
import { GetArtistAlbumsResponse } from "@/services/api/artists"
import { useArtist, useArtistAlbums, useArtistTopTracks } from "@/state"

const ArtistPage: NextPage = () => {
  const { accessToken } = useRequireAuthentication()
  const { isReady, query } = useRouter()

  const {
    data: artist,
    isError: artistIsError,
    error: artistError,
    isLoading: artistIsLoading,
  } = useArtist(
    accessToken,
    isReady && typeof query.id === "string" ? query.id : ""
  )

  const {
    data: topTracks,
    isError: topTracksIsError,
    error: topTracksError,
    isLoading: topTracksIsLoading,
  } = useArtistTopTracks(
    accessToken,
    isReady && typeof query.id === "string" ? query.id : ""
  )

  const { height } = useWindowDimensions()
  // Roughly the amount that will show on one page.
  // 4.5rem (row height) is 72px
  const pageSize = Math.ceil(height / 72) || 20

  const {
    data: albumsData,
    error: albumsError,
    isError: albumsIsError,
    fetchNextPage,
    hasNextPage,
  } = useArtistAlbums(
    accessToken,
    isReady && typeof query.id === "string" ? query.id : "",
    pageSize
  )

  const albums = (
    (albumsData?.pages.filter(Boolean) as GetArtistAlbumsResponse[]) ?? []
  ).flatMap(({ items }) => items)

  return (
    <>
      <Header title={artist?.name} />

      <div
        id="scrollable-container"
        className="flex-1 overflow-y-auto visible-scrollbar self-stretch my-1 flex flex-col items-stretch"
      >
        {artistIsLoading ? (
          <Loader expand />
        ) : artistIsError && artistError ? (
          <p>{artistError.message}</p>
        ) : artist && artist.images.length > 0 ? (
          <LargeImage
            images={artist.images}
            alt={`${artist.name} cover art`}
            className="my-4 self-center"
          />
        ) : null}

        <h2 className="my-2 pl-2 text-2xl font-extrabold">Top Tracks</h2>
        {topTracksIsLoading ? (
          <LoaderRow />
        ) : topTracksIsError && topTracksError ? (
          <p>{topTracksError.message}</p>
        ) : topTracks ? (
          topTracks.map((track) => <TrackRow key={track.id} _track={track} />)
        ) : null}

        <h2 className="mt-6 mb-2 pl-2 text-2xl font-extrabold">Albums</h2>
        {albumsIsError && !!albumsError && <p>{albumsError.message}</p>}

        <InfiniteScroll
          dataLength={albums.length}
          next={fetchNextPage}
          hasMore={hasNextPage ?? true}
          loader={<LoaderRow />}
          scrollThreshold={0.6}
          scrollableTarget="scrollable-container"
        >
          {albums.map((album) => (
            <AlbumRow key={album.id} id={album.id} _album={album} />
          ))}
        </InfiniteScroll>
      </div>
    </>
  )
}

export default ArtistPage
