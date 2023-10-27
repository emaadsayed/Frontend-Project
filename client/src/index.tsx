import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';

// Create an instance of Apollo Client to connect to your GraphQL server
const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  cache: new InMemoryCache(),
  headers: {
    authorization: localStorage.getItem("token") || "",
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* // Wrapping app with ApolloProvider to provide access to Apollo Client */}
    <ApolloProvider client={client}>
      {/* // Setting up Auth0 */}
      <Auth0Provider
        domain="dev-jyrh3mqv.us.auth0.com"
        clientId="hMpTlTfP9DKPjDjI8bEDWxeAPMXuu2HZ"
        authorizationParams={{
          redirect_uri: window.location.origin + '/signin'
        }}
      >
        <App />
      </Auth0Provider>,
    </ApolloProvider>
  </React.StrictMode>
);

