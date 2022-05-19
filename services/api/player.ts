import { PlaybackState, RepeatState } from "@/types"

import { GET, POST, PUT } from "./common"

export const getPlaybackState = async (
  accessToken: string
): Promise<PlaybackState | false> =>
  // If undefined is returned, there is no active playback (204 no data).
  (await GET(accessToken, "/me/player")) ?? false

export const play = async (
  accessToken: string,
  {
    deviceId,
    contextUri,
  }: {
    deviceId?: string
    contextUri?: string
  } = {}
): Promise<void> =>
  PUT(
    accessToken,
    "/me/player/play",
    {
      ...(deviceId && { device_id: deviceId }),
    },
    {
      ...(contextUri && { context_uri: contextUri }),
    }
  )

export const pause = async (
  accessToken: string,
  deviceId?: string
): Promise<void> =>
  PUT(accessToken, "/me/player/pause", {
    ...(deviceId && { device_id: deviceId }),
  })

export const next = async (
  accessToken: string,
  deviceId?: string
): Promise<void> =>
  POST(accessToken, "/me/player/next", {
    ...(deviceId && { device_id: deviceId }),
  })

export const previous = async (
  accessToken: string,
  deviceId?: string
): Promise<void> =>
  POST(accessToken, "/me/player/previous", {
    ...(deviceId && { device_id: deviceId }),
  })

export const seek = async (
  accessToken: string,
  positionMs: number,
  deviceId?: string
): Promise<void> =>
  PUT(accessToken, "/me/player/seek", {
    position_ms: positionMs,
    ...(deviceId && { device_id: deviceId }),
  })

export const setRepeatState = async (
  accessToken: string,
  state: RepeatState,
  deviceId?: string
): Promise<void> =>
  PUT(accessToken, "/me/player/repeat", {
    state,
    ...(deviceId && { device_id: deviceId }),
  })

export const setVolume = async (
  accessToken: string,
  volumePercent: number,
  deviceId?: string
): Promise<void> =>
  PUT(accessToken, "/me/player/volume", {
    volume_percent: volumePercent,
    ...(deviceId && { device_id: deviceId }),
  })

export const setShuffleState = async (
  accessToken: string,
  state: boolean,
  deviceId?: string
): Promise<void> =>
  PUT(accessToken, "/me/player/shuffle", {
    state,
    ...(deviceId && { device_id: deviceId }),
  })

export const getRecentlyPlayed = async (
  accessToken: string,
  // Only one of before OR after can be set.
  {
    before,
    after,
  }:
    | { before?: never; after: number }
    | { before?: number; after?: never } = {},
  // Max = 50
  limit = 50
): Promise<void> =>
  GET(accessToken, "/me/player/recently-played", {
    ...(limit && { limit }),
    ...(before ? { before } : after ? { after } : undefined),
  })

export const addToQueue = async (
  accessToken: string,
  uri: string,
  deviceId?: string
): Promise<void> =>
  POST(accessToken, "/me/player/queue", {
    uri,
    ...(deviceId && { device_id: deviceId }),
  })
