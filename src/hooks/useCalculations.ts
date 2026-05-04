import { useMemo } from 'react'
import { calculateLinkResults, validateParams } from '@/lib/radio-math'
import { useLinkStore } from '@/stores/useLinkStore'

export const useCalculations = () => {
  const params = useLinkStore((s) => s.params)
  const errors = useMemo(() => validateParams(params), [params])
  const hasErrors = Object.keys(errors).length > 0

  const results = useMemo(() => {
    if (hasErrors) return null
    return calculateLinkResults(params)
  }, [hasErrors, params])

  return {
    params,
    results,
    errors,
    hasErrors,
  }
}
