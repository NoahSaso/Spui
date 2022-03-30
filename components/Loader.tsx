import classNames from "classnames"
import { FunctionComponent } from "react"
import PuffLoader from "react-spinners/PuffLoader"

import { colors } from "@/theme"

interface LoaderProps {
  size?: number
  expand?: boolean
}

export const Loader: FunctionComponent<LoaderProps> = ({
  size = 60,
  expand = false,
}) => (
  <div
    className={classNames("flex justify-center items-center", {
      "w-full h-full": expand,
    })}
  >
    <PuffLoader size={size} color={colors.light} />
  </div>
)
