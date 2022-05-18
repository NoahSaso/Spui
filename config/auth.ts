export const scope = [
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-private",
  "user-read-email",
  "user-follow-modify",
  "user-follow-read",
  "user-library-modify",
  "user-library-read",
  "streaming",
  "user-read-playback-position",
  "user-top-read",
  "user-read-recently-played",
  "playlist-modify-private",
  "playlist-read-collaborative",
  "playlist-read-private",
  "playlist-modify-public",
].join(" ")
export const stateChars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
export const authChars = stateChars + "_.-~"
export const authLen = 128
export const codeChallengeMethod = "S256"
// Local Storage Keys
export const localStorageStateKey = "state"
export const localStorageCodeVerifierKey = "codeVerifier"

export const defaultClientId = process.env.NEXT_PUBLIC_DEFAULT_CLIENT_ID

const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV
// Use vercel deployment URL by default if on preview or development vercel build. Otherwise (on dev or production vercel, use manually set domain).
const domain =
  vercelEnv && vercelEnv !== "production"
    ? process.env.NEXT_PUBLIC_VERCEL_URL!
    : process.env.NEXT_PUBLIC_DOMAIN!
export const baseUrl = domain.startsWith("http")
  ? domain
  : `http${process.env.NODE_ENV === "development" ? "" : "s"}://${domain}`
export const redirectUri = `${baseUrl}/`
