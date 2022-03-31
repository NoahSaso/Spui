import { FunctionComponent, Suspense } from "react"
import { IoChatbubbleOutline, IoCopyOutline } from "react-icons/io5"
import { toast } from "react-toastify"
import { useRecoilValue } from "recoil"

import { ClickableRow, LoaderRow } from "@/components"
import { getArtist } from "@/state"
import { Artist } from "@/types"

interface ArtistRowProps {
  id: string
  _artist?: Artist
}

export const ArtistRow: FunctionComponent<ArtistRowProps> = (props) => (
  <Suspense fallback={<LoaderRow />}>
    <_ArtistRow {...props} />
  </Suspense>
)

export const _ArtistRow: FunctionComponent<ArtistRowProps> = ({
  id,
  _artist,
}) => {
  const artist = useRecoilValue(getArtist(_artist ? "" : id))

  if (!artist && !_artist) return null

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
