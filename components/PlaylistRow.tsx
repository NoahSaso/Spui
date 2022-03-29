import { FunctionComponent } from "react"

import { Playlist } from "@/types"

interface PlaylistRowProps {
  playlist: Playlist
}

export const PlaylistRow: FunctionComponent<PlaylistRowProps> = ({
  playlist: { name },
}) => {
  return (
    <div className="">
      <p>{name}</p>
    </div>
  )
}
