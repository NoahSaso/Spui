import { post } from "./common"

export const addToQueue = async (
  accessToken: string,
  uri: string,
  deviceId?: string
): Promise<void> =>
  post(accessToken, "/me/player/queue", {
    uri,
    ...(deviceId && { device_id: deviceId }),
  })
