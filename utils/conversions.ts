export const uriToId = (uri: string): string | undefined =>
  uri.match(/:([^:]+)$/)?.[1]

export const msToSec = (milliseconds: number): number =>
  Math.floor(milliseconds / 1000)

// Convert seconds to m:ss format. Ignores sign.
// Example: 185 --> 3:05
export const secToTimeString = (seconds: number): string => {
  const mins = Math.floor(Math.abs(seconds) / 60)
  const secs = Math.abs(seconds) % 60
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`
}

export const uriToDeepLink = (uri: string): string =>
  uri.replaceAll(":", "/").replace("spotify/", "spotify://")
