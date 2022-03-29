import { Album, Artist, Playlist, Track, Type } from "@/types"

import { get as _get, ListResponse } from "./common"

export interface SearchResponse {
  tracks: ListResponse<Track>
  artists: ListResponse<Artist>
  albums: ListResponse<Album>
  playlists: ListResponse<Playlist>
}

export const get = async (
  accessToken: string,
  q: string,
  types?: Type[]
): Promise<SearchResponse> =>
  _get(accessToken, "/search", {
    q,
    type: (
      (types?.length && types) || [Type.Album, Type.Artist, Type.Track]
    ).join(","),
    // Max = 50
    limit: 50,
  })
