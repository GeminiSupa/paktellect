"use client"

import { Toaster, type ToasterProps } from "sonner"
import { useEffect, useState } from "react"

type Pos = NonNullable<ToasterProps["position"]>

/**
 * Desktop: top-center. Mobile (&lt; md): bottom-center with offset so toasts sit above
 * the student/teacher bottom navigation and home indicator.
 */
export function AppToaster() {
  const [position, setPosition] = useState<Pos>("top-center")
  const [offset, setOffset] = useState<ToasterProps["offset"]>(16)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const apply = () => {
      if (mq.matches) {
        setPosition("bottom-center")
        setOffset({
          bottom: "max(5.75rem, calc(env(safe-area-inset-bottom, 0px) + 4.5rem))",
        })
      } else {
        setPosition("top-center")
        setOffset(16)
      }
    }
    apply()
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [])

  return (
    <Toaster
      position={position}
      offset={offset}
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "touch-manipulation",
        },
      }}
    />
  )
}
