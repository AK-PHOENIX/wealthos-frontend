'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'

export function useUsdInr() {
  const [rate, setRate] = useState<number>(84)

  useEffect(() => {
    api.get('/market/rates/usd_inr')
      .then(r => {
        if (r.data?.rate) setRate(r.data.rate)
      })
      .catch(() => {})
  }, [])

  return rate
}
