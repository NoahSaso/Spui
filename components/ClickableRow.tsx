/* eslint-disable @next/next/no-img-element */
import classNames from "classnames"
import Link from "next/link"
import { FunctionComponent, ReactNode, useState } from "react"
import { IoEllipsisHorizontal } from "react-icons/io5"

import { Modal } from "@/components"
import { Action, Image } from "@/types"

type Option = {
  icon: ReactNode
  label: string
} & Action

const optionClassName =
  "w-full flex flex-row justify-start items-center gap-3 cursor-pointer hover:opacity-70 active:opacity-70 transition"

interface OptionProps {
  option: Option
}
const Option: FunctionComponent<OptionProps> = ({
  option: { icon, label, onClick, path, href },
}) => {
  const contained = (
    <>
      {icon}
      {label}
    </>
  )

  return onClick ? (
    <div
      className={optionClassName}
      onClick={(e) => {
        e.preventDefault()
        onClick()
      }}
    >
      {contained}
    </div>
  ) : path ? (
    <Link href={path}>
      <a
        className={optionClassName}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        {contained}
      </a>
    </Link>
  ) : href ? (
    <a
      className={optionClassName}
      href={href}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      {contained}
    </a>
  ) : null
}

type ClickableRowProps = {
  title: string
  subtitle?: string
  className?: string
  images?: Image[]
  options?: Option[]
} & Action

const containerClassName =
  "w-full h-[4.5rem] p-3 cursor-pointer hover:bg-hover active:bg-hover w-full flex flex-row justify-start items-stretch gap-4"

// Pass onClick to make it a clickable div, and path to make it a local Next Link.
export const ClickableRow: FunctionComponent<ClickableRowProps> = ({
  title,
  subtitle,
  className,
  images,
  options,
  onClick,
  path,
  href,
}) => {
  const [modalVisible, setModalVisible] = useState(false)

  const largeImageUrl = images?.[0].url
  // Last image in images list is smallest.
  const smallImageUrl = images?.slice(-1)[0].url

  const contained = (
    <>
      {smallImageUrl && (
        <img
          src={smallImageUrl}
          alt="art"
          className="object-cover h-full aspect-square"
        />
      )}
      <div className="flex-1 flex flex-col justify-center items-start overflow-hidden">
        <p className="w-full truncate">{title}</p>
        {!!subtitle && (
          <p className="text-placeholder text-sm w-full truncate">{subtitle}</p>
        )}
      </div>
      {!!options?.length && (
        <>
          <div
            className="h-full aspect-square flex justify-center items-center hover:opacity-70 active:opacity-70"
            onClick={(e) => {
              // Don't click on parent row.
              e.stopPropagation()
              setModalVisible(true)
            }}
          >
            <IoEllipsisHorizontal size={22} />
          </div>

          <Modal visible={modalVisible} hide={() => setModalVisible(false)}>
            {!!largeImageUrl && (
              <img
                src={largeImageUrl}
                alt="art"
                className="object-cover w-2/5 h-auto mb-4 self-center"
              />
            )}

            <div className="w-3/5 self-center">
              <p className="text-center mb-10">{title}</p>
              {!!subtitle && (
                <p className="text-center text-placeholder text-sm -mt-9 mb-10">
                  {subtitle}
                </p>
              )}

              <div className="flex flex-col gap-4">
                {options.map((option) => (
                  <Option option={option} key={option.label} />
                ))}
              </div>
            </div>
          </Modal>
        </>
      )}
    </>
  )

  return onClick ? (
    <div
      className={classNames(containerClassName, className)}
      onClick={onClick}
    >
      {contained}
    </div>
  ) : path ? (
    <Link href={path}>
      <a className={classNames(containerClassName, className)}>{contained}</a>
    </Link>
  ) : href ? (
    <a href={href} className={classNames(containerClassName, className)}>
      {contained}
    </a>
  ) : null
}
