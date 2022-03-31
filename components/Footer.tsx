import classNames from "classnames"
import Link from "next/link"
import { useRouter } from "next/router"
import {
  ComponentType,
  FunctionComponent,
  PropsWithChildren,
  useEffect,
} from "react"
import { IconType } from "react-icons"
import { CgLoadbarSound, CgPlayList } from "react-icons/cg"
import { IoSearch } from "react-icons/io5"
import { MdAccountCircle } from "react-icons/md"
import { useRecoilValue } from "recoil"

import { Loader } from "@/components"
import { useCurrentPlayback } from "@/hooks"
import { isLoggedInSelector } from "@/state"
import { colors } from "@/theme"

export const Footer = () => {
  const { pathname } = useRouter()
  const rootPath = "/" + pathname.split("/")[1]

  const isLoggedIn = useRecoilValue(isLoggedInSelector)

  return (
    <div className="h-footer bg-card flex flex-row justify-center items-stretch z-10 flex-none sm:rounded-t-md sm:overflow-hidden">
      {(!!isLoggedIn ? authTabs : unauthTabs).map((tab) => {
        const TabComponent = tab.TabComponent ?? Tab
        return (
          <TabComponent
            key={tab.label}
            data={tab}
            isActive={
              tab.startsWith
                ? rootPath.startsWith(tab.startsWith)
                : rootPath === tab.href
            }
          />
        )
      })}
    </div>
  )
}

type TabProps = PropsWithChildren<{
  data: TabData
  isActive: boolean
}>

interface TabData {
  href: string
  label?: string
  Icon?: IconType
  startsWith?: string
  TabComponent?: ComponentType<TabProps>
}

const Tab: FunctionComponent<TabProps> = ({
  data: { label, Icon, href },
  isActive,
  children,
}) => (
  <Link href={href} prefetch={false}>
    <a
      className={classNames(
        "flex-1 flex flex-col justify-center items-center",
        {
          "opacity-40": !isActive,
          "opacity-100": isActive,
        }
      )}
    >
      {Icon && <Icon color={colors.light} size={38} />}
      {children}
      {!!label && <p className="text-xs">{label}</p>}
    </a>
  </Link>
)

const NowPlayingTab: FunctionComponent<TabProps> = (props) => {
  const { currentPlayback, updateCurrentPlayback } = useCurrentPlayback()

  // Refresh playback every 5 seconds.
  useEffect(() => {
    const interval = setInterval(() => updateCurrentPlayback(), 1000 * 5)
    // Refresh immediately.
    updateCurrentPlayback()

    return () => clearInterval(interval)
  }, [updateCurrentPlayback])

  if (currentPlayback === undefined) {
    return (
      <Tab {...props} data={{ ...props.data, Icon: undefined }}>
        <Loader size={38} />
      </Tab>
    )
  }

  if (!currentPlayback) return <Tab {...props} />

  return (
    // If something is playing, set isActive to true so we don't dim it.
    <Tab data={{ href: props.data.href }} isActive>
      {currentPlayback.item.album.images.length > 0 ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentPlayback.item.album.images.slice(-1)[0]?.url}
          alt="art"
          className="w-[34px] h-[34px] object-cover"
        />
      ) : (
        <CgLoadbarSound color={colors.light} size={38} />
      )}
      <p className="text-xs text-spotify mt-2">{currentPlayback.device.name}</p>
    </Tab>
  )
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
  {
    label: "Now Playing",
    Icon: CgLoadbarSound,
    href: "/now",
    TabComponent: NowPlayingTab,
  },
]
