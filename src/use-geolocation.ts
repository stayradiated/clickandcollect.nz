import { useEffect, useState } from 'react'

import { Coords } from './types'

const useGeolocation = (enabled: boolean): Coords => {
  const [state, setState] = useState<Coords>(null)
  let mounted = true

  const onEvent = (event: any) => {
    if (mounted) {
      setState([event.coords.latitude, event.coords.longitude])
    }
  }
  const onEventError = (error) => {
    console.error(error)
  }

  useEffect(() => {
    if (enabled) {
      navigator.geolocation.getCurrentPosition(onEvent, onEventError, {
        enableHighAccuracy: false,
      })
    }
    return () => {
      mounted = false
    }
  }, [enabled])

  return state
}

export default useGeolocation
