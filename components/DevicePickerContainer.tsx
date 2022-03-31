import {
  FunctionComponent,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react"
import { IoCheckmark } from "react-icons/io5"
import { useRecoilValue, useSetRecoilState } from "recoil"

import { ErrorBoundary, Loader, Modal } from "@/components"
import { DevicePicker } from "@/services"
import { devicesIdAtom, getDevices } from "@/state"
import { Device as DeviceType } from "@/types"

export const DevicePickerContainer = () => {
  const setDevicesId = useSetRecoilState(devicesIdAtom)
  const devices = useRecoilValue(getDevices)

  const [visible, setVisible] = useState(false)

  const onPick = useCallback(
    (device: DeviceType) => {
      DevicePicker.pickedDevice(device)
      setVisible(false)
    },
    [setVisible]
  )

  // Listen for pick requests until unmounted.
  useEffect(() => DevicePicker.subscribe(() => setVisible(true)), [])

  // Refresh devices every 10 seconds when the modal is open.
  useEffect(() => {
    if (visible) {
      const interval = setInterval(
        () => setDevicesId((id) => id + 1),
        1000 * 10
      )
      // Update right away.
      setDevicesId((id) => id + 1)

      return () => clearInterval(interval)
    }
  }, [visible, setDevicesId])

  return (
    <Modal visible={visible} hide={() => setVisible(false)}>
      <p className="text-center mb-10">Devices</p>

      <ErrorBoundary>
        <Suspense fallback={<Loader expand />}>
          <DeviceList devices={devices ?? []} onPick={onPick} />
        </Suspense>
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

interface DeviceListProps {
  devices: DeviceType[]
  onPick: (device: DeviceType) => void
}

const DeviceList: FunctionComponent<DeviceListProps> = ({
  devices,
  onPick,
}) => (
  <>
    <div className="w-3/5 self-center flex flex-col gap-4">
      {devices?.map((device) => (
        <Device
          key={device.id}
          device={device}
          onClick={() => onPick(device)}
        />
      ))}
    </div>
  </>
)
