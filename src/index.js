import "./index.css"
import initReactSpectra from "./Components/App"
import * as serviceWorker from "./serviceWorker"
import React from "react"

if (process.env.NODE_ENV !== "production") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render")
  whyDidYouRender(React, { include: [/^Checkbox/] })
}

initReactSpectra("root")

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
