import { Device } from "@/types"

import { get as _get } from "./common"

export type GetDevicesResponse = Device[]

export const get = async (accessToken: string): Promise<GetDevicesResponse> =>
  (
    await _get<{ devices: GetDevicesResponse }>(
      accessToken,
      "/me/player/devices"
    )
  ).devices.filter(
    // From the Spotify docs (https://developer.spotify.com/documentation/web-api/reference/#/operations/get-a-users-available-devices)
    // Whether controlling this device is restricted. At present if this is "true" then no Web API commands will be accepted by this device.
    ({ is_restricted }) => !is_restricted
  )
