import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { HttpLink } from "apollo-link-http"
import { onError } from "apollo-link-error"
import { ApolloLink } from "apollo-link"

import { persistCache } from "apollo-cache-persist"
import { defaults as data, resolvers } from "./resolvers"
import { typeDefs } from "./schema"
import { IntrospectionFragmentMatcher } from "apollo-cache-inmemory"
import introspectionQueryResultData from "../fragmentTypes.json"

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

cache.writeData({ data })

// Populate from localstorage?
const setupLocalStorage = async () => {
  await persistCache({
    cache,
    storage: window.sessionStorage
  })
}
setupLocalStorage()

export default client
