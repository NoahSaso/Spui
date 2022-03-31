import { useInfiniteQuery, useQuery } from "react-query"

import { Search } from "@/services/api"
import { ApiError } from "@/services/api/common"
import { Type } from "@/types"

// Fetch 1 result to probe total results for each type.
export const useProbeSearchResults = (
  accessToken: string | null,
  search: string
) =>
  useQuery<Search.SearchResponse | undefined, ApiError>(
    ["search", "probe", search],
    () =>
      accessToken && search ? Search.get(accessToken, search, 1) : undefined
  )

export const useInfiniteTypedSearchResults = <T extends Type>(
  accessToken: string | null,
  search: string,
  type: T,
  pageSize: number
) =>
  useInfiniteQuery<
    Search.SearchResponse[`${typeof type}s`] | undefined,
    ApiError
  >(
    ["search", "infinite", type, search],
    async ({ pageParam = 1 }) => {
      if (!accessToken) return undefined

      const response = await Search.get(
        accessToken,
        search,
        pageSize,
        (pageParam - 1) * pageSize,
        [type]
      )
      return response?.[`${type}s`]
    },
    {
      getNextPageParam: (lastPage) =>
        // If no next parameter, no more.
        !lastPage?.next
          ? undefined
          : Math.floor((lastPage?.offset ?? 0) / pageSize) + 1 + 1,
    }
  )
