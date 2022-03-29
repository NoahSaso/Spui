import { useRouter } from "next/router"
import { useEffect } from "react"
import { useRecoilValue } from "recoil"

import { isLoggedInSelector } from "@/state"

export const useRequireAuthentication = (
  shouldBeLoggedIn = true,
  redirect = "/"
) => {
  const router = useRouter()
  const isLoggedIn = useRecoilValue(isLoggedInSelector)

  useEffect(() => {
    if (router.isReady && isLoggedIn !== shouldBeLoggedIn) router.push(redirect)
  }, [router, isLoggedIn, shouldBeLoggedIn, redirect])
}
