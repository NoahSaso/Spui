import { selectorFamily } from "recoil"

import { Albums } from "@/services/api"
import { validAccessTokenOrNull } from "@/state"
import { Album, Track } from "@/types"

const getAlbum = selectorFamily<Album | undefined, string>({
  key: "getAlbum",
  get:
    (albumId) =>
    async ({ get }) => {
      if (!albumId) return

      const accessToken = get(validAccessTokenOrNull)
      if (!accessToken) return

      return await Albums.get(accessToken, albumId)
    },
})

export const getAlbumTracks = selectorFamily<Track[] | undefined, string>({
  key: "getAlbumTracks",
  get:
    (albumId) =>
    async ({ get }) => {
      const accessToken = get(validAccessTokenOrNull)
      if (!accessToken) return

      const album = get(getAlbum(albumId))
      if (!album) return

      const tracks = []

      const limit = 50
      let page = 1
      let pagesLeft = true
      do {
        const pagedTracks = await Albums.getTracks(
          accessToken,
          albumId,
          limit,
          (page - 1) * limit
        )

        tracks.push(...pagedTracks.items)
        pagesLeft = pagedTracks.next !== null

        page++
      } while (pagesLeft)

      // Add album object since it is missing.
      return tracks.map((track) => ({
        ...track,
        album,
      }))
    },
})

export interface AlbumWithTracks {
  album: Album
  tracks: Track[]
}

export const getAlbumWithTracks = selectorFamily<
  AlbumWithTracks | undefined,
  string
>({
  key: "getAlbumWithTracks",
  get:
    (albumId) =>
    ({ get }) => {
      if (!albumId) return

      const album = get(getAlbum(albumId))
      const tracks = get(getAlbumTracks(albumId))

      return album && tracks && { album, tracks }
    },
})
