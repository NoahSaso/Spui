import { AccountApiPrefix, ApiPrefix } from "@/config"

export enum KnownError {
  RefreshTokenRevoked = "Refresh token revoked.",
  InvalidRefreshToken = "Invalid refresh token.",
  NoActiveDevice = "No active device.",
}

// Strings will be checked as substrings.
// All else will be matched exactly.
const knownErrorMatchMap: Record<KnownError, Record<string, any>> = {
  [KnownError.RefreshTokenRevoked]: {
    error: "invalid_grant",
    error_description: "Refresh token revoked",
  },
  [KnownError.InvalidRefreshToken]: {
    error: "invalid_grant",
    error_description: "Invalid refresh token",
  },
  [KnownError.NoActiveDevice]: {
    status: 404,
    reason: "NO_ACTIVE_DEVICE",
  },
}
const KnownErrorMatchEntries = Object.entries(knownErrorMatchMap)

const matchKnownError = (data: Record<string, any>): KnownError | undefined => {
  const matched = KnownErrorMatchEntries.find(([_, expected]) =>
    Object.entries(expected).every(
      ([key, value]) =>
        key in data &&
        ((typeof data[key] === "string" &&
          typeof value === "string" &&
          (data[key] as string).includes(value)) ||
          data[key] === value)
    )
  )
  return matched?.[0] as KnownError | undefined
}

interface ApiErrorData {
  status: number
  known: KnownError | undefined
}

export class ApiError extends Error {
  data: ApiErrorData

  constructor(message: string, data: ApiErrorData) {
    super(message)
    this.data = data
  }
}

const processResponse = async <D>(
  response: Response,
  // Account API errors are formatted differently.
  accountApi = false
): Promise<D> => {
  const data = await response.json().catch(() => undefined)

  if (response.ok) {
    return data
  } else {
    const errorData = accountApi ? data : data?.error
    const message = accountApi
      ? errorData.error_description
      : errorData?.message

    const known = data && matchKnownError(errorData)
    const error = new ApiError(known || message, {
      known,
      status: response.status,
    })
    console.error(error)

    throw error
  }
}

export const GET = async <D>(
  accessToken: string,
  endpoint: string,
  query?: Record<string, any>,
  headers: Record<string, string> = {}
): Promise<D> =>
  processResponse(
    await fetch(
      ApiPrefix +
        endpoint +
        (query ? "?" + new URLSearchParams(query).toString() : ""),
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

export const POST = async <D>(
  accessToken: string,
  endpoint: string,
  query?: Record<string, any>,
  body?: Record<string, any>,
  headers: Record<string, string> = {}
): Promise<D> =>
  processResponse(
    await fetch(
      ApiPrefix +
        endpoint +
        (query ? "?" + new URLSearchParams(query).toString() : ""),
      {
        method: "POST",
        ...(body && { body: JSON.stringify(body) }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          ...headers,
        },
      }
    )
  )

export const PUT = async <D>(
  accessToken: string,
  endpoint: string,
  query?: Record<string, any>,
  body?: Record<string, any>,
  headers: Record<string, string> = {}
): Promise<D> =>
  processResponse(
    await fetch(
      ApiPrefix +
        endpoint +
        (query ? "?" + new URLSearchParams(query).toString() : ""),
      {
        method: "PUT",
        ...(body && { body: JSON.stringify(body) }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          ...headers,
        },
      }
    )
  )

export const DELETE = async <D>(
  accessToken: string,
  endpoint: string,
  query?: Record<string, any>,
  body?: Record<string, any>,
  headers: Record<string, string> = {}
): Promise<D> =>
  processResponse(
    await fetch(
      ApiPrefix +
        endpoint +
        (query ? "?" + new URLSearchParams(query).toString() : ""),
      {
        method: "DELETE",
        ...(body && { body: JSON.stringify(body) }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          ...headers,
        },
      }
    )
  )

export const postAccountForm = async <D>(
  endpoint: string,
  body: Record<string, any>,
  headers: Record<string, string> = {}
): Promise<D> =>
  processResponse(
    await fetch(AccountApiPrefix + endpoint, {
      method: "POST",
      body: new URLSearchParams(body),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        ...headers,
      },
    }),
    true
  )

export type ListResponse<T> = {
  href: string
  items: T[]
  limit: number
  next: string | null
  offset: number
  previous: string | null
  total: number
}
