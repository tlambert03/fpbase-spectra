import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { HttpLink } from "apollo-link-http"
import { onError } from "apollo-link-error"
import { ApolloLink } from "apollo-link"

import { persistCache } from "apollo-cache-persist"
import { defaults, resolvers } from "./resolvers"
import { typeDefs } from "./schema"
import { IntrospectionFragmentMatcher } from "apollo-cache-inmemory"
import introspectionQueryResultData from "../fragmentTypes.json"

import qs from "qs"

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
})

const cache = new InMemoryCache({ fragmentMatcher })

const link = ApolloLink.from([
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      )
    if (networkError) console.log(`[Network error]: ${networkError}`)
  }),
  new HttpLink({
    uri: "http://localhost:8000/graphql/",
    credentials: "same-origin"
  })
])

const client = new ApolloClient({
  link,
  cache,
  typeDefs,
  resolvers
})

cache.writeData({ data: defaults })

// Populate from localstorage?
const setupLocalStorage = async () => {
  await persistCache({
    cache,
    storage: window.sessionStorage
  })
}

function parseURL() {
  const url = qs.parse(window.location.search.replace(/^\?/, ""), {
    decoder(str, decoder, charset) {
      const strWithoutPlus = str.replace(/\+/g, " ")
      if (charset === "iso-8859-1") {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape)
      }

      if (/^(\d+|\d*\.\d+)$/.test(str)) {
        return parseFloat(str)
      }

      const keywords = {
        true: true,
        false: false,
        null: null,
        undefined
      }
      if (str in keywords) {
        return keywords[str]
      }

      // utf-8
      try {
        return decodeURIComponent(strWithoutPlus)
      } catch (e) {
        return strWithoutPlus
      }
    }
  })
  let data = {}

  if ("s" in url || "activeSpectra" in url) {
    let active = url["s"] || url["activeSpectra"]
    if (!Array.isArray(active)) active = active.split(",")
    data.activeSpectra = active.map(i => +i)
  }
  if ("opt" in url) {
    data.chartOptions = url.opt
  } else {
  }
  cache.writeData({ data })
}

setupLocalStorage().then(parseURL)

export default client
