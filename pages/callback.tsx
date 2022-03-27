import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { localStorageStateKey } from "@/config"
import { useFetchInitialAccessToken } from "@/hooks"

const Callback: NextPage = () => {
  const { query, isReady, push: routerPush } = useRouter()
  const { fetchInitialAccessToken, error: fetchError } =
    useFetchInitialAccessToken()
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (!isReady) return
    const { state, code, error } = query

    if (
      typeof state !== "string" ||
      // Only one of code and error will be present.
      (typeof code !== "string" && typeof error !== "string")
    ) {
      console.error("Invalid params", query)
      setError("Invalid params. See console for more details.")
      return
    }

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
      fetchInitialAccessToken(code)
    } else {
      setError("Unexpected response :(")
    }
  }, [query, isReady, routerPush, fetchInitialAccessToken, setError])

  return <div className="">{error || fetchError || "Loading..."}</div>
}

export default Callback
