export enum Type {
  Album = "album",
  Artist = "artist",
  Playlist = "playlist",
  Track = "track",
  Show = "show",
  Episode = "episode",
}

export interface Image {
  url: string
  height: number | null
  width: number | null
}

export interface ExternalUrls {
  spotify: string
}

export interface BaseUser {
  external_urls: ExternalUrls
  href: string
  id: string
  type: "user"
  uri: string
}

export interface OwnerUser extends BaseUser {
  display_name: string
}

export interface AddedByUser extends BaseUser {}

export interface Playlist {
  collaborative: boolean
  description: string | null
  external_urls: ExternalUrls
  href: string
  id: string
  images: Image[]
  name: string
  owner: OwnerUser
  public: boolean | null
  snapshot_id: string
  tracks: {
    href: string
    total: number
  }
  type: Type.Playlist
  uri: string
}

export interface Artist {
  external_urls: ExternalUrls
  href: string
  id: string
  images: Image[]
  name: string
  type: Type.Artist
  uri: string
  genres: string[]
  popularity: number
}

export interface Album {
  album_type: "album" | "single" | "compilation"
  artists: Artist[]
  available_markets: string[]
  external_urls: ExternalUrls
  href: string
  id: string
  images: Image[]
  name: string
  release_date: string
  release_date_precision: "day" | "month" | "year"
  total_tracks: number
  type: Type.Album
  uri: string
}

export interface Track {
  album: Album
  artists: Artist[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: {
    isrc: string
  }
  external_urls: ExternalUrls
  href: string
  id: string
  is_local: boolean
  name: string
  popularity: number
  preview_url: string | null
  track_number: number
  type: Type.Track
  uri: string
}

export interface PlaylistTrack {
  added_at: string
  added_by: AddedByUser
  is_local: boolean
  track: Track & {
    episode: false
    track: true
  }
  video_thumbnail: {
    url: string | null
  }
}

export interface Device {
  id: string
  is_active: boolean
  is_private_session: boolean
  is_restricted: boolean
  name: string
  type: string
  volume_percent: number
}
