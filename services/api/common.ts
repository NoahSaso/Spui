import { AccountApiPrefix, ApiPrefix } from "@/config"

export enum KnownError {
  RefreshTokenRevoked = "Refresh token revoked.",
}

const knownErrorMatchMap: Record<
  KnownError,
  { error: string; description: string }
> = {
  [KnownError.RefreshTokenRevoked]: {
    error: "invalid_grant",
    description: "Refresh token revoked",
  },
}
const KnownErrorMatchEntries = Object.entries(knownErrorMatchMap)

const matchKnownError = (
  error: string,
  description: string
): KnownError | undefined => {
  const matched = KnownErrorMatchEntries.find(
    ([_, expected]) =>
      expected.error === error && expected.description === description
  )
  return matched?.[0] as KnownError | undefined
}

export type ApiResponse<D> =
  | {
      success: true
      data: D
    }
  | {
      success: false
      error: {
        known: KnownError | undefined
        status: number
        type: string
        description: string
        // known or description
        message: string
      }
    }

const processResponse = async <D>(
  response: Response
): Promise<ApiResponse<D>> => {
  const data = await response.json().catch(() => undefined)

  if (response.status === 200) {
    return {
      success: true,
      data,
    }
  } else {
    const known = data && matchKnownError(data.error, data.error_description)
    const errorData =
      data && "error" in data && "error_description" in data
        ? {
            type: data.error,
            description: data.error_description,
          }
        : data && "error" in data && "message" in data.error
        ? {
            type: "unknown",
            description: data.error.message,
          }
        : {
            type: "unknown",
            description: "Unknown error",
          }

    return {
      success: false,
      error: {
        known,
        status: response.status,
        ...errorData,
        message: known || errorData.description,
      },
    }
  }
}

export const get = async (
  accessToken: string,
  endpoint: string,
  query: Record<string, any>,
  headers: Record<string, string> = {}
): Promise<ApiResponse<any>> =>
  processResponse(
    await fetch(
      ApiPrefix + endpoint + "?" + new URLSearchParams(query).toString(),
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          ...headers,
        },
      }
    )
  )

export const post = async (
  accessToken: string,
  endpoint: string,
  body: Record<string, any>,
  headers: Record<string, string> = {}
): Promise<ApiResponse<any>> =>
  processResponse(
    await fetch(ApiPrefix + endpoint, {
      method: "POST",
      body: new URLSearchParams(body),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...headers,
      },
    })
  )

export const postAccountForm = async (
  endpoint: string,
  body: Record<string, any>,
  headers: Record<string, string> = {}
): Promise<ApiResponse<any>> =>
  processResponse(
    await fetch(AccountApiPrefix + endpoint, {
      method: "POST",
      body: new URLSearchParams(body),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        ...headers,
      },
    })
  )
