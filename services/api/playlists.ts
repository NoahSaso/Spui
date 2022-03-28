import { ApiResponse, get as _get } from "./common"

export interface Playlist {
  collaborative: boolean
  description: string | null
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  images: {
    url: string
    height: number | null
    width: number | null
  }[]
  name: string
  owner: {
    display_name: string
    external_urls: {
      spotify: string
    }
    href: string
    id: string
    type: "user"
    uri: string
  }
  public: boolean | null
  snapshot_id: string
  tracks: {
    href: string
    total: number
  }
  type: "playlist"
  uri: string
}

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
