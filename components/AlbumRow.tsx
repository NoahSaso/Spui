import { FunctionComponent } from "react"
import { IoChatbubbleOutline, IoCopyOutline } from "react-icons/io5"
import { toast } from "react-toastify"
import { useRecoilValueLoadable } from "recoil"

import { ClickableRow, LoaderRow } from "@/components"
import { getAlbum } from "@/state"
import { Album } from "@/types"

interface AlbumRowProps {
  id: string
  _album?: Album
}

export const AlbumRow: FunctionComponent<AlbumRowProps> = ({ id, _album }) => {
  const loadable = useRecoilValueLoadable(getAlbum(_album ? "" : id))
  const album = loadable.state === "hasValue" ? loadable.contents : undefined

  if (!album && !_album) return <LoaderRow />

  const {
    name,
    images,
    total_tracks: totalTracks,
    external_urls: { spotify },
  } = album ?? (_album as Album)

  return (
    <ClickableRow
      title={name}
      subtitle={`${totalTracks} track${totalTracks === 1 ? "" : "s"}`}
      path={`/album/${id}`}
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
