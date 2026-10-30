import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api'

/** Loads `path` from the API; returns data, error and a reload function. */
export function useResource<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(Boolean(path))

  const load = useCallback(async () => {
    if (!path) return
    setLoading(true)
    setError('')
    try {
      setData(await api<T>(path))
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [path])

  useEffect(() => {
    load()
  }, [load])

  return { data, setData, error, loading, reload: load }
}
