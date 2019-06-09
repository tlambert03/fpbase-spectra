import { useState, useEffect } from "react"

const useWindowWidth = delay => {
  const [width, setWidth] = useState(window.innerWidth)
  const [changing, setChanging] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (!changing){
        setChanging(true)
        setTimeout(() => {
          setWidth(window.innerWidth)
          setChanging(false)
        }, delay)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  })

  return width
}

export default useWindowWidth
