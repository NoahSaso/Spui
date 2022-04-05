import { Album, Track } from "@/types"

import { GET, ListResponse } from "./common"

export const get = async (
  accessToken: string,
  albumId: string
): Promise<Album> => GET(accessToken, `/albums/${albumId}`)

export type GetAlbumTracksResponse = ListResponse<Track>

export const getTracks = async (
  accessToken: string,
  albumId: string,
  // Max = 50
  limit?: number,
  offset?: number
): Promise<GetAlbumTracksResponse> =>
  GET(accessToken, `/albums/${albumId}/tracks`, {
    ...(limit && { limit }),
    ...(offset && { offset }),
  })
