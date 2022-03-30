import classNames from "classnames"
import { FunctionComponent } from "react"

import { Image } from "@/types"

interface LargeImageProps {
  images: Image[]
  alt?: string
  className?: string
}

export const LargeImage: FunctionComponent<LargeImageProps> = ({
  images,
  alt,
  className,
}) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={images[0].url}
    alt={alt || "cover art"}
    className={classNames("w-2/3 aspect-square object-cover", className)}
  />
)
