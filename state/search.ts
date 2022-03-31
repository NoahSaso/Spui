import { useQuery } from "react-query"

import { Search } from "@/services/api"
import { ApiError } from "@/services/api/common"

export const useSearchResults = (accessToken: string | null, search: string) =>
  useQuery<Search.SearchResponse | undefined, ApiError>(
    ["search", search],
    () => (accessToken && search ? Search.get(accessToken, search) : undefined)
  )
