import classNames from "classnames"
import { FunctionComponent, PropsWithChildren } from "react"

type ModalProps = PropsWithChildren<{
  visible: boolean
  hide?: () => void
}>

export const Modal: FunctionComponent<ModalProps> = ({
  children,
  visible,
  hide,
}) => (
  <div
    className={classNames(
      "flex flex-col justify-end items-stretch absolute bg-dark/90 top-0 right-0 bottom-0 left-0 overflow-y-auto transition z-30",
      {
        "cursor-pointer": hide,

        "opacity-0 pointer-events-none": !visible,
        "opacity-100": visible,
      }
    )}
    onClick={hide ? (e) => e.target === e.currentTarget && hide() : undefined}
  >
    <div className="flex flex-col justify-start items-stretch relative max-h-[90vh] overflow-y-auto cursor-auto bg-dark py-10">
      {children}

      {!!hide && (
        <button
          onClick={() => hide()}
          className="mt-14 opacity-80 hover:opacity-60 active:opacity-60"
        >
          Close
        </button>
      )}
    </div>
  </div>
)
