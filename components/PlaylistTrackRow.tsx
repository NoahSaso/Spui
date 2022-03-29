import { FunctionComponent } from "react"
import { IoChatbubbleOutline, IoCopyOutline } from "react-icons/io5"
import { toast } from "react-toastify"
import { useRecoilValue } from "recoil"
import { validAccessTokenOrNull } from "state/auth"

import { ClickableRow } from "@/components"
import { addToQueue } from "@/services/api/tracks"
import { PlaylistTrack } from "@/types"

interface PlaylistTrackRowProps {
  track: PlaylistTrack
}

export const PlaylistTrackRow: FunctionComponent<PlaylistTrackRowProps> = ({
  track: {
    track: {
      uri,
      href,
      name,
      artists,
      album: { images },
      external_urls: { spotify },
    },
  },
}) => {
  const accessToken = useRecoilValue(validAccessTokenOrNull)
  const onClick = () => {
    if (!accessToken) return

    toast.promise(addToQueue(accessToken, uri), {
      pending: "Adding to queue...",
      success: "Added to queue 👍",
      error: "Failed to add to queue 👎",
    })
  }

  return (
    <ClickableRow
      title={name}
      subtitle={artists.map((artist) => artist.name).join(" • ")}
      images={images}
      onClick={onClick}
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
}
