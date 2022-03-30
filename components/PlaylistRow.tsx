import { FunctionComponent } from "react"
import { IoChatbubbleOutline, IoCopyOutline } from "react-icons/io5"
import { toast } from "react-toastify"
import { useRecoilValueLoadable } from "recoil"

import { ClickableRow, Loader } from "@/components"
import { getPlaylist } from "@/state"
import { Playlist } from "@/types"

interface PlaylistRowProps {
  id: string
  _playlist?: Playlist
}

export const PlaylistRow: FunctionComponent<PlaylistRowProps> = ({
  id,
  _playlist,
}) => {
  const loadable = useRecoilValueLoadable(getPlaylist(_playlist ? "" : id))
  const playlist = loadable.state === "hasValue" ? loadable.contents : undefined

  if (!playlist && !_playlist)
    return (
      <div className="flex flex-row justify-center items-center h-row">
        <Loader size={32} />
      </div>
    )

  const {
    name,
    images,
    tracks: { total: totalTracks },
    external_urls: { spotify },
  } = playlist ?? (_playlist as Playlist)

  return (
    <ClickableRow
      title={name}
      subtitle={`${totalTracks} tracks`}
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
