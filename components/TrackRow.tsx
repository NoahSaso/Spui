import { FunctionComponent } from "react"
import { FiDisc } from "react-icons/fi"
import { IoChatbubbleOutline, IoCopyOutline, IoPerson } from "react-icons/io5"
import { toast } from "react-toastify"
import { useRecoilValue } from "recoil"

import { ClickableRow } from "@/components"
import { useCurrentPlayback } from "@/hooks"
import { DevicePicker } from "@/services"
import { Player } from "@/services/api"
import { ApiError, KnownError } from "@/services/api/common"
import { validAccessTokenOrNull } from "@/state"
import { colors } from "@/theme"
import { Track } from "@/types"

interface TrackRow {
  _track: Track
}

// TODO: Allow to take `id` like the rest of the rows.
export const TrackRow: FunctionComponent<TrackRow> = ({
  _track: {
    id,
    uri,
    name,
    artists,
    album: { id: albumId, name: albumName, images },
    external_urls: { spotify },
  },
}) => {
  const accessToken = useRecoilValue(validAccessTokenOrNull)
  const onClick = async () => {
    if (!accessToken) return

    // Detect no device error and prompt for selection if possible.
    // Otherwise just error normally.
    try {
      await toast.promise(Player.addToQueue(accessToken, uri), {
        pending: "Adding to queue...",
        success: "Added to queue 👍",
      })
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.data.known === KnownError.NoActiveDevice
      ) {
        DevicePicker.pickDevice(({ id, name }) =>
          toast.promise(Player.addToQueue(accessToken, uri, id), {
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

  const { currentPlayback } = useCurrentPlayback()

  return (
    <ClickableRow
      title={name}
      subtitle={artists.map((artist) => artist.name).join(" • ")}
      textColor={
        currentPlayback && currentPlayback.item.id === id
          ? colors.spotify
          : undefined
      }
      images={images}
      onClick={onClick}
      options={[
        {
          icon: <IoChatbubbleOutline size={20} />,
          label: "Share via SMS",
          href: `sms:&body=${encodeURIComponent(spotify)}`,
        },
        {
          icon: <IoCopyOutline size={20} />,
          label: "Copy to clipboard",
          onClick: () => {
            navigator.clipboard.writeText(spotify)
            toast.success("Copied to clipboard 📋")
          },
        },
        {
          icon: <FiDisc size={20} />,
          label: `Go to ${albumName}`,
          href: `/album/${albumId}`,
        },
        ...artists.map(({ id, name }) => ({
          icon: <IoPerson size={20} />,
          label: `Go to ${name}`,
          href: `/artist/${id}`,
        })),
      ]}
    />
  )
}
