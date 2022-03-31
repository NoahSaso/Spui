import { FunctionComponent, Suspense } from "react"
import { IoChatbubbleOutline, IoCopyOutline } from "react-icons/io5"
import { toast } from "react-toastify"
import { useRecoilValue } from "recoil"

import { ClickableRow, LoaderRow } from "@/components"
import { getPlaylist } from "@/state"
import { Playlist } from "@/types"

interface PlaylistRowProps {
  id: string
  _playlist?: Playlist
}

export const PlaylistRow: FunctionComponent<PlaylistRowProps> = (props) => (
  <Suspense fallback={<LoaderRow />}>
    <_PlaylistRow {...props} />
  </Suspense>
)

export const _PlaylistRow: FunctionComponent<PlaylistRowProps> = ({
  id,
  _playlist,
}) => {
  const playlist = useRecoilValue(getPlaylist(_playlist ? "" : id))

  if (!playlist && !_playlist) return null

  const {
    name,
    images,
    tracks: { total: totalTracks },
    external_urls: { spotify },
  } = playlist ?? (_playlist as Playlist)

  return (
    <ClickableRow
      title={name}
      subtitle={`${totalTracks} track${totalTracks === 1 ? "" : "s"}`}
      path={`/playlist/${id}`}
      images={images}
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
      ]}
    />
  )
}
