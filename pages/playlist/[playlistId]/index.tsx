import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useRecoilValueLoadable } from "recoil"

import { Loader, PlaylistTrackRow } from "@/components"
import { useRequireAuthentication } from "@/hooks"
import { getPlaylistTracks } from "@/state"

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
    <>
      {loadable.state === "loading" ? (
        <Loader expand />
      ) : loadable.state === "hasError" ? (
        <p>{tracksError}</p>
      ) : null}

      <div>
        {tracks?.map((track) => (
          <PlaylistTrackRow key={track.track.id} track={track} />
        ))}
      </div>
    </>
  )
}

export default PlaylistPage
