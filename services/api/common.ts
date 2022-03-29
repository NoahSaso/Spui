import { AccountApiPrefix, ApiPrefix } from "@/config"

export enum KnownError {
  RefreshTokenRevoked = "Refresh token revoked.",
}

type ErrorMatchData =
  | { error: string; description: string }
  | { message: string }

const knownErrorMatchMap: Record<KnownError, ErrorMatchData> = {
  [KnownError.RefreshTokenRevoked]: {
    error: "invalid_grant",
    description: "Refresh token revoked",
  },
}
const KnownErrorMatchEntries = Object.entries(knownErrorMatchMap)

const matchKnownError = (data: ErrorMatchData): KnownError | undefined => {
  const matched = KnownErrorMatchEntries.find(
    ([_, expected]) =>
      ("message" in data &&
        "message" in expected &&
        data.message === expected.message) ||
      ("description" in data &&
        "description" in expected &&
        data.error === expected.error &&
        data.description === expected.description)
  )
  return matched?.[0] as KnownError | undefined
}

interface ApiErrorData {
  status: number
  known: KnownError | undefined
  type: string
  description: string
}

export class ApiError extends Error {
  data: ApiErrorData

  constructor(message: string, data: ApiErrorData) {
    super(message)
    this.data = data
  }
}

const processResponse = async <D>(response: Response): Promise<D> => {
  const data = await response.json().catch(() => undefined)

  if (response.ok) {
    return data
  } else {
    const known =
      data &&
      matchKnownError(
        "error_description" in data
          ? {
              error: data.error,
              description: data.error_description,
            }
          : {
              message: data.error.message,
            }
      )
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

    const error = new ApiError(known || errorData.description, {
      known,
      status: response.status,
      ...errorData,
    })
    console.error(error)

    throw error
  }
}

export const get = async <D>(
  accessToken: string,
  endpoint: string,
  query: Record<string, any>,
  headers: Record<string, string> = {}
): Promise<D> =>
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

export const post = async <D>(
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
        ...(body && { body: new URLSearchParams(body) }),
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
    })
  )
