import classNames from "classnames"
import Link from "next/link"
import { useRouter } from "next/router"
import { IconType } from "react-icons"
import { CgPlayList } from "react-icons/cg"
import { IoSearch } from "react-icons/io5"
import { MdAccountCircle } from "react-icons/md"
import { useRecoilValue } from "recoil"

import { isLoggedInSelector } from "@/state"

interface Tab {
  label: string
  icon: {
    inactive: IconType
    active: IconType
  }
  href?: string
  startsWith?: string
}

const authTabs: Tab[] = [
  {
    label: "Search",
    icon: {
      inactive: IoSearch,
      active: IoSearch,
    },
    href: "/search",
  },
  {
    label: "Playlists",
    icon: {
      inactive: CgPlayList,
      active: CgPlayList,
    },
    href: "/playlists",
    startsWith: "/playlist",
  },
]

const unauthTabs: Tab[] = [
  {
    label: "Connect",
    icon: {
      inactive: MdAccountCircle,
      active: MdAccountCircle,
    },
    startsWith: "/",
  },
]

export const Footer = () => {
  const { pathname } = useRouter()
  const rootPath = "/" + pathname.split("/")[1]

  const isLoggedIn = useRecoilValue(isLoggedInSelector)
  const tabs = isLoggedIn ? authTabs : unauthTabs

  return (
    <div className="h-footer bg-card flex flex-row justify-center items-stretch z-10 flex-none sm:rounded-t-md sm:overflow-hidden">
      {tabs.map(({ label, icon: { inactive, active }, href, startsWith }) => {
        const isActive = startsWith
          ? rootPath.startsWith(startsWith)
          : rootPath === href
        const Icon = isActive ? active : inactive

        return (
          <div key={label} className="flex-1 flex justify-center items-center">
            <Link href={href ?? ""}>
              <a
                className={classNames(
                  "flex flex-col justify-center items-center opacity-40",
                  { "opacity-100": isActive }
                )}
              >
                <Icon size={26} />
                <p className="text-xs">{label}</p>
              </a>
            </Link>
          </div>
        )
      })}
    </div>
  )
}
