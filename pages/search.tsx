import type { NextPage } from "next"
import { useEffect, useState } from "react"
import { useRecoilValueLoadable } from "recoil"

import {
  AlbumRow,
  ArtistRow,
  Header,
  Loader,
  SearchCategory,
  TrackRow,
} from "@/components"
import { useRequireAuthentication } from "@/hooks"
import { search } from "@/state"

const SearchPage: NextPage = () => {
  useRequireAuthentication()

  const [input, setInput] = useState("")
  const [activeSearch, setActiveSearch] = useState("")

  // Debounce input.
  useEffect(() => {
    const updateActiveSearch = () => setActiveSearch(input)
    const timeout = setTimeout(updateActiveSearch, 300)
    return () => clearTimeout(timeout)
  }, [input])

  const loadable = useRecoilValueLoadable(search(activeSearch))
  const response = loadable.state === "hasValue" ? loadable.contents : undefined
  const error =
    loadable.state === "hasError" ? loadable.contents.message : undefined

  return (
    <>
      <Header>
        <input
          type="text"
          placeholder="Search..."
          className="w-full h-full bg-[transparent] outline-none"
          onInput={(e) => setInput((e.target as HTMLInputElement).value)}
          value={input}
        />
      </Header>

      <div className="flex-1 overflow-y-auto visible-scrollbar self-stretch">
        {loadable.state === "loading" ? (
          <Loader expand />
        ) : loadable.state === "hasError" ? (
          <p>{error}</p>
        ) : null}

        {response && (
          <>
            <SearchCategory
              title="Tracks"
              items={response.tracks.items}
              render={(track) => <TrackRow key={track.id} _track={track} />}
            />
            <SearchCategory
              title="Artists"
              items={response.artists.items}
              render={(artist) => <ArtistRow key={artist.id} id={artist.id} />}
            />
            <SearchCategory
              title="Albums"
              items={response.albums.items}
              render={(album) => <AlbumRow key={album.id} id={album.id} />}
            />
          </>
        )}
      </div>
    </>
  )
}

export default SearchPage
