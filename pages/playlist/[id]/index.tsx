import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useRecoilValueLoadable } from "recoil"

import { Header, Loader, TrackRow } from "@/components"
import { useRequireAuthentication } from "@/hooks"
import { getPlaylistWithTracks } from "@/state"

const PlaylistPage: NextPage = () => {
  useRequireAuthentication()

  const { isReady, query } = useRouter()

  const loadable = useRecoilValueLoadable(
    getPlaylistWithTracks(
      isReady && typeof query.id === "string" ? query.id : ""
    )
  )
  const { playlist, tracks } =
    (loadable.state === "hasValue" && loadable.contents) || {}
  const error =
    loadable.state === "hasError" ? loadable.contents.message : undefined

  return (
    <>
      <Header title={playlist?.name} backPath="/playlists" />

      <div className="flex-1 overflow-y-auto visible-scrollbar self-stretch my-1 flex flex-col items-stretch">
        {loadable.state === "loading" ? (
          <Loader expand />
        ) : loadable.state === "hasError" ? (
          <p>{error}</p>
        ) : null}

        {playlist && playlist.images.length > 0 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={playlist.images[0].url}
            alt="art"
            className="my-4 self-center w-[44%] aspect-square object-cover"
          />
        )}

        {tracks?.map(({ track }) => (
          <TrackRow key={track.id} _track={track} />
        ))}
      </div>
    </>
  )
}

export default PlaylistPage
