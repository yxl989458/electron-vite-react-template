import { useEffect, useRef } from 'react'

export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element: HTMLElement | Window = window,
) {
  const savedHandler = useRef(handler)

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    const eventListener = (event: Event) => savedHandler.current(event as WindowEventMap[K])
    element.addEventListener(eventName, eventListener as EventListener)

    return () => {
      element.removeEventListener(eventName, eventListener as EventListener)
    }
  }, [eventName, element])
}
