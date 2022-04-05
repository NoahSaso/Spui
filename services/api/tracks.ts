import { DELETE, GET, PUT } from "./common"

export const save = async (
  accessToken: string,
  trackId: string
): Promise<void> =>
  PUT(accessToken, "/me/tracks", undefined, { ids: [trackId] })

export const unsave = async (
  accessToken: string,
  trackId: string
): Promise<void> =>
  DELETE(accessToken, "/me/tracks", undefined, { ids: [trackId] })

type GetIsSavedResponse = boolean[]

export const areSaved = async (
  accessToken: string,
  trackIds: string[]
): Promise<GetIsSavedResponse> =>
  GET<GetIsSavedResponse>(accessToken, "/me/tracks/contains", {
    ids: trackIds,
  })

export const isSaved = async (
  accessToken: string,
  trackId: string
): Promise<boolean> => (await areSaved(accessToken, [trackId]))[0]
