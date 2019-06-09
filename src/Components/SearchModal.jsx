import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import Modal from "@material-ui/core/Modal"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import { customFilterOption } from "./util"
import IntegrationReactSelect from "./IntegrationReactSelect"
import { useMutation } from "react-apollo-hooks"

import { gql } from "apollo-boost"

function getModalStyle() {
  const top = 42
  const left = 45

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  }
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    width: 600,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: 30,
    paddingTop: 25,
    outline: "none"
  }
}))

const UPDATE_SPECTRA = gql`
  mutation updateActiveSpectra($spectra: [Int]!) {
    updateActiveSpectra(activeSpectra: $spectra) @client
  }
`

const SearchModal = ({ options, open, setOpen }) => {
  const [modalStyle] = useState(getModalStyle)
  const classes = useStyles()

  useEffect(() => {
    const handleKeyDown = event => {
      // don't do anything if we're on an input
      if (document.activeElement.tagName.toUpperCase() === "INPUT") {
        return
      }
      switch (event.code) {
        case "KeyL":
          event.preventDefault()
          setOpen(true)
          break
        case "Escape":
          event.preventDefault()
          setOpen(false)
          break
        default:
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [setOpen])

  const updateSpectra = useMutation(UPDATE_SPECTRA)

  const handleChange = event => {
    const spectra = event && event.spectra.map(({ id }) => id)
    if (spectra) updateSpectra({ variables: { spectra } })
    setOpen(false)
  }
  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={open}
      onClose={() => setOpen(false)}
    >
      <div style={modalStyle} className={classes.paper}>
        <Typography
          variant="h6"
          id="modal-title"
          style={{ color: "black", marginBottom: "5px" }}
        >
          Quick Entry
        </Typography>

        <IntegrationReactSelect
          autoFocus
          // classes={classes}
          options={options}
          filterOption={customFilterOption}
          onChange={handleChange}
          placeholder="Type the name of any spectrum"
        />
      </div>
    </Modal>
  )
}

SearchModal.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default SearchModal
