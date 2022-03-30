import { useEffect, useState } from "react"

const getWindowDimensions = () =>
  typeof window !== "undefined"
    ? {
        width: window.innerWidth,
        height: window.innerHeight,
      }
    : { width: 0, height: 0 }

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  )

  useEffect(() => {
    const handleResize = () => setWindowDimensions(getWindowDimensions())

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowDimensions
}
