import gql from "graphql-tag"

const typeDefs = gql`
  extend type Query {
    activeSpectra: [Int]
  }
  extend type Mutation {
    updateActiveSpectra(activeSpectra: [Int]!): [Int]
  }
`

export { typeDefs }
