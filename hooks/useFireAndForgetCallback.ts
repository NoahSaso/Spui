import { useCallback } from "react"

export const useFireAndForgetCallback = (
  accessToken: string | null,
  callback: (accessToken: string) => Promise<void>,
  refetch: () => void,
  loading: boolean,
  setLoading: (loading: boolean) => void
) =>
  useCallback(async () => {
    if (!accessToken || loading) return

    setLoading(true)
    try {
      await callback(accessToken)
      await refetch()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [accessToken, callback, refetch, loading, setLoading])
