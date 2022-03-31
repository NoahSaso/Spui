import { FunctionComponent, useState } from "react"
import { useRecoilValue } from "recoil"

import {
  AlbumRow,
  ArtistRow,
  Loader,
  SearchCategory,
  TrackRow,
} from "@/components"
import { useProbeSearchResults, validAccessTokenOrNull } from "@/state"
import { Album, Artist, Track, Type } from "@/types"

interface SearchResultsProps {
  search: string
}

export const SearchResults: FunctionComponent<SearchResultsProps> = ({
  search,
}) => {
  const [open, setOpen] = useState<Type>()

  const accessToken = useRecoilValue(validAccessTokenOrNull)

  const {
    data: results,
    isError,
    error,
    isLoading,
  } = useProbeSearchResults(accessToken, search)

  if (isLoading) return <Loader expand />
  if (!search || !results) return null

  const { tracks, artists, albums } = results

  return isError && error ? (
    <p>{error}</p>
  ) : (
    <>
      <SearchCategory<Track>
        title="Tracks"
        type={Type.Track}
        search={search}
        total={tracks.total}
        render={(track) => <TrackRow key={track.id} _track={track} />}
        open={open === Type.Track}
        toggle={() =>
          setOpen((o) => (o === Type.Track ? undefined : Type.Track))
        }
      />
      <SearchCategory<Artist>
        title="Artists"
        type={Type.Artist}
        search={search}
        total={artists.total}
        render={(artist) => <ArtistRow key={artist.id} id={artist.id} />}
        open={open === Type.Artist}
        toggle={() =>
          setOpen((o) => (o === Type.Artist ? undefined : Type.Artist))
        }
      />
      <SearchCategory<Album>
        title="Albums"
        type={Type.Album}
        search={search}
        total={albums.total}
        render={(album) => <AlbumRow key={album.id} id={album.id} />}
        open={open === Type.Album}
        toggle={() =>
          setOpen((o) => (o === Type.Album ? undefined : Type.Album))
        }
      />
    </>
  )
}
