import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useRecoilValueLoadable } from "recoil"

import { Header, Loader, TrackRow } from "@/components"
import { useRequireAuthentication } from "@/hooks"
import { getAlbumWithTracks } from "@/state"

const AlbumPage: NextPage = () => {
  useRequireAuthentication()

  const { isReady, query } = useRouter()

  const loadable = useRecoilValueLoadable(
    getAlbumWithTracks(isReady && typeof query.id === "string" ? query.id : "")
  )
  const { album, tracks } =
    (loadable.state === "hasValue" && loadable.contents) || {}
  const error =
    loadable.state === "hasError" ? loadable.contents.message : undefined

  return (
    <>
      <Header title={album?.name} />

      <div className="flex-1 overflow-y-auto visible-scrollbar self-stretch my-1">
        {loadable.state === "loading" ? (
          <Loader expand />
        ) : loadable.state === "hasError" ? (
          <p>{error}</p>
        ) : null}

        {tracks?.map((track) => (
          <TrackRow key={track.id} _track={track} />
        ))}
      </div>
    </>
  )
}

export default AlbumPage
