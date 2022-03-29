import { atom, selector } from "recoil"

import { Devices } from "@/services/api"
import { validAccessTokenOrNull } from "@/state"

// Use to refresh the devices.
export const devicesIdAtom = atom({
  key: "devicesId",
  default: 0,
})

export const getDevices = selector<Devices.GetDevicesResponse | undefined>({
  key: "getDevices",
  get: async ({ get }) => {
    get(devicesIdAtom)

    const accessToken = get(validAccessTokenOrNull)
    if (!accessToken) return

    return await Devices.get(accessToken)
  },
})
