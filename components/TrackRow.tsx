import { FunctionComponent } from "react"
import { IoChatbubbleOutline, IoCopyOutline } from "react-icons/io5"
import { toast } from "react-toastify"
import { useRecoilValue } from "recoil"
import { validAccessTokenOrNull } from "state/auth"

import { ClickableRow } from "@/components"
import { DevicePicker } from "@/services"
import { ApiError, KnownError } from "@/services/api/common"
import { addToQueue } from "@/services/api/tracks"
import { Track } from "@/types"

interface TrackRow {
  track: Track
}

export const TrackRow: FunctionComponent<TrackRow> = ({
  track: {
    uri,
    href,
    name,
    artists,
    album: { images },
    external_urls: { spotify },
  },
}) => {
  const accessToken = useRecoilValue(validAccessTokenOrNull)
  const onClick = async () => {
    if (!accessToken) return

    // Detect no device error and prompt for selection if possible.
    // Otherwise just error normally.
    try {
      await toast.promise(addToQueue(accessToken, uri), {
        pending: "Adding to queue...",
        success: "Added to queue 👍",
      })
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.data.known === KnownError.NoActiveDevice
      ) {
        DevicePicker.pickDevice(({ id, name }) =>
          toast.promise(addToQueue(accessToken, uri, id), {
            pending: `Adding to queue on ${name}...`,
            success: `Added to queue on ${name} 👍`,
            error: `Failed to add to queue on ${name} 👎`,
          })
        )
      } else {
        toast.error("Failed to add to queue 👎")
      }
    }
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
