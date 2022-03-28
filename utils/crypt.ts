export const sha256Base64URLEncoded = async (str: string): Promise<string> => {
  const buffer = new TextEncoder().encode(str)
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
  // https://stackoverflow.com/a/59913241
  // Convert the ArrayBuffer to string using Uint8 array.
  // btoa takes chars from 0-255 and base64 encodes.
  // Then convert the base64 encoded to base64url encoded.
  // (replace + with -, replace / with _, trim trailing =)
  return window
    .btoa(
      String.fromCharCode.apply(null, Array.from(new Uint8Array(hashBuffer)))
    )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}
