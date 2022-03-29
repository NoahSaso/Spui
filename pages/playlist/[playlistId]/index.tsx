import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useRecoilValueLoadable } from "recoil"
import { getPlaylistTracks } from "state/playlists"

import { PlaylistTrackRow } from "@/components"
import { useRequireAuthentication } from "@/hooks"

const PlaylistPage: NextPage = () => {
  useRequireAuthentication()

  const { isReady, query } = useRouter()

  const loadable = useRecoilValueLoadable(
    getPlaylistTracks(
      isReady && typeof query.playlistId === "string" ? query.playlistId : ""
    )
  )
  const tracks = loadable.state === "hasValue" ? loadable.contents : undefined
  const tracksError =
    loadable.state === "hasError" ? loadable.contents.message : undefined

  return (
    <div className="">
      <>
        <p>
          {loadable.state === "loading"
            ? "Loading tracks..."
            : loadable.state === "hasError"
            ? tracksError
            : null}
        </p>
        <div>
          {tracks?.map((track) => (
            <PlaylistTrackRow key={track.track.id} track={track} />
          ))}
        </div>
      </>
    </div>
  )
}

export default PlaylistPage
