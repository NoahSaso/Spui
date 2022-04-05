import { Playlist, PlaylistTrack } from "@/types"

import { GET, ListResponse } from "./common"

export const get = async (
  accessToken: string,
  playlistId: string
): Promise<Playlist> => GET(accessToken, `/playlists/${playlistId}`)

export type ListPlaylistsResponse = ListResponse<Playlist>

export const list = async (
  accessToken: string,
  // Max = 50
  limit?: number,
  offset?: number
): Promise<ListPlaylistsResponse> =>
  GET(accessToken, "/me/playlists", {
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
  GET(accessToken, `/playlists/${playlistId}/tracks`, {
    ...(limit && { limit }),
    ...(offset && { offset }),
  })
