import { Album, Track } from "@/types"

import { get as _get, ListResponse } from "./common"

export const get = async (
  accessToken: string,
  albumId: string
): Promise<Album> => _get(accessToken, `/albums/${albumId}`)

export type GetAlbumTracksResponse = ListResponse<Track>

export const getTracks = async (
  accessToken: string,
  albumId: string,
  // Max = 50
  limit?: number,
  offset?: number
): Promise<GetAlbumTracksResponse> =>
  _get(accessToken, `/albums/${albumId}/tracks`, {
    ...(limit && { limit }),
    ...(offset && { offset }),
  })
