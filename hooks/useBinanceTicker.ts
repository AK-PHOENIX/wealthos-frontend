'use client'
import { useEffect, useRef, useState } from 'react'

export interface TickerData {
  symbol: string      // e.g. "BTC"
  price: number
  change24h: number
  high24h: number
  low24h: number
  volume: number
}

// Binance symbol → your app symbol mapping
const BINANCE_MAP: Record<string, string> = {
  BTCUSDT:  'BTC',
  ETHUSDT:  'ETH',
  SOLUSDT:  'SOL',
  BNBUSDT:  'BNB',
  XRPUSDT:  'XRP',
  ADAUSDT:  'ADA',
  DOGEUSDT: 'DOGE',
  DOTUSDT:  'DOT',
  AVAXUSDT: 'AVAX',
  MATICUSDT:'MATIC',
  LINKUSDT: 'LINK',
  LTCUSDT:  'LTC',
}

const STREAM = Object.keys(BINANCE_MAP)
  .map(s => `${s.toLowerCase()}@ticker`)
  .join('/')

const WS_URL = `wss://stream.binance.com:9443/stream?streams=${STREAM}`

export function useBinanceTicker() {
  const [tickers, setTickers] = useState<Record<string, TickerData>>({})
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function connect() {
      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => setConnected(true)

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data)
          const d = msg.data
          if (!d) return

          const binanceSymbol = d.s as string
          const appSymbol = BINANCE_MAP[binanceSymbol]
          if (!appSymbol) return

          setTickers(prev => ({
            ...prev,
            [appSymbol]: {
              symbol:    appSymbol,
              price:     parseFloat(d.c),   // current price in USDT
              change24h: parseFloat(d.P),   // 24h change %
              high24h:   parseFloat(d.h),
              low24h:    parseFloat(d.l),
              volume:    parseFloat(d.v),
            }
          }))
        } catch {}
      }

      ws.onclose = () => {
        setConnected(false)
        // Auto-reconnect after 3 seconds
        reconnectRef.current = setTimeout(connect, 3000)
      }

      ws.onerror = () => ws.close()
    }

    connect()

    return () => {
      if (reconnectRef.current) clearTimeout(reconnectRef.current)
      wsRef.current?.close()
    }
  }, [])

  return { tickers, connected }
}
