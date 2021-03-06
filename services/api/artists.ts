import { Album, Artist, Track } from "@/types"

import { GET, ListResponse } from "./common"

export const get = async (
  accessToken: string,
  artistId: string
): Promise<Artist> => GET(accessToken, `/artists/${artistId}`)

export type GetArtistAlbumsResponse = ListResponse<Album>

export const getAlbums = async (
  accessToken: string,
  artistId: string,
  // Max = 50
  limit?: number,
  offset?: number
): Promise<GetArtistAlbumsResponse> =>
  GET(accessToken, `/artists/${artistId}/albums`, {
    ...(limit && { limit }),
    ...(offset && { offset }),
    // Exclude "compilation".
    include_groups: "album,single",
  })

// Attempt to get country from browser.
const country =
  new Intl.Locale(Intl.DateTimeFormat().resolvedOptions().locale).region || "US"

export const getTopTracks = async (
  accessToken: string,
  artistId: string
): Promise<Track[]> =>
  (
    await GET<{ tracks: Track[] }>(
      accessToken,
      `/artists/${artistId}/top-tracks`,
      { country }
    )
  ).tracks
