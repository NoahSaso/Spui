import { Playlist, PlaylistTrack } from "@/types"

import { get as _get, ListResponse } from "./common"

export const get = async (
  accessToken: string,
  playlistId: string
): Promise<Playlist> => _get(accessToken, `/playlists/${playlistId}`)

export type ListPlaylistsResponse = ListResponse<Playlist>

export const list = async (
  accessToken: string,
  // Max = 50
  limit?: number,
  offset?: number
): Promise<ListPlaylistsResponse> =>
  _get(accessToken, "/me/playlists", {
    ...(limit && { limit }),
    ...(offset && { offset }),
  })

export type GetPlaylistTracksResponse = ListResponse<PlaylistTrack>

export const getTracks = async (
  accessToken: string,
  playlistId: string,
  // Max = 50
  limit?: number,
  offset?: number
): Promise<GetPlaylistTracksResponse> =>
  _get(accessToken, `/playlists/${playlistId}/tracks`, {
    ...(limit && { limit }),
    ...(offset && { offset }),
  })
