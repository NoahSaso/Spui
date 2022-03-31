import { FunctionComponent } from "react"
import { useRecoilValue } from "recoil"

import { AlbumRow, ArtistRow, SearchCategory, TrackRow } from "@/components"
import { getSearchResults } from "@/state"

interface SearchResultsProps {
  search: string
}

export const SearchResults: FunctionComponent<SearchResultsProps> = ({
  search,
}) => {
  const results = useRecoilValue(getSearchResults(search))

  if (!results) return null

  const { tracks, artists, albums } = results

  return (
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
