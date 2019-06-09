import React, { useContext } from "react"
import PropTypes from "prop-types"
import Box from "@material-ui/core/Box"
import IconButton from "@material-ui/core/IconButton"
import Button from "@material-ui/core/Button"
import DeleteIcon from "@material-ui/icons/Delete"
import AddIcon from "@material-ui/icons/Add"
import { makeStyles } from "@material-ui/core/styles"
import SpectrumSelector from "./SpectrumSelector"
import { StateContext, DispatchContext } from "./Store"

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

const SpectrumSelectGroup = React.memo(function SpectrumSelectGroup({
  category,
  hint,
  selectors,
  options
}) {
  const dispatch = useContext(DispatchContext)
  const classes = useStyles()

  const addRow = () => {
    dispatch({ type: "ADD_FORM_ROW", category })
  }

  const removeRow = id => {
    dispatch({ type: "REMOVE_FORM_ROW", category, id })
  }

  console.log("SpectrumSelectGroup rendered")
  // if (!formState[category]) addRow(category);

  if (!(selectors && selectors.length)) {
    return <></>
  }

  return (
    <>
      {selectors.map(selector => (
        <div style={{ width: "100%" }} key={selector.id}>
          <Box display="flex">
            <Box flexGrow={1} style={{ paddingTop: "6px" }}>
              <SpectrumSelector
                category={category}
                selector={selector}
                options={options}
                otherOwners={selectors
                  .filter(i => i.value && i.value !== selector.value)
                  .map(i => i.value)}
              />
            </Box>
            {selectors.length > 1 ? (
              <Box>
                <IconButton
                  aria-label="Delete"
                  color="secondary"
                  className={classes.button}
                  onClick={() => removeRow(selector.id)}
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
        {`Add ${hint}`}
        <AddIcon />
      </Button>
    </>
  )
})

SpectrumSelectGroup.whyDidYouRender = true

SpectrumSelectGroup.propTypes = {
  category: PropTypes.string.isRequired,
  hint: PropTypes.string
}

SpectrumSelectGroup.defaultProps = {
  hint: "item"
}

export default SpectrumSelectGroup
