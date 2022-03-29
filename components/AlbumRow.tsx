import { FunctionComponent } from "react"
import { IoChatbubbleOutline, IoCopyOutline } from "react-icons/io5"
import { toast } from "react-toastify"

import { ClickableRow } from "@/components"
import { Album } from "@/types"

interface AlbumRowProps {
  album: Album
}

export const AlbumRow: FunctionComponent<AlbumRowProps> = ({
  album: {
    id,
    href,
    name,
    images,
    total_tracks,
    external_urls: { spotify },
  },
}) => (
  <ClickableRow
    title={name}
    subtitle={`${total_tracks} tracks`}
    path={`/album/${id}`}
    images={images}
    options={[
      {
        icon: <IoChatbubbleOutline size={20} />,
        label: "Share via SMS",
        href: `sms:?body=${encodeURIComponent(href)}`,
      },
      {
        icon: <IoCopyOutline size={20} />,
        label: "Copy to clipboard",
        onClick: () => {
          navigator.clipboard.writeText(spotify)
          toast.success("Copied to clipboard 📋")
        },
      },
    ]}
  />
)
