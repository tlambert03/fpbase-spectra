import { useState, useEffect } from "react"
import { debounce } from "../util"
const useWindowWidth = delay => {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }
    window.addEventListener("resize", debounce(handleResize, 40))
    return () => {
      window.removeEventListener("resize", debounce(handleResize, 40))
    }
  })

  return width
}

export default useWindowWidth
