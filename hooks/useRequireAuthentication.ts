import { useRouter } from "next/router"
import { useEffect } from "react"
import { useRecoilValue } from "recoil"

import { isLoggedInSelector, validAccessTokenOrNull } from "@/state"

export const useRequireAuthentication = (
  shouldBeLoggedIn = true,
  redirect = "/"
) => {
  const router = useRouter()
  const accessToken = useRecoilValue(validAccessTokenOrNull)
  const isLoggedIn = useRecoilValue(isLoggedInSelector)

  useEffect(() => {
    if (router.isReady && isLoggedIn !== shouldBeLoggedIn) router.push(redirect)
  }, [router, isLoggedIn, shouldBeLoggedIn, redirect])

  return { accessToken }
}
