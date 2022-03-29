import { selector, selectorFamily } from "recoil"

import { Playlists } from "@/services/api"
import { validAccessTokenOrNull } from "@/state"
import { Playlist, PlaylistTrack } from "@/types"

const getPlaylistsPaged = selectorFamily<
  Playlists.GetPlaylistsResponse | undefined,
  { limit?: number; page?: number }
>({
  key: "getPlaylistsPaged",
  get:
    ({ limit = 50, page = 1 }) =>
    async ({ get }) => {
      const accessToken = get(validAccessTokenOrNull)
      if (!accessToken) return

      const offset = (page - 1) * limit
      return await Playlists.get(accessToken, limit, offset)
    },
})

export const getAllPlaylists = selector<Playlist[] | undefined>({
  key: "getAllPlaylists",
  get: async ({ get }) => {
    const playlists = []
    let page = 1
    let pagesLeft = true
    do {
      const pagedPlaylists = get(getPlaylistsPaged({ page: page++ }))
      // No access token.
      if (!pagedPlaylists) return

      playlists.push(...pagedPlaylists.items)
      pagesLeft = pagedPlaylists.next !== null
    } while (pagesLeft)

    return playlists
  },
})

export const getPlaylist = selectorFamily<Playlist | undefined, string>({
  key: "getPlaylist",
  get:
    (playlistId) =>
    ({ get }) =>
      playlistId
        ? get(getAllPlaylists)?.find(({ id }) => id === playlistId)
        : undefined,
})

export const getPlaylistTracks = selectorFamily<
  PlaylistTrack[] | undefined,
  string
>({
  key: "getPlaylistTracks",
  get:
    (playlistId) =>
    async ({ get }) => {
      if (!playlistId) return

      const accessToken = get(validAccessTokenOrNull)
      if (!accessToken) return

      const tracks = []

      const limit = 50
      let page = 1
      let pagesLeft = true
      do {
        const pagedTracks = await Playlists.getTracks(
          accessToken,
          playlistId,
          limit,
          (page - 1) * limit
        )

        tracks.push(...pagedTracks.items)
        pagesLeft = pagedTracks.next !== null

        page++
      } while (pagesLeft)

      return tracks
    },
})

export interface PlaylistWithTracks {
  playlist: Playlist
  tracks: PlaylistTrack[]
}

export const getPlaylistWithTracks = selectorFamily<
  PlaylistWithTracks | undefined,
  string
>({
  key: "getPlaylistWithTracks",
  get:
    (playlistId) =>
    ({ get }) => {
      if (!playlistId) return

      const playlist = get(getPlaylist(playlistId))
      const tracks = get(getPlaylistTracks(playlistId))

      return playlist && tracks && { playlist, tracks }
    },
})
