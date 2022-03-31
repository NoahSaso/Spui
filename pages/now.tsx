import classNames from "classnames"
import type { NextPage } from "next"
import Link from "next/link"

import { ContextRow, Header, LargeImage, Loader } from "@/components"
import { useRequireAuthentication } from "@/hooks"
import { useCurrentPlayback } from "@/state"

const NowPage: NextPage = () => {
  const { accessToken } = useRequireAuthentication()
  const {
    data: currentPlayback,
    isLoading,
    isError,
    error,
  } = useCurrentPlayback(accessToken)

  const { item: track, context } = currentPlayback || {}

  return (
    <>
      <Header title="Now Playing" />

      <div className="flex-1 overflow-y-auto visible-scrollbar self-stretch flex flex-col justify-start items-center">
        {isError && error ? (
          <p>{error}</p>
        ) : isLoading ? (
          <Loader expand />
        ) : track && context ? (
          <>
            <ContextRow context={context} />

            <Link href={`/album/${track.album.id}`}>
              <a className="mt-4 w-full flex flex-col items-center">
                <LargeImage
                  images={track.album.images}
                  alt={`${track.name} cover art`}
                  className="my-4"
                />
              </a>
            </Link>

            <h1
              className={classNames("mt-4 text-center", {
                // Vary text size by title length.
                "text-3xl": track.name.length < 26,
                "text-xl": track.name.length >= 26 && track.name.length < 52,
                "text-base": track.name.length >= 52,
              })}
            >
              {track.name}
            </h1>

            <div className="text-xl text-center leading-5 mt-3 text-secondary self-stretch flex justify-center items-center flex-wrap gap-6">
              {track.artists.map(({ id, name }) => (
                <Link href={`/artist/${id}`} key={id}>
                  <a className="hover:opacity-70 active:opacity-70">{name}</a>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-10">Nothing</p>
        )}
      </div>
    </>
  )
}

export default NowPage
