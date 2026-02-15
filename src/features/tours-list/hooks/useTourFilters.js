'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export function useTourFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // 1. Existing helper for single values (e.g. Price)
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const setFilter = (name, value) => {
    router.push(`?${createQueryString(name, value)}`, { scroll: false })
  }

  // 2. NEW: Helper for toggling array values (e.g. Checkboxes)
  const toggleFilter = (name, value) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Check if this specific value exists for this key
    if (params.has(name) && params.getAll(name).includes(value)) {
        // Remove it
        const newValues = params.getAll(name).filter(v => v !== value)
        params.delete(name)
        newValues.forEach(v => params.append(name, v))
    } else {
        // Add it
        params.append(name, value)
    }

    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Helper to check if a checkbox should be checked
  const isSelected = (name, value) => {
    return searchParams.getAll(name).includes(String(value));
  }

  return {
    searchParams,
    setFilter,
    toggleFilter, // Export this
    isSelected,   // Export this
    price: searchParams.get('price') || 500,
    sort: searchParams.get('sort') || 'Featured'
  }
}