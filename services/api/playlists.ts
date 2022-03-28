import { ApiResponse, get as _get } from "./common"

export interface Playlist {}

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
  limit = 50,
  offset?: number
): Promise<GetPlaylistsResponse> =>
  _get(accessToken, "/me/playlists", {
    ...(limit && { limit }),
    ...(offset && { offset }),
  })
