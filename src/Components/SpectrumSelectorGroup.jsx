import React from "react"
import Box from "@material-ui/core/Box"
import IconButton from "@material-ui/core/IconButton"
import DeleteIcon from "@material-ui/icons/Delete"
import SpectrumSelector from "./SpectrumSelector"
import { makeStyles } from "@material-ui/core/styles"
import { categoryIcon } from "../Components/FaIcon"
import Typography from "@material-ui/core/Typography"

export const useStyles = makeStyles(() => ({
  button: {
    "&:hover": {
      // you want this to be the same as the backgroundColor above
      backgroundColor: "#f8f8f8"
    }
  },
  addButton: {
    marginTop: 6,
    marginRight: 6
  },
  categoryHeader: {
    textTransform: "uppercase",
    fontSize: "small",
    color: "#3F51B5",
    marginTop: ".2rem"
  }
}))

const SpectrumSelectorGroup = ({
  selectors,
  options,
  category,
  addRow,
  changeOwner,
  removeRow,
  showCategoryIcon,
  hint,
  owners
}) => {
  const classes = useStyles()
  const allOwners = selectors.map(({ owner }) => owner)

  if (category) {
    selectors = selectors.filter(sel => sel.category === category)
  } else {
    selectors = selectors.filter(sel => sel.owner || !sel.category)
  }

  // make sure there is always one empty selector available
  if (selectors.filter(({ owner }) => !owner).length < 1) {
    addRow(category || null)
  }

  let lastCategory = ""
  const categoryNames = {
    P: "Fluorescent Proteins",
    D: "Dyes",
    F: "Filters",
    L: "Light Sources",
    C: "Detectors"
  }
  return (
    <>
      {selectors.map(selector => (
        <div style={{ width: "100%" }} key={selector.id}>
          {!category &&
            selector.category !== lastCategory &&
            ((lastCategory = selector.category) && (
              <Typography variant="h6" className={classes.categoryHeader}>
                {categoryNames[selector.category]}
              </Typography>
            ))}
          <Box display="flex">
            {categoryIcon(selector.category, "rgba(0,0,50,0.4)", {
              style: {
                position: "relative",
                top: 14,
                left: category === "L" ? 4 : 2,
                height: "1.3rem",
                marginRight: 10
              }
            })}
            <Box flexGrow={1} style={{ paddingTop: "6px" }}>
              <SpectrumSelector
                key={selector.id}
                // this line restricts the options to similar categories
                options={options.filter(opt =>
                  category ? opt.category === category : true
                )}
                showCategoryIcon={showCategoryIcon}
                value={selector.owner && owners[selector.owner]}
                otherOwners={allOwners.filter(i => i !== selector.owner)}
                onChange={changeOwner(selector.id, category)}
              />
            </Box>
            {(selector.category ? selectors.length > 1 : selectors.filter(({category}) => !category).length > 1 ) ? (
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
      {/* <Button
        variant="contained"
        color="primary"
        className={classes.addButton}
        onClick={() => addRow(category || null)}
      >
        <AddIcon />
        {`Add ${hint}`}
      </Button> */}
    </>
  )
}

SpectrumSelectorGroup.defaultProps = {
  hint: "item",
  category: ""
}

export default SpectrumSelectorGroup
