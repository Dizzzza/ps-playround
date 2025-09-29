'use client';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import React from 'react';

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

const client = new ApolloClient({
  uri: graphqlAPI,
  cache: new InMemoryCache(),
});

export function MyApolloProvider({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
