export const pathForItemWithUri = ({
  type,
  uri,
}: {
  type: string
  uri: string
}): string => `/${type}/${uri.match(/:([^:]+)$/)?.[1]}`
