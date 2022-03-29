import type { NextPage } from "next"
import { useRecoilValueLoadable } from "recoil"

import { PlaylistRow } from "@/components"
import { useRequireAuthentication } from "@/hooks"
import { getAllPlaylists } from "@/state"

const PlaylistsPage: NextPage = () => {
  useRequireAuthentication()

  const loadable = useRecoilValueLoadable(getAllPlaylists)
  const playlists =
    loadable.state === "hasValue" ? loadable.contents : undefined
  const error =
    loadable.state === "hasError" ? loadable.contents.message : undefined

  return (
    <div className="">
      <>
        <p>
          {loadable.state === "loading"
            ? "Loading playlists..."
            : loadable.state === "hasError"
            ? error
            : null}
        </p>
        <div>
          {playlists?.map((playlist) => (
            <PlaylistRow key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </>
    </div>
  )
}

export default PlaylistsPage
