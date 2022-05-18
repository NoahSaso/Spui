import { FunctionComponent, useCallback, useEffect, useState } from "react"
import { IoCheckmark } from "react-icons/io5"
import { useRecoilValue } from "recoil"

import { ErrorBoundary, Loader, Modal } from "@/components"
import { DevicePicker } from "@/services"
import { useDevices, validAccessTokenOrNull } from "@/state"
import { Device as DeviceType } from "@/types"

export const DevicePickerContainer = () => {
  const accessToken = useRecoilValue(validAccessTokenOrNull)
  const {
    data: devices,
    isLoading,
    isError,
    error,
    refetch,
  } = useDevices(accessToken)

  const [visible, setVisible] = useState(false)

  const onPick = useCallback(
    (device?: DeviceType) => {
      DevicePicker.pickedDevice(
        device
          ? { openedFallbackUri: false, device }
          : { openedFallbackUri: true }
      )
      setVisible(false)
    },
    [setVisible]
  )

  // If no devices found, allow opening fallback URI.
  const [fallbackUri, setFallbackUri] = useState<string>()

  // Listen for pick requests until unmounted.
  useEffect(
    () =>
      DevicePicker.subscribe((uri) => {
        setVisible(true)
        setFallbackUri(uri)
      }),
    []
  )

  // Refresh devices every 10 seconds when the modal is open.
  useEffect(() => {
    if (visible) {
      const interval = setInterval(refetch, 1000 * 10)
      // Update right away.
      refetch()

      return () => clearInterval(interval)
    }
  }, [visible, refetch])

  return (
    <Modal visible={visible} hide={() => setVisible(false)}>
      <p className="text-center mb-10 text-xl">Devices</p>

      <ErrorBoundary>
        {isLoading ? (
          <Loader expand />
        ) : isError && error ? (
          <p>{error}</p>
        ) : (
          <div className="w-3/5 self-center flex flex-col gap-4">
            {devices?.map((device) => (
              <Device
                key={device.id}
                device={device}
                onClick={() => onPick(device)}
              />
            ))}
            {!devices?.length && (
              <>
                <p className="text-center">
                  No active devices found.
                  <br />
                  <a
                    href={fallbackUri}
                    className="underline"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => onPick()}
                  >
                    Click here
                  </a>{" "}
                  to open manually.
                </p>
              </>
            )}
          </div>
        )}
      </ErrorBoundary>
    </Modal>
  )
}

interface DeviceProps {
  device: DeviceType
  selected?: boolean
  onClick: () => void
}
const Device: FunctionComponent<DeviceProps> = ({
  device: { name, type },
  selected,
  onClick,
}) => (
  <div
    className="w-full flex flex-row justify-start items-center gap-3 cursor-pointer hover:opacity-70 active:opacity-70 transition"
    onClick={() => onClick()}
  >
    <div className="flex flex-col justify-center items-start gap-2">
      <p>{name}</p>
      <p className="text-placeholder text-sm">{type}</p>
    </div>
    {selected && <IoCheckmark size={24} />}
  </div>
)
