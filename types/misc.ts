export type Action =
  | {
      onClick: () => void
      path?: never
      href?: never
    }
  | {
      onClick?: never
      path: string
      href?: never
    }
  | {
      onClick?: never
      path?: never
      href: string
    }
