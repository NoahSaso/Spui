import type { NextPage } from "next"
import { useEffect, useState } from "react"

import { ErrorBoundary, Header, SearchResults } from "@/components"
import { useRequireAuthentication } from "@/hooks"

const SearchPage: NextPage = () => {
  useRequireAuthentication()

  const [input, setInput] = useState("")
  const [activeSearch, setActiveSearch] = useState("")

  // Debounce input.
  useEffect(() => {
    const updateActiveSearch = () => setActiveSearch(input)
    const timeout = setTimeout(updateActiveSearch, 300)
    return () => clearTimeout(timeout)
  }, [input])

  return (
    <>
      <Header showBack={false}>
        <input
          type="text"
          placeholder="Search..."
          className="w-full h-full bg-[transparent] outline-none"
          onInput={(e) => setInput((e.target as HTMLInputElement).value)}
          value={input}
        />
      </Header>

      <div className="flex-1 overflow-y-auto visible-scrollbar self-stretch">
        <ErrorBoundary>
          <SearchResults search={activeSearch} />
        </ErrorBoundary>
      </div>
    </>
  )
}

export default SearchPage
