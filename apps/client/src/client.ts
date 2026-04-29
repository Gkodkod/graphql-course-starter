import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  createHttpLink,
  split,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
// Uncomment to enable persisted queries
const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include", // Important for cookies
  // useGETForQueries: true,
});

// const persistedHttpLink = createPersistedQueryLink({
//   sha256,
//   useGETForHashedQueries: true,
// }).concat(httpLink);

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
  })
);

// Split links based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
  // persistedHttpLink
);

const loggerLink = new ApolloLink((operation, forward) => {
  process.stdout.write(`Apollo Operation: ${operation.operationName} (${operation.query.definitions[0].kind})\n`);
  return forward(operation);
});

const client = new ApolloClient({
  link: loggerLink.concat(splitLink),
  cache: new InMemoryCache(),
});

export default client;
