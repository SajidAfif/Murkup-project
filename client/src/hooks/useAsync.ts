import { useState, useCallback } from 'react'

export const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  immediate = true
) => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async () => {
    setStatus('pending')
    setData(null)
    setError(null)
    try {
      const response = await asyncFunction()
      setData(response)
      setStatus('success')
      return response
    } catch (err: any) {
      setError(err.message)
      setStatus('error')
      throw err
    }
  }, [asyncFunction])

  useState(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { status, data, error, execute }
}
