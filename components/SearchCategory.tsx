import { ReactNode } from "react"
import { IoChevronBack, IoChevronDown } from "react-icons/io5"
import InfiniteScroll from "react-infinite-scroll-component"
import { useRecoilValue } from "recoil"

import { ClickableRow, LoaderRow } from "@/components"
import { useWindowDimensions } from "@/hooks"
import { ListResponse } from "@/services/api/common"
import { useInfiniteTypedSearchResults, validAccessTokenOrNull } from "@/state"
import { Type } from "@/types"

interface SearchCategoryProps<T> {
  title: string
  type: Type
  search: string
  total: number
  render: (item: T) => ReactNode
  open: boolean
  toggle: () => void
}

export const SearchCategory = <T extends any>({
  title,
  type,
  search,
  total,
  render,
  open,
  toggle,
}: SearchCategoryProps<T>) => {
  const accessToken = useRecoilValue(validAccessTokenOrNull)

  const { height } = useWindowDimensions()
  // Roughly the amount that will show on one page.
  // 4.5rem (row height) is 72px
  const pageSize = Math.ceil(height / 72) || 20

  const { data, error, isError, fetchNextPage, hasNextPage } =
    useInfiniteTypedSearchResults(accessToken, search, type, pageSize)
  const items = (
    (data?.pages.filter(Boolean) as ListResponse<T>[]) ?? []
  ).flatMap(({ items }) => items)

  const RightIcon = open ? IoChevronDown : IoChevronBack

  return (
    <>
      <ClickableRow
        title={title}
        subtitle={`${total.toLocaleString()} found`}
        onClick={toggle}
        rightNode={
          <div className="h-full aspect-square flex flex-row justify-center items-center">
            <RightIcon
              size={22}
              className="h-full flex justify-center items-center"
            />
          </div>
        }
      />

      {open && (
        <>
          {isError && !!error && <p>{error.message}</p>}
          <InfiniteScroll
            dataLength={items.length}
            next={fetchNextPage}
            hasMore={hasNextPage ?? true}
            loader={<LoaderRow />}
            scrollThreshold={0.6}
            scrollableTarget="scrollable-container"
          >
            {items.map(render)}
          </InfiniteScroll>
        </>
      )}
    </>
  )
}
