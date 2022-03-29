import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useState } from "react"
import { toast } from "react-toastify"
import { useRecoilValueLoadable } from "recoil"

import { DevicesPickerModal, Loader, PlaylistTrackRow } from "@/components"
import { useRequireAuthentication } from "@/hooks"
import { addToQueue } from "@/services/api/tracks"
import { getPlaylistTracks } from "@/state"
import { Device } from "@/types"

const PlaylistPage: NextPage = () => {
  const { accessToken } = useRequireAuthentication()

  const { isReady, query } = useRouter()

  const loadable = useRecoilValueLoadable(
    getPlaylistTracks(
      isReady && typeof query.playlistId === "string" ? query.playlistId : ""
    )
  )
  const tracks = loadable.state === "hasValue" ? loadable.contents : undefined
  const tracksError =
    loadable.state === "hasError" ? loadable.contents.message : undefined

  const [trackUriPendingDeviceSelection, setTrackUriPendingDeviceSelection] =
    useState<string>()

  const playAfterDeviceSelection = (uri: string) => {
    setTrackUriPendingDeviceSelection(uri)
  }

  const onPickDeviceAndPlay = async (device: Device) => {
    const uri = trackUriPendingDeviceSelection
    setTrackUriPendingDeviceSelection(undefined)

    if (!accessToken || !uri) return

    await toast.promise(addToQueue(accessToken, uri, device.id), {
      pending: `Adding to queue on ${device.name}...`,
      success: `Added to queue on ${device.name} 👍`,
      error: `Failed to add to queue on ${device.name} 👎`,
    })
  }

  return (
    <>
      {loadable.state === "loading" ? (
        <Loader expand />
      ) : loadable.state === "hasError" ? (
        <p>{tracksError}</p>
      ) : null}

      <div>
        {tracks?.map((track) => (
          <PlaylistTrackRow
            key={track.track.id}
            track={track}
            playAfterDeviceSelection={playAfterDeviceSelection}
          />
        ))}
      </div>

      <DevicesPickerModal
        visible={!!trackUriPendingDeviceSelection}
        hide={() => setTrackUriPendingDeviceSelection(undefined)}
        isSelected={({ is_active }) => is_active}
        onPick={onPickDeviceAndPlay}
      />
    </>
  )
}

export default PlaylistPage
