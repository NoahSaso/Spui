import { FunctionComponent } from "react"
import { IoChatbubbleOutline, IoCopyOutline } from "react-icons/io5"
import { toast } from "react-toastify"
import { useRecoilValueLoadable } from "recoil"

import { ClickableRow, Loader } from "@/components"
import { getArtist } from "@/state"
import { Artist } from "@/types"

interface ArtistRowProps {
  id: string
  _artist?: Artist
}

export const ArtistRow: FunctionComponent<ArtistRowProps> = ({
  id,
  _artist,
}) => {
  const loadable = useRecoilValueLoadable(getArtist(_artist ? "" : id))
  const artist = loadable.state === "hasValue" ? loadable.contents : undefined

  if (!artist && !_artist) return <Loader size={32} />

  const {
    name,
    images,
    external_urls: { spotify },
  } = artist ?? (_artist as Artist)

  return (
    <ClickableRow
      title={name}
      path={`/artist/${id}`}
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
