import React from "react"
import IconButton from "@material-ui/core/IconButton"
import LinkIcon from "@material-ui/icons/Link"

const ProductLink = ({ current }) => {
  if (!(current && current.url)) return null
  let ownerLink = current.url
  if (current.category === "P") {
    ownerLink = current.url ? `/protein/${current.url}` : current.url || null
  }
  return (
    <IconButton
      color="primary"
      aria-label="Delete"
      href={ownerLink}
      target="_blank"
      style={{ padding: 6, marginLeft: 10, marginRight: 2 }}
    >
      <LinkIcon />
    </IconButton>
  )
}

export default ProductLink
