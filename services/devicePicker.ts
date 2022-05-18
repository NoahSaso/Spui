import { Device } from "@/types"

type OpenListener = (uriPath: string) => void
type PickHandledEvent =
  | {
      openedFallbackUri: false
      device: Device
    }
  | {
      openedFallbackUri: true
      device?: never
    }

// Listen for pickDevice call to open picker.
let openListener: OpenListener | null = null
// Called once device is picked.
let pickHandler: ((event: PickHandledEvent) => void) | null = null

// REQUESTER

// Request to open device picker.
export const pickDevice = (
  uriPath: string,
  onPick: (event: PickHandledEvent) => void
) => {
  pickHandler = onPick
  openListener?.(uriPath)
}

// HANDLER

// Setup handler for opening device picker.
export const subscribe = (callback: OpenListener): (() => void) => {
  openListener = callback
  return () => {
    openListener = null
  }
}

// Device has been picked, fire callback and clear.
export const pickedDevice = (event: PickHandledEvent) => {
  pickHandler?.(event)
  pickHandler = null
}
