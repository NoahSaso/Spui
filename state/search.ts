import { selectorFamily } from "recoil"

import { Search } from "@/services/api"
import { validAccessTokenOrNull } from "@/state"

export const search = selectorFamily<Search.SearchResponse | undefined, string>(
  {
    key: "search",
    get:
      (search) =>
      async ({ get }) => {
        if (!search) return

        const accessToken = get(validAccessTokenOrNull)
        if (!accessToken) return

        return await Search.get(accessToken, search)
      },
  }
)
