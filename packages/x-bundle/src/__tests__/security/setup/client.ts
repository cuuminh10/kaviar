import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import fetch from "node-fetch";

export const authStorage = {
  value: "",
};
//@ts-ignore
const httpLink = new HttpLink({ uri: "http://localhost:7000/graphql", fetch });
const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => {
    const newHeaders = { ...headers };
    if (authStorage.value) {
      newHeaders["kaviar-token"] = authStorage.value;
    }

    return {
      headers: newHeaders,
    };
  });

  return forward(operation);
});

export function createClient(): ApolloClient<any> {
  return new ApolloClient({
    uri: "http://localhost:7000/graphql",
    cache: new InMemoryCache(),
    link: ApolloLink.from([authMiddleware, httpLink]),
    defaultOptions: {
      query: {
        fetchPolicy: "network-only",
      },
    },
  });
}
