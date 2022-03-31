import { Album, Artist, Playlist, Track, Type } from "@/types"

import { get as _get, ListResponse } from "./common"

export interface SearchResponse {
  tracks: ListResponse<Track>
  artists: ListResponse<Artist>
  albums: ListResponse<Album>
  playlists: ListResponse<Playlist>
  shows: ListResponse<any>
  episodes: ListResponse<any>
}

export const get = async (
  accessToken: string,
  q: string,
  // Max = 50
  limit?: number,
  offset?: number,
  types?: Type[]
): Promise<SearchResponse> =>
  _get(accessToken, "/search", {
    q,
    type: (
      (types?.length && types) || [Type.Album, Type.Artist, Type.Track]
    ).join(","),
    ...(limit && { limit }),
    ...(offset && { offset }),
  })
