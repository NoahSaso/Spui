import { selectorFamily } from "recoil"

import { Search } from "@/services/api"
import { validAccessTokenOrNull } from "@/state"

export const getSearchResults = selectorFamily<
  Search.SearchResponse | undefined,
  string
>({
  key: "getSearchResults",
  get:
    (search) =>
    async ({ get }) => {
      if (!search) return

      const accessToken = get(validAccessTokenOrNull)
      if (!accessToken) return

      return await Search.get(accessToken, search)
    },
})
