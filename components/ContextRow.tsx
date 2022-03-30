import { FunctionComponent } from "react"

import { AlbumRow, ArtistRow, PlaylistRow } from "@/components"
import { Context, ContextType } from "@/types"
import { uriToId } from "@/utils"

interface ContextRowProps {
  context: Context
}

export const ContextRow: FunctionComponent<ContextRowProps> = ({
  context: { type, uri },
}) => {
  const id = uriToId(uri)
  if (!id) return null

  switch (type) {
    case ContextType.Artist:
      return <ArtistRow id={id} />
    case ContextType.Playlist:
      return <PlaylistRow id={id} />
    case ContextType.Album:
      return <AlbumRow id={id} />
    default:
      return null
  }
}
