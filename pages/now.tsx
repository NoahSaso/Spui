import classNames from "classnames"
import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import {
  IoHeart,
  IoHeartOutline,
  IoPauseCircle,
  IoPlayCircle,
  IoPlaySkipBack,
  IoPlaySkipForward,
} from "react-icons/io5"
import Slider from "react-slider"

import { ContextRow, Header, LargeImage, Loader } from "@/components"
import { useFireAndForgetCallback, useRequireAuthentication } from "@/hooks"
import { Player, Tracks } from "@/services/api"
import { useCurrentPlayback } from "@/state"
import { msToSec, secToTimeString } from "@/utils"

const NowPage: NextPage = () => {
  const { accessToken } = useRequireAuthentication()
  const {
    data: currentPlayback,
    isLoading,
    isError,
    error,
    refetch,
  } = useCurrentPlayback(accessToken)

  const {
    device,
    repeat_state: repeatState,
    shuffle_state: shuffleState,
    context,
    timestamp,
    progress_ms: baseProgressMs,
    is_playing: isPlaying,
    item: track,
    isItemSaved,
    actions: {
      interrupting_playback: interruptingPlayback,
      pausing,
      resuming,
      seeking,
      skipping_next: skippingNext,
      skipping_prev: skippingPrev,
      toggling_repeat_context: togglingRepeatContext,
      toggling_shuffle: togglingShuffle,
      toggling_repeat_track: togglingRepeatTrack,
      transferring_playback: transferringPlayback,
    },
  } = currentPlayback || { actions: {} }

  const [currProgress, setProgress] = useState(msToSec(baseProgressMs ?? 0))
  const [pendingProgress, setPendingProgress] = useState<number>()

  // Update track progress.
  useEffect(() => {
    if (!isPlaying || baseProgressMs === undefined) return

    const started = Date.now()
    const interval = setInterval(
      () => setProgress(msToSec(Date.now() - started + baseProgressMs)),
      100
    )

    return () => clearInterval(interval)
  }, [isPlaying, baseProgressMs, setProgress])

  const seekTo = useCallback(
    async (seconds: number) => {
      if (!accessToken) return

      try {
        await Player.seek(accessToken, seconds * 1000)
        const newPlayback = await refetch()

        if (newPlayback.isSuccess && newPlayback.data) {
          setProgress(msToSec(newPlayback.data.progress_ms))
        } else if (newPlayback.error) {
          throw newPlayback.error
        } else {
          throw new Error("Unknown error seeking track.")
        }
      } catch (err) {
        console.error(err)
      }

      setPendingProgress(undefined)
    },
    [accessToken, setPendingProgress, refetch]
  )

  const [sendingAction, setSendingAction] = useState(false)
  const play = useFireAndForgetCallback(
    accessToken,
    Player.play,
    refetch,
    sendingAction,
    setSendingAction
  )
  const pause = useFireAndForgetCallback(
    accessToken,
    Player.pause,
    refetch,
    sendingAction,
    setSendingAction
  )
  const previous = useFireAndForgetCallback(
    accessToken,
    Player.previous,
    refetch,
    sendingAction,
    setSendingAction
  )
  const next = useFireAndForgetCallback(
    accessToken,
    Player.next,
    refetch,
    sendingAction,
    setSendingAction
  )

  const _save = useCallback(
    async (accessToken: string) => track && Tracks.save(accessToken, track.id),
    [track]
  )
  const save = useFireAndForgetCallback(
    accessToken,
    _save,
    refetch,
    sendingAction,
    setSendingAction
  )

  const _unsave = useCallback(
    async (accessToken: string) =>
      track && Tracks.unsave(accessToken, track.id),
    [track]
  )
  const unsave = useFireAndForgetCallback(
    accessToken,
    _unsave,
    refetch,
    sendingAction,
    setSendingAction
  )

  const durationSec = msToSec(track?.duration_ms ?? 0)
  const progressSec = pendingProgress ?? currProgress
  const remainingSec = durationSec - progressSec

  return (
    <>
      <Head>
        <title>Spui | Now Playing</title>
      </Head>

      <Header title="Now Playing" />

      <div className="flex-1 overflow-y-auto visible-scrollbar self-stretch flex flex-col justify-start items-center">
        {isError && error ? (
          <p>{error}</p>
        ) : isLoading ? (
          <Loader expand />
        ) : track && context ? (
          <>
            <ContextRow context={context} />

            <div className="w-3/4 flex-1 py-4 flex flex-col items-center gap-4">
              {track.album && (
                <Link href={`/album/${track.album.id}`}>
                  <a className="flex-1 flex flex-col items-center">
                    <LargeImage
                      images={track.album.images}
                      alt={`${track.name} cover art`}
                      className="m-auto !w-[30vh] max-w-full"
                    />
                  </a>
                </Link>
              )}

              <div className="flex flex-col items-stretch self-stretch">
                <div className="flex flex-row justify-between items-start gap-2">
                  <h1
                    className={classNames("break-word", {
                      // Vary text size by title length.
                      "text-2xl": track.name.length < 26,
                      "text-xl":
                        track.name.length >= 26 && track.name.length < 52,
                      "text-base": track.name.length >= 52,
                    })}
                  >
                    {track.name}
                  </h1>

                  <button
                    onClick={isItemSaved ? unsave : save}
                    className="hover:opacity-70 active:opacity-70"
                    disabled={sendingAction}
                  >
                    {isItemSaved ? (
                      <IoHeart size="2rem" />
                    ) : (
                      <IoHeartOutline size="2rem" />
                    )}
                  </button>
                </div>

                <div className="text-lg text-left mt-1 text-secondary self-stretch flex justify-start items-center flex-wrap gap-x-4 gap-y-2">
                  {track.artists.map(({ id, name }) => (
                    <Link href={`/artist/${id}`} key={id}>
                      <a className="hover:opacity-70 active:opacity-70">
                        {name}
                      </a>
                    </Link>
                  ))}
                </div>

                <Slider
                  className="mt-3 cursor-pointer"
                  min={0}
                  max={durationSec}
                  value={progressSec}
                  onChange={(value: number) => setPendingProgress(value)}
                  onAfterChange={(value: number) => seekTo(value)}
                  renderThumb={({ className, ...props }) => (
                    <div
                      {...props}
                      className={classNames(
                        className,
                        "w-3 h-3 -top-1 rounded-full bg-spuiOrange"
                      )}
                    ></div>
                  )}
                  renderTrack={({ className, ...props }) => (
                    <div
                      {...props}
                      className={classNames(
                        className,
                        "bg-spuiDark rounded-full h-1"
                      )}
                    ></div>
                  )}
                />

                <div className="mt-2 flex row justify-between items-center gap-2">
                  <p className="text-left flex-1">
                    {secToTimeString(progressSec)}
                  </p>
                  <p className="text-right flex-1">
                    -{secToTimeString(remainingSec)}
                  </p>
                </div>

                <div className="mt-2 flex row justify-center items-center gap-4">
                  <button
                    onClick={previous}
                    className="hover:opacity-70 active:opacity-70"
                    disabled={sendingAction}
                  >
                    <IoPlaySkipBack size="2.5rem" />
                  </button>

                  <button
                    onClick={isPlaying ? pause : play}
                    className="hover:opacity-70 active:opacity-70"
                    disabled={sendingAction}
                  >
                    {isPlaying ? (
                      <IoPauseCircle size="5rem" />
                    ) : (
                      <IoPlayCircle size="5rem" />
                    )}
                  </button>

                  <button
                    onClick={next}
                    className="hover:opacity-70 active:opacity-70"
                    disabled={sendingAction}
                  >
                    <IoPlaySkipForward size="2.5rem" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="mt-10 text-center">Nothing</p>
        )}
      </div>
    </>
  )
}

export default NowPage
