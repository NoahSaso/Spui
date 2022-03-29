import { FunctionComponent } from "react"

import { PlaylistTrack } from "@/types"

interface PlaylistTrackRowProps {
  track: PlaylistTrack
}

export const PlaylistTrackRow: FunctionComponent<PlaylistTrackRowProps> = ({
  track: {
    track: { name },
  },
}) => {
  return (
    <div className="">
      <p>{name}</p>
    </div>
  )
}
