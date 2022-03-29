import { Playlist, PlaylistTrack } from "@/types"

import { ApiResponse, get as _get } from "./common"

export type GetPlaylistsResponse = ApiResponse<{
  href: string
  items: Playlist[]
  limit: number
  next: string | null
  offset: number
  previous: string | null
  total: number
}>

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

export type GetPlaylistTracksResponse = ApiResponse<{
  href: string
  items: PlaylistTrack[]
  limit: number
  next: string | null
  offset: number
  previous: string | null
  total: number
}>

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
