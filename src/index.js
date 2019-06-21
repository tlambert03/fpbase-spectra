import React, { useRef } from "react"
import "./index.css"
import App from "./App"
import { ApolloProvider } from "react-apollo-hooks"
import initializeClient from "./client/client"

const AppWrapper = ({ uri }) => {
  const client = useRef(initializeClient({ uri }))
  return (
    <ApolloProvider client={client.current}>
      <App />
    </ApolloProvider>
  )
}

AppWrapper.defaultProps = {
  uri: "https://www.fpbase.org/graphql/"
}

export default AppWrapper