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
export const redirectUri = "http://localhost:3000/callback"
export const codeChallengeMethod = "S256"
// Local Storage Keys
export const localStorageStateKey = "state"
export const localStorageCodeVerifierKey = "codeVerifier"
