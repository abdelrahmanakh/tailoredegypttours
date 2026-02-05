'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export function useTourFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

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

  return {
    searchParams,
    setFilter,
    price: searchParams.get('price') || 1000,
    sort: searchParams.get('sort') || 'Featured'
  }
}