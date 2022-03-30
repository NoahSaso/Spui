export const uriToId = (uri: string): string | undefined =>
  uri.match(/:([^:]+)$/)?.[1]
