import React, { useState, useRef, useEffect } from "react"
import PropTypes from "prop-types"
import Box from "@material-ui/core/Box"
import IconButton from "@material-ui/core/IconButton"
import Button from "@material-ui/core/Button"
import DeleteIcon from "@material-ui/icons/Delete"
import AddIcon from "@material-ui/icons/Add"
import { makeStyles } from "@material-ui/core/styles"
import SpectrumSelector from "./SpectrumSelector"
import { useMutation, useQuery } from "react-apollo-hooks"
import { UPDATE_ACTIVE_SPECTRA, GET_ACTIVE_SPECTRA } from "../client/queries"
import update from "immutability-helper"

const useStyles = makeStyles(() => ({
  button: {
    "&:hover": {
      // you want this to be the same as the backgroundColor above
      backgroundColor: "#f8f8f8"
    }
  },
  addButton: {
    marginTop: 6
  }
}))

const OwnerGroup = ({ owners, hint, spectraInfo }) => {
  const {
    data: { activeSpectra }
  } = useQuery(GET_ACTIVE_SPECTRA)
  const [selectors, setSelectors] = useState([])
  const selectorId = useRef(0)
  const classes = useStyles()

  // this makes sure that all active spectra are reflected in the ownerSlugs array
  useEffect(() => {
    const currentOwners = selectors.map(({ owner }) => owner)
    let newOwners = activeSpectra
      .map(id => spectraInfo[id] && spectraInfo[id].owner)
      .filter(owner => owner && !currentOwners.includes(owner))
    newOwners = [...new Set(newOwners)].map(owner => ({
      id: selectorId.current++,
      owner
    }))
    setSelectors(update(selectors, { $push: newOwners }))
  }, [activeSpectra]) // eslint-disable-line

  const updateSpectra = useMutation(UPDATE_ACTIVE_SPECTRA)
  const removeRow = selector => {
    if (owners[selector.owner] && owners[selector.owner].spectra){
      updateSpectra({
        variables: {
          remove: owners[selector.owner].spectra.map(({ id }) => id)
        }
      })
    }
    setSelectors(selectors.filter(({ id }) => id !== selector.id))
  }

  const addRow = () => {
    setSelectors([...selectors, { id: selectorId.current++, owner: null }])
  }

  const changeOwner = id => {
    return function(owner) {
      const newSelectors = selectors.map(selector =>
        selector.id === id ? { id, owner } : selector
      )
      setSelectors(newSelectors)
    }
  }

  const allOwners = selectors.map(({ owner }) => owner)
  return (
    <>
      {selectors.map(selector => (
        <div style={{ width: "100%" }} key={selector.id}>
          <Box display="flex">
            <Box flexGrow={1} style={{ paddingTop: "6px" }}>
              <SpectrumSelector
                key={selector.id}
                // this line restricts the options to similar categories
                options={
                  selector.owner
                    ? Object.values(owners).filter(
                        i =>
                          selector.owner &&
                          i.category === owners[selector.owner].category
                      )
                    : Object.values(owners)
                }
                current={selector.owner && owners[selector.owner]}
                otherOwners={allOwners.filter(i => i !== selector.owner)}
                onChange={changeOwner(selector.id)}
              />
            </Box>
            {selectors.length > 1 ? (
              <Box>
                <IconButton
                  aria-label="Delete"
                  color="secondary"
                  className={classes.button}
                  onClick={() => removeRow(selector)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ) : (
              <></>
            )}
          </Box>
        </div>
      ))}
      <Button
        variant="contained"
        color="primary"
        className={classes.addButton}
        onClick={addRow}
      >
        <AddIcon />
        {`Add ${hint}`}
      </Button>
    </>
  )
}

OwnerGroup.propTypes = {
  category: PropTypes.string,
  hint: PropTypes.string
}

OwnerGroup.defaultProps = {
  hint: "item",
  category: ""
}

export default OwnerGroup
