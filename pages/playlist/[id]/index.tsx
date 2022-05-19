import type { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useCallback } from "react"
import { IoPlay } from "react-icons/io5"
import InfiniteScroll from "react-infinite-scroll-component"
import { toast } from "react-toastify"

import { Header, LargeImage, Loader, LoaderRow, TrackRow } from "@/components"
import { useRequireAuthentication, useWindowDimensions } from "@/hooks"
import { DevicePicker } from "@/services"
import { Player } from "@/services/api"
import { ApiError, KnownError } from "@/services/api/common"
import { GetPlaylistTracksResponse } from "@/services/api/playlists"
import { useCurrentPlayback, usePlaylist, usePlaylistTracks } from "@/state"
import { uriToDeepLink } from "@/utils"

const PlaylistPage: NextPage = () => {
  const { accessToken } = useRequireAuthentication()
  const { isReady, query } = useRouter()
  const { refetch: refreshCurrentPlayback } = useCurrentPlayback(accessToken)

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

  const onPlay = useCallback(async () => {
    if (!accessToken || !playlist) return

    // Detect no device error and prompt for selection if possible.
    // Otherwise just error normally.
    try {
      await toast.promise(
        Player.setShuffleState(accessToken, true).then(() =>
          Player.play(accessToken, { contextUri: playlist.uri }).then(() =>
            refreshCurrentPlayback()
          )
        ),
        {
          pending: "Playing...",
          success: "Played 👍",
        }
      )
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.data.known === KnownError.NoActiveDevice
      ) {
        DevicePicker.pickDevice(uriToDeepLink(playlist.uri), (event) => {
          if (event.openedFallbackUri) {
            toast.success("Opening...")
          } else {
            toast.promise(
              Player.setShuffleState(accessToken, true, event.device.id).then(
                () =>
                  Player.play(accessToken, {
                    deviceId: event.device.id,
                    contextUri: playlist.uri,
                  }).then(() => refreshCurrentPlayback())
              ),
              {
                pending: `Playing on ${event.device.name}...`,
                success: `Played on ${event.device.name} 👍`,
                error: `Failed to play on ${event.device.name} 👎`,
              }
            )
          }
        })
      } else {
        toast.error("Failed to play 👎")
      }
    }
  }, [accessToken, playlist, refreshCurrentPlayback])

  return (
    <>
      <Head>
        <title>Spui | Playlist{playlist ? ` | ${playlist.name}` : ""}</title>
      </Head>

      <Header
        title={playlist?.name}
        fallbackBackPath="/playlists"
        rightNode={
          playlist && (
            <button
              onClick={onPlay}
              className="hover:opacity-70 active:opacity-70"
            >
              <IoPlay size="2rem" />
            </button>
          )
        }
      />

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

        {!playlistIsLoading && (
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
              {tracks.map(({ track }) => (
                <TrackRow key={track.id} _track={track} />
              ))}
            </InfiniteScroll>
          </>
        )}
      </div>
    </>
  )
}

export default PlaylistPage
