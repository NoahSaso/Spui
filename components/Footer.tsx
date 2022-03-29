import classNames from "classnames"
import Link from "next/link"
import { useRouter } from "next/router"
import { FunctionComponent } from "react"
import { IconType } from "react-icons"
import { CgPlayList } from "react-icons/cg"
import { IoSearch } from "react-icons/io5"
import { MdAccountCircle } from "react-icons/md"
import { useRecoilValue, useRecoilState } from "recoil"

import { isLoggedInSelector } from "@/state"
import { colors } from "@/theme"

export const Footer = () => {
  const { pathname } = useRouter()
  const rootPath = "/" + pathname.split("/")[1]

  const isLoggedIn = useRecoilValue(isLoggedInSelector)

  return (
    <div className="h-footer bg-card flex flex-row justify-center items-stretch z-10 flex-none sm:rounded-t-md sm:overflow-hidden">
      {(!!isLoggedIn ? authTabs : unauthTabs).map((tab) => (
        <Tab
          key={tab.label}
          data={tab}
          isActive={
            tab.startsWith
              ? rootPath.startsWith(tab.startsWith)
              : rootPath === tab.href
          }
        />
      ))}
    </div>
  )
}

interface TabData {
  label: string
  Icon: IconType
  href: string
  startsWith?: string
}

const unauthTabs: TabData[] = [
  {
    label: "Connect",
    Icon: MdAccountCircle,
    href: "/",
    startsWith: "/",
  },
]

const authTabs: TabData[] = [
  {
    label: "Search",
    Icon: IoSearch,
    href: "/search",
  },
  {
    label: "Playlists",
    Icon: CgPlayList,
    href: "/playlists",
    startsWith: "/playlist",
  },
]

interface TabProps {
  data: TabData
  isActive: boolean
}

const Tab: FunctionComponent<TabProps> = ({
  data: { label, Icon, href },
  isActive,
}) => (
  <Link href={href}>
    <a
      className={classNames(
        "flex-1 flex flex-col justify-center items-center",
        {
          "opacity-40": !isActive,
          "opacity-100": isActive,
        }
      )}
    >
      <Icon color={colors.light} size={26} />
      <p className="text-xs">{label}</p>
    </a>
  </Link>
)
