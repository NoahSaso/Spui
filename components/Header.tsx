import classNames from "classnames"
import { useRouter } from "next/router"
import { FunctionComponent } from "react"
import { IoChevronBack } from "react-icons/io5"

type HeaderProps = {
  title?: string
  showBack?: boolean
  // If passed and no history to go back to, will use this for back button.
  fallbackBackPath?: string
  rightNode?: React.ReactNode
}

export const Header: FunctionComponent<HeaderProps> = ({
  title,
  showBack = true,
  fallbackBackPath,
  rightNode,
  children,
}) => {
  const router = useRouter()
  const hasWindowBack =
    typeof window !== "undefined" && window.history.state.idx > 0
  const canGoBack =
    showBack &&
    (hasWindowBack || (typeof window !== "undefined" && !!fallbackBackPath))

  return (
    <div
      className={classNames(
        "px-3 py-4 flex flex-col justify-start items-start bg-card w-full rounded-b-md flex-none",
        { "min-h-[4.25rem]": title }
      )}
    >
      {/* min-height is largest line-height of text (3xl => 2.25rem) plus vertical padding (4 => 2rem). 2.25rem + 2rem = 4.25rem */}
      {/* This way the header will not change size once text loads. */}
      {(!!title || canGoBack || rightNode) && (
        <div className="w-full grid grid-rows-1 grid-cols-[2rem_1fr_2rem]">
          {canGoBack && (
            <button
              onClick={() =>
                typeof window !== "undefined" && window.history.state.idx > 0
                  ? router.back()
                  : router.push(fallbackBackPath ?? "/")
              }
              className="h-full flex flex-row justify-start items-center hover:opacity-70 active:opacity-70 z-10"
            >
              <IoChevronBack size="2rem" />
            </button>
          )}
          {!!title && (
            <h1
              className={classNames("text-center", {
                // Vary text size by title length.
                "text-3xl": title && title.length < 26,
                "text-xl": title && title.length >= 26 && title.length < 52,
                "text-base": title && title.length >= 52,

                "col-start-2": !canGoBack,
              })}
            >
              {title}
            </h1>
          )}
          {rightNode}
        </div>
      )}

      {children}
    </div>
  )
}
