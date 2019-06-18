import React, { useRef } from "react"
import {
  SPECTRA_LIST,
} from "./client/queries"

import { ApolloProvider } from "react-apollo-hooks"
import client from "./client/client"
import { reshapeSpectraInfo } from "./util"
import { SpectraViewer } from "./Components/SpectraViewer"
import OwnersContainer from "./Components/OwnersContainer"
import WelcomeModal from "./Components/WelcomeModal"
import { useCachedQuery } from "./useCachedQuery"

const App = () => {
  const stash = useCachedQuery(SPECTRA_LIST, "_FPbaseSpectraStash", 5 * 60)
  const owners = useRef(null)
  const spectraInfo = useRef(null)
  if (stash) {
    const data = reshapeSpectraInfo(stash.spectra)
    owners.current = data.owners
    spectraInfo.current = data.spectraInfo
  }

  return (
    <>
      <SpectraViewer spectraInfo={spectraInfo.current} />
      {spectraInfo.current && (
        <OwnersContainer
          owners={owners.current}
          spectraInfo={spectraInfo.current}
        ></OwnersContainer>
      )}
      <WelcomeModal />
    </>
  )
}


const AppWrapper = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)

export default AppWrapper
