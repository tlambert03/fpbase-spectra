import React, { useState, useEffect } from "react"
import { AsyncPaginateBase } from "react-select-async-paginate"
import Select from "react-select"
import { optionsLoader } from "../util"
import { categoryIcon } from "./FaIcon"
import { components } from "react-select"
import PropTypes from "prop-types"

const filterOption = (query, label) => {
  const words = query.toLowerCase().split(" ")
  const opts = label.toLowerCase()
  return words.reduce((acc, cur) => acc && opts.includes(cur), true)
}

const querySorter = query => {
  const lowerquery = query.trimRight().toLowerCase()
  return function sortOptions(a, b) {
    const alabel = a.label.replace(/^m/, "").toLowerCase()
    const blabel = b.label.replace(/^m/, "").toLowerCase()
    if (alabel.startsWith(lowerquery)) {
      if (blabel.startsWith(lowerquery)) {
        return alabel < blabel ? -1 : 1
      }
      return -1
    }
    if (blabel.startsWith(lowerquery)) return 1
    return alabel < blabel ? -1 : 1
  }
}

const SortablePaginatedSelect = ({
  showIcon,
  options,
  components,
  ...otherprops
}) => {
  const [dynamicOptions, setOptions] = React.useState(options)
  const [inputValue, setInputValue] = React.useState("")

  // blur the select element when the escape key is pressed
  const ref = React.useRef()
  useEffect(() => {
    const blurme = e => (e.code === "Escape" ? ref.current.blur() : null)
    //document.addEventListener("keydown", blurme)
    return () => {
      document.removeEventListener("keydown", blurme)
    }
  }, [])

  const handleInputChange = (query, { action }) => {
    setInputValue(query)
    if (action === "input-change") {
      if (query) {
        const newOpts = options
          .filter(({ label }) => filterOption(query, label))
          .sort(querySorter(query))
        setOptions(newOpts)
      } else {
        setOptions(options)
      }
    }
  }

  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const onMenuOpen = () => setMenuIsOpen(true)
  const onMenuClose = () => {
    setOptions(options)
    setMenuIsOpen(false)
  }
  console.log(dynamicOptions)
  return (
    <AsyncPaginateBase
      {...otherprops}
      loadOptions={optionsLoader(dynamicOptions, 15)}
      options={dynamicOptions.slice(0, 15)}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      filterOption={() => true}
      menuIsOpen={menuIsOpen}
      onMenuOpen={onMenuOpen}
      onMenuClose={onMenuClose}
      //selectRef={ref}
      components={{
        ...components,
        ...(showIcon ? { Option: OptionWithIcon } : {})
      }}
    />
  )
}

SortablePaginatedSelect.defaultProps = {
  showIcon: false
}

const OptionWithIcon = props => {
  const myProps = { ...props }

  myProps.children = (
    <>
      {categoryIcon(props.data.category, "#aaa")}
      {myProps.children}
    </>
  )
  return <components.Option {...myProps} />
}

OptionWithIcon.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  isFocused: PropTypes.bool,
  isSelected: PropTypes.bool
}

export default SortablePaginatedSelect
