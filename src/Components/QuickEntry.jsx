import React, { useState } from "react"
import IconButton from "@material-ui/core/IconButton"
import SearchModal from "./SearchModal"
import SearchIcon from "@material-ui/icons/Search"

const QuickEntry = ({ options }) => {
  const [searchOpen, setSearchOpen] = useState(false)

  const handleClick = () => setSearchOpen(true)
  
  return (
    <div style={{height: 0}}>
      <IconButton
        onClick={handleClick}
      >
        <SearchIcon style={{fontSize: '1.8rem'}} />
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
