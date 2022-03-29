import { FunctionComponent, useEffect } from "react"
import { IoCheckmark } from "react-icons/io5"
import { useRecoilValueLoadable, useSetRecoilState } from "recoil"

import { Loader, Modal } from "@/components"
import { devicesIdAtom, getDevices } from "@/state"
import { Device as DeviceType } from "@/types"

interface DeviceProps {
  device: DeviceType
  selected: boolean
  onClick: () => void
}
const Device: FunctionComponent<DeviceProps> = ({
  device: { name, type },
  selected,
  onClick,
}) => (
  <div
    className="w-full flex flex-row justify-start items-center gap-3 cursor-pointer hover:opacity-70 active:opacity-70 transition"
    onClick={(e) => {
      e.preventDefault()
      onClick()
    }}
  >
    <div className="flex flex-col justify-center items-start gap-2">
      <p>{name}</p>
      <p className="text-placeholder text-sm">{type}</p>
    </div>
    {selected && <IoCheckmark size={24} />}
  </div>
)

interface DevicesPickerModalProps {
  visible: boolean
  hide: () => void
  onPick: (device: DeviceType) => void
  // Show a checkmark next to selected device.
  isSelected: (device: DeviceType) => boolean
}

export const DevicesPickerModal: FunctionComponent<DevicesPickerModalProps> = ({
  visible,
  hide,
  onPick,
  isSelected,
}) => {
  const setDevicesId = useSetRecoilState(devicesIdAtom)

  const loadable = useRecoilValueLoadable(getDevices)
  const devices = loadable.state === "hasValue" ? loadable.contents : undefined
  const error =
    loadable.state === "hasError" ? loadable.contents.message : undefined

  // Refresh devices every 10 seconds when the modal is open.
  useEffect(() => {
    if (visible) {
      const interval = setInterval(
        () => setDevicesId((id) => id + 1),
        1000 * 10
      )
      return () => clearInterval(interval)
    }
  }, [visible, setDevicesId])

  return (
    <Modal visible={visible} hide={hide}>
      <p className="text-center mb-10">Devices</p>

      {loadable.state === "loading" ? (
        <Loader expand />
      ) : loadable.state === "hasError" ? (
        <p>{error}</p>
      ) : null}

      <div className="w-3/5 self-center flex flex-col gap-4">
        {devices?.map((device) => (
          <Device
            key={device.id}
            device={device}
            selected={isSelected(device)}
            onClick={() => onPick(device)}
          />
        ))}
      </div>
    </Modal>
  )
}
