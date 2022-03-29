import type { NextPage } from "next"
import { SubmitHandler, useForm } from "react-hook-form"
import { useSetRecoilState } from "recoil"

import { useRequireAuthentication } from "@/hooks"
import { generateLogin } from "@/services/api/auth"
import { clientIdAtom } from "@/state"

interface ConnectForm {
  clientId: string
}

const Home: NextPage = () => {
  // Redirect to playlists if already logged in.
  useRequireAuthentication(false, "/playlists")

  const setClientId = useSetRecoilState(clientIdAtom)

  const { register, handleSubmit } = useForm<ConnectForm>()

  const onSubmit: SubmitHandler<ConnectForm> = async ({ clientId }) => {
    setClientId(clientId)
    window.location.href = await generateLogin(clientId)
  }

  return (
    <div className="flex items-center justify-center w-full max-w-sm px-10 h-[100vh] mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-stretch gap-2 text-dark w-full"
      >
        <input
          type="text"
          placeholder="Client ID"
          className="py-2 px-4 rounded-full"
          {...register("clientId", { required: true })}
        />

        <input
          type="submit"
          value="Connect to Spotify"
          className="bg-spotify rounded-full py-2 px-4 cursor-pointer hover:opacity-80 transition"
        />
      </form>
    </div>
  )
}

export default Home
