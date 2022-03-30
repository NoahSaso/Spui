import { ReactNode, useState } from "react"
import { IoChevronBack, IoChevronDown } from "react-icons/io5"

import { ClickableRow } from "@/components"

interface SearchCategoryProps<T> {
  title: string
  items: T[]
  render: (item: T) => ReactNode
}

export const SearchCategory = <T extends unknown>({
  title,
  items,
  render,
}: SearchCategoryProps<T>) => {
  const [open, setOpen] = useState(false)

  if (!items.length) return null

  const RightIcon = open ? IoChevronDown : IoChevronBack

  return (
    <>
      <ClickableRow
        title={title}
        subtitle={`${items.length} found`}
        onClick={() => setOpen(!open)}
        rightNode={
          <div className="h-full aspect-square flex flex-row justify-center items-center p-3">
            <RightIcon
              size={22}
              className="h-full flex justify-center items-center"
            />
          </div>
        }
      />

      {open && items.map(render)}
    </>
  )
}
