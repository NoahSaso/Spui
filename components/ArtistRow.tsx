import { FunctionComponent } from "react"
import { IoChatbubbleOutline, IoCopyOutline } from "react-icons/io5"
import { toast } from "react-toastify"

import { ClickableRow } from "@/components"
import { Artist } from "@/types"

interface ArtistRowProps {
  artist: Artist
}

export const ArtistRow: FunctionComponent<ArtistRowProps> = ({
  artist: {
    id,
    href,
    name,
    images,
    external_urls: { spotify },
  },
}) => (
  <ClickableRow
    title={name}
    path={`/artist/${id}`}
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
