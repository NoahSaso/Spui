import classNames from "classnames"
import type { NextPage } from "next"
import Link from "next/link"

import { ContextRow, Header, Loader } from "@/components"
import { useCurrentPlayback, useRequireAuthentication } from "@/hooks"

const NowPage: NextPage = () => {
  useRequireAuthentication()
  const { currentPlayback, error } = useCurrentPlayback()

  const { item: track, context } = currentPlayback || {}

  return (
    <>
      <Header title="Now Playing" titleCentered />

      <div className="flex-1 overflow-y-auto visible-scrollbar self-stretch flex flex-col justify-start items-center">
        {error ? (
          <p>{error}</p>
        ) : currentPlayback === undefined ? (
          <Loader expand />
        ) : track && context ? (
          <>
            <ContextRow context={context} />

            <Link href={`/album/${track.album.id}`}>
              <a className="mt-10 block w-2/3 aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={track.album.images[0].url}
                  alt="art"
                  className="object-cover"
                />
              </a>
            </Link>

            <h1
              className={classNames("mt-6 text-center", {
                // Vary text size by title length.
                "text-3xl": track.name.length < 26,
                "text-xl": track.name.length >= 26 && track.name.length < 52,
                "text-base": track.name.length >= 52,
              })}
            >
              {track.name}
            </h1>

            <div className="text-xl text-center leading-5 mt-3 text-secondary self-stretch flex justify-center items-center flex-wrap gap-4">
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
