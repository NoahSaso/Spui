import { selectorFamily } from "recoil"

import { Artists } from "@/services/api"
import { validAccessTokenOrNull } from "@/state"
import { Album, Artist, Track } from "@/types"

const getArtist = selectorFamily<Artist | undefined, string>({
  key: "getArtist",
  get:
    (artistId) =>
    async ({ get }) => {
      if (!artistId) return

      const accessToken = get(validAccessTokenOrNull)
      if (!accessToken) return

      return await Artists.get(accessToken, artistId)
    },
})

export const getArtistAlbums = selectorFamily<Album[] | undefined, string>({
  key: "getArtistAlbums",
  get:
    (artistId) =>
    async ({ get }) => {
      if (!artistId) return

      const accessToken = get(validAccessTokenOrNull)
      if (!accessToken) return

      const albums = []

      const limit = 50
      let page = 1
      let pagesLeft = true
      do {
        const pagedAlbums = await Artists.getAlbums(
          accessToken,
          artistId,
          limit,
          (page - 1) * limit
        )

        albums.push(...pagedAlbums.items)
        pagesLeft = pagedAlbums.next !== null

        page++
      } while (pagesLeft)

      return albums
    },
})

export const getArtistTopTracks = selectorFamily<Track[] | undefined, string>({
  key: "getArtistTopTracks",
  get:
    (artistId) =>
    async ({ get }) => {
      if (!artistId) return

      const accessToken = get(validAccessTokenOrNull)
      if (!accessToken) return

      return await Artists.getTopTracks(accessToken, artistId)
    },
})

export interface ArtistWithAlbumsAndTopTracks {
  artist: Artist
  albums: Album[]
  topTracks: Track[]
}

export const getArtistWithAlbumsAndTopTracks = selectorFamily<
  ArtistWithAlbumsAndTopTracks | undefined,
  string
>({
  key: "getArtistWithAlbumsAndTopTracks",
  get:
    (artistId) =>
    ({ get }) => {
      if (!artistId) return

      const artist = get(getArtist(artistId))
      const albums = get(getArtistAlbums(artistId))
      const topTracks = get(getArtistTopTracks(artistId))

      return artist && albums && topTracks && { artist, albums, topTracks }
    },
})
