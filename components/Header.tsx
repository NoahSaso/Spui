import classNames from "classnames"
import { useRouter } from "next/router"
import { FunctionComponent, PropsWithChildren } from "react"
import { IoChevronBack } from "react-icons/io5"

type HeaderProps = PropsWithChildren<{
  title?: string
  titleCentered?: boolean
  showBack?: boolean
}>

export const Header: FunctionComponent<HeaderProps> = ({
  title,
  titleCentered = true,
  showBack = true,
  children,
}) => {
  const router = useRouter()
  const canGoBack =
    showBack && typeof window !== "undefined" && window.history.state.idx > 0

  return (
    <div
      className={classNames(
        "px-3 py-4 flex flex-col justify-start items-start bg-card w-full rounded-b-md",
        { "min-h-[4.25rem]": title }
      )}
    >
      {/* min-height is largest line-height of text (3xl => 2.25rem) plus vertical padding (4 => 2rem). 2.25rem + 2rem = 4.25rem */}
      {/* This way the header will not change size once text loads. */}
      {(!!title || canGoBack) && (
        <div className="flex flex-row items-center w-full">
          {canGoBack && (
            <button
              onClick={() => router.back()}
              className="h-full flex flex-row justify-start items-center hover:opacity-70 active:opacity-70 z-10"
            >
              <IoChevronBack size="2rem" />
            </button>
          )}
          {!!title && (
            <h1
              className={classNames({
                // Vary text size by title length.
                "text-3xl": title && title.length < 26,
                "text-xl": title && title.length >= 26 && title.length < 52,
                "text-base": title && title.length >= 52,

                // Center title.
                "flex-1 px-10 text-center": titleCentered,
                // Offset if back button present and title centered.
                "-ml-8": canGoBack && titleCentered,
              })}
            >
              {title}
            </h1>
          )}
        </div>
      )}

      {children}
    </div>
  )
}
