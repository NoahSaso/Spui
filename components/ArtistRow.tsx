import { FunctionComponent } from "react"
import { IoChatbubbleOutline, IoCopyOutline } from "react-icons/io5"
import { toast } from "react-toastify"
import { useRecoilValue } from "recoil"

import { ClickableRow, LoaderRow } from "@/components"
import { useArtist, validAccessTokenOrNull } from "@/state"
import { Artist } from "@/types"

interface ArtistRowProps {
  id: string
  _artist?: Artist
}

export const ArtistRow: FunctionComponent<ArtistRowProps> = ({
  id,
  _artist,
}) => {
  const accessToken = useRecoilValue(validAccessTokenOrNull)
  const { data: artist, isLoading } = useArtist(accessToken, _artist ? "" : id)

  // If _artist passed, just use that instead and don't show loader.
  if (isLoading && !_artist) return <LoaderRow />

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
