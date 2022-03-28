import type { NextPage } from "next"
import { SubmitHandler, useForm } from "react-hook-form"
import {
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from "recoil"

import { generateLogin } from "@/services/api/auth"
import { clientIdAtom, getPlaylists, isLoggedInSelector } from "@/state"

interface ConnectForm {
  clientId: string
}

const Home: NextPage = () => {
  const isLoggedIn = useRecoilValue(isLoggedInSelector)
  const setClientId = useSetRecoilState(clientIdAtom)
  const { state: playlistsState, contents: playlists } = useRecoilValueLoadable(
    getPlaylists({})
  )

  const { register, handleSubmit } = useForm<ConnectForm>()

  const onSubmit: SubmitHandler<ConnectForm> = async ({ clientId }) => {
    setClientId(clientId)
    window.location.href = await generateLogin(clientId)
  }

  return (
    <div className="">
      <p>{isLoggedIn ? "Logged in" : "Not logged in"}</p>

      {isLoggedIn ? (
        <>
          <p>
            {playlistsState === "loading"
              ? "Loading playlists..."
              : playlistsState === "hasValue"
              ? "Loaded playlists"
              : "Error loading playlists"}
          </p>
          <pre>{JSON.stringify(playlists, null, 2)}</pre>
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              placeholder="Client ID"
              {...register("clientId", { required: true })}
            />

            <input type="submit" value="Connect to Spotify" />
          </form>
        </>
      )}
    </div>
  )
}

export default Home
