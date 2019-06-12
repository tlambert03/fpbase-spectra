import "./index.css"
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import React from "react"
import ReactDOM from "react-dom"

if (process.env.NODE_ENV !== "production") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render")
  whyDidYouRender(React, { include: [] })
}

ReactDOM.render(<App></App>, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
