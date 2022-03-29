import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useSetRecoilState } from "recoil"

import { Loader } from "@/components"
import { localStorageStateKey } from "@/config"
import { useFetchInitialAccessToken, useRequireAuthentication } from "@/hooks"
import { generateLogin } from "@/services/api/auth"
import { clientIdAtom } from "@/state"

interface ConnectForm {
  clientId: string
}

const Home: NextPage = () => {
  // Redirect to search if already logged in.
  useRequireAuthentication(false, "/search")

  const setClientId = useSetRecoilState(clientIdAtom)

  const { register, handleSubmit } = useForm<ConnectForm>()

  const onSubmit: SubmitHandler<ConnectForm> = async ({ clientId }) => {
    setClientId(clientId)
    window.location.href = await generateLogin(clientId)
  }

  // Callback authentication
  const { query, isReady, push: routerPush } = useRouter()

  const { fetchInitialAccessToken, error: fetchError } =
    useFetchInitialAccessToken()

  const [authenticating, setAuthenticating] = useState(false)
  const [error, setError] = useState<string>()

  const authenticationError = error || fetchError

  useEffect(() => {
    setAuthenticating(false)
    setError(undefined)

    if (!isReady) return

    const { state, code, error } = query

    // If not callback params, do not try to authenticate yet.
    if (
      typeof state !== "string" ||
      // Only one of code and error will be present.
      (typeof code !== "string" && typeof error !== "string")
    ) {
      return
    }

    const auth = async () => {
      setAuthenticating(true)
      try {
        // Get original state for comparison.
        const originalState = localStorage.getItem(localStorageStateKey)
        if (originalState === null) {
          console.error("Missing state", originalState === null)
          setError("Missing state. See console for more details.")
          return
        }

        if (state !== originalState) {
          console.error("Invalid state", state, originalState)
          setError("Invalid state. See console for more details.")
          return
        }

        if (typeof error === "string") {
          setError(error)
        } else if (typeof code === "string") {
          await fetchInitialAccessToken(code)
        } else {
          setError("Unexpected response :(")
        }
      } finally {
        setAuthenticating(false)
      }
    }
    auth()
  }, [
    query,
    isReady,
    routerPush,
    fetchInitialAccessToken,
    setError,
    setAuthenticating,
  ])

  return (
    <div className="w-full h-full flex justify-center items-center max-w-sm px-10 mx-auto">
      {authenticating ? (
        authenticationError ? (
          <p className="text-red">{authenticationError}</p>
        ) : (
          <Loader expand />
        )
      ) : (
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
            className="bg-spotify rounded-full py-2 px-4 cursor-pointer hover:opacity-70 active:opacity-70 transition"
          />
        </form>
      )}
    </div>
  )
}

export default Home
