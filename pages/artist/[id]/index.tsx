import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useRecoilValueLoadable } from "recoil"
import { getArtistWithAlbumsAndTopTracks } from "state/artists"

import { AlbumRow, Header, Loader, TrackRow } from "@/components"
import { useRequireAuthentication } from "@/hooks"

const ArtistPage: NextPage = () => {
  useRequireAuthentication()

  const { isReady, query } = useRouter()

  const loadable = useRecoilValueLoadable(
    getArtistWithAlbumsAndTopTracks(
      isReady && typeof query.id === "string" ? query.id : ""
    )
  )
  const { artist, albums, topTracks } =
    (loadable.state === "hasValue" && loadable.contents) || {}
  const error =
    loadable.state === "hasError" ? loadable.contents.message : undefined

  return (
    <>
      <Header title={artist?.name} />

      <div className="flex-1 overflow-y-auto visible-scrollbar self-stretch my-1">
        {loadable.state === "loading" ? (
          <Loader expand />
        ) : loadable.state === "hasError" ? (
          <p>{error}</p>
        ) : null}

        <h2 className="my-2 pl-3 text-lg">Top Tracks</h2>
        <div>
          {topTracks?.map((track) => (
            <TrackRow key={track.id} _track={track} />
          ))}
        </div>

        <h2 className="mt-10 mb-2 pl-3 text-lg">Albums</h2>

        {albums?.map((album) => (
          <AlbumRow key={album.id} id={album.id} _album={album} />
        ))}
      </div>
    </>
  )
}

export default ArtistPage
