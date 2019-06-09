import React, { useState } from "react"
import IconButton from "@material-ui/core/IconButton"
import SearchModal from "./SearchModal"
import SearchIcon from "@material-ui/icons/Search"

const QuickEntry = ({ options }) => {
  const [searchOpen, setSearchOpen] = useState(false)

  const handleClick = () => setSearchOpen(true)
  
  return (
    <div>
      <IconButton
        style={{
          position: "relative",
          top: -2,
          right: 25,
          zIndex: 2,
          backgroundColor: "transparent"
        }}
        onClick={handleClick}
      >
        <SearchIcon />
      </IconButton>
      <SearchModal
        options={options}
        open={searchOpen}
        setOpen={setSearchOpen}
      />
    </div>
  )
}

export default QuickEntry
