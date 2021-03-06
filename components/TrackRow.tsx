import { FunctionComponent, useCallback } from "react"
import { FiDisc } from "react-icons/fi"
import { IoChatbubbleOutline, IoCopyOutline, IoPerson } from "react-icons/io5"
import { toast } from "react-toastify"
import { useRecoilValue } from "recoil"

import { ClickableRow } from "@/components"
import { DevicePicker } from "@/services"
import { Player } from "@/services/api"
import { ApiError, KnownError } from "@/services/api/common"
import { useCurrentPlayback, validAccessTokenOrNull } from "@/state"
import { colors } from "@/theme"
import { Track } from "@/types"
import { uriToDeepLink } from "@/utils"

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
    album: { id: albumId, name: albumName, images } = {},
    external_urls: { spotify },
  },
}) => {
  const accessToken = useRecoilValue(validAccessTokenOrNull)
  const onClick = useCallback(async () => {
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
        DevicePicker.pickDevice(uriToDeepLink(uri), (event) => {
          if (event.openedFallbackUri) {
            toast.success("Opening...")
          } else {
            toast.promise(
              Player.addToQueue(accessToken, uri, event.device.id),
              {
                pending: `Adding to queue on ${event.device.name}...`,
                success: `Added to queue on ${event.device.name} 👍`,
                error: `Failed to add to queue on ${event.device.name} 👎`,
              }
            )
          }
        })
      } else {
        toast.error("Failed to add to queue 👎")
      }
    }
  }, [accessToken, uri])

  const { data: currentPlayback } = useCurrentPlayback(accessToken)

  return (
    <ClickableRow
      title={name}
      subtitle={artists.map((artist) => artist.name).join(" • ")}
      textColor={
        // TODO: Add some animation to indicate current playback instead of just color.
        currentPlayback && currentPlayback.item?.id === id
          ? colors.spuiOrange
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
        ...(albumId
          ? [
              {
                icon: <FiDisc size={20} />,
                label: `Go to ${albumName}`,
                path: `/album/${albumId}`,
              },
            ]
          : []),
        ...artists.map(({ id, name }) => ({
          icon: <IoPerson size={20} />,
          label: `Go to ${name}`,
          path: `/artist/${id}`,
        })),
      ]}
    />
  )
}
