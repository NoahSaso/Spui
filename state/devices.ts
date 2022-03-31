import { useQuery } from "react-query"

import { Devices } from "@/services/api"
import { ApiError } from "@/services/api/common"
import { Device } from "@/types"

export const useDevices = (accessToken: string | null) =>
  useQuery<Device[] | undefined, ApiError>("devices", () =>
    accessToken ? Devices.get(accessToken) : undefined
  )
