import { Playlist, PlaylistTrack } from "@/types"

import { get as _get, ListResponse } from "./common"

export type GetPlaylistsResponse = ListResponse<Playlist>

export const get = async (
  accessToken: string,
  // Max = 50
  limit?: number,
  offset?: number
): Promise<GetPlaylistsResponse> =>
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
