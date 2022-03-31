import { FunctionComponent } from "react"
import { useRecoilValue } from "recoil"

import {
  AlbumRow,
  ArtistRow,
  Loader,
  SearchCategory,
  TrackRow,
} from "@/components"
import { useSearchResults, validAccessTokenOrNull } from "@/state"

interface SearchResultsProps {
  search: string
}

export const SearchResults: FunctionComponent<SearchResultsProps> = ({
  search,
}) => {
  const accessToken = useRecoilValue(validAccessTokenOrNull)

  const {
    data: results,
    isError,
    error,
    isLoading,
  } = useSearchResults(accessToken, search)

  if (isLoading) return <Loader expand />
  if (!search || !results) return null

  const { tracks, artists, albums } = results

  return isError && error ? (
    <p>{error}</p>
  ) : (
    <>
      <SearchCategory
        title="Tracks"
        items={tracks.items}
        render={(track) => <TrackRow key={track.id} _track={track} />}
      />
      <SearchCategory
        title="Artists"
        items={artists.items}
        render={(artist) => <ArtistRow key={artist.id} id={artist.id} />}
      />
      <SearchCategory
        title="Albums"
        items={albums.items}
        render={(album) => <AlbumRow key={album.id} id={album.id} />}
      />
    </>
  )
}
