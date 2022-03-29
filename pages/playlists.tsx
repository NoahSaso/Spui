import type { NextPage } from "next"
import { useRecoilValueLoadable } from "recoil"

import { Loader, PlaylistRow } from "@/components"
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
    <>
      {loadable.state === "loading" ? (
        <Loader expand />
      ) : loadable.state === "hasError" ? (
        <p>{error}</p>
      ) : null}
      {playlists?.map((playlist) => (
        <PlaylistRow key={playlist.id} playlist={playlist} />
      ))}
    </>
  )
}

export default PlaylistsPage
