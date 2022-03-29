import classNames from "classnames"
import Link from "next/link"
import { FunctionComponent } from "react"
import { IoChevronBack } from "react-icons/io5"

interface HeaderProps {
  title?: string
  backPath?: string
}

export const Header: FunctionComponent<HeaderProps> = ({ title, backPath }) => (
  <div className="flex flex-row items-center min-h-9 px-3 py-4 bg-card w-full rounded-b-md">
    {!!backPath && (
      <Link href={backPath}>
        <a className="h-full flex flex-row justify-start items-center hover:opacity-70 active:opacity-70 z-10">
          <IoChevronBack size="2rem" />
        </a>
      </Link>
    )}
    <h1
      className={classNames({
        // Vary text size by title length.
        "text-3xl": title && title.length < 26,
        "text-xl": title && title.length >= 26 && title.length < 52,
        "text-base": title && title.length >= 52,

        // Center title if back button displaying.
        "flex-1 -ml-8 px-10 text-center": backPath,
      })}
    >
      {title}
    </h1>
  </div>
)
