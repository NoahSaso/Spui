import type { NextPage } from "next"
import { SubmitHandler, useForm } from "react-hook-form"
import { useRecoilValue, useSetRecoilState } from "recoil"

import { generateLogin } from "@/services/api/auth"
import { clientIdAtom, getPlaylists, isLoggedInSelector } from "@/state"

interface ConnectForm {
  clientId: string
}

const Home: NextPage = () => {
  const isLoggedIn = useRecoilValue(isLoggedInSelector)
  const setClientId = useSetRecoilState(clientIdAtom)
  const playlists = useRecoilValue(getPlaylists({}))

  const { register, handleSubmit } = useForm<ConnectForm>()

  const onSubmit: SubmitHandler<ConnectForm> = async ({ clientId }) => {
    setClientId(clientId)
    window.location.href = await generateLogin(clientId)
  }

  return (
    <div className="">
      {isLoggedIn ? "Logged in" : "Not logged in"}

      {isLoggedIn ? (
        <>{JSON.stringify(playlists, null, 2)}</>
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
