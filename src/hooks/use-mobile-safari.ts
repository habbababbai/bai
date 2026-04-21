import { useMemo } from 'react'

function isMobileSafariUserAgent() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const isiOS = /iP(hone|ad|od)/.test(ua)
  const isWebKit = /WebKit/i.test(ua)
  const isOtherBrowser = /CriOS|FxiOS|EdgiOS|OPiOS|YaBrowser|DuckDuckGo/i.test(ua)
  return isiOS && isWebKit && !isOtherBrowser
}

export function useMobileSafari() {
  const isMobileSafari = useMemo(() => isMobileSafariUserAgent(), [])
  return { isMobileSafari }
}
