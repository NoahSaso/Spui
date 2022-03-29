import { FunctionComponent } from "react"
import { IoChatbubbleOutline, IoCopyOutline } from "react-icons/io5"
import { toast } from "react-toastify"

import { ClickableRow } from "@/components"
import { Playlist } from "@/types"

interface PlaylistRowProps {
  playlist: Playlist
}

export const PlaylistRow: FunctionComponent<PlaylistRowProps> = ({
  playlist: {
    id,
    href,
    name,
    images,
    tracks: { total: totalTracks },
    external_urls: { spotify },
  },
}) => (
  <ClickableRow
    title={name}
    subtitle={`${totalTracks} tracks`}
    path={`/playlist/${id}`}
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
