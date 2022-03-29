import { Device } from "@/types"

// Listen for pickDevice call to open picker.
let openListener: (() => void) | null = null
// Called once device is picked.
let pickHandler: ((device: Device) => void) | null = null

// REQUESTER

// Request to open device picker.
export const pickDevice = (onPick: (device: Device) => void) => {
  pickHandler = onPick
  openListener?.()
}

// HANDLER

// Setup handler for opening device picker.
export const subscribe = (callback: () => void): (() => void) => {
  openListener = callback
  return () => {
    openListener = null
  }
}

// Device has been picked, fire callback and clear.
export const pickedDevice = (device: Device) => {
  pickHandler?.(device)
  pickHandler = null
}
