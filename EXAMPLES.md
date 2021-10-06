# Examples

1. [Protecting a route in a `react-router-dom` app](#1-protecting-a-route-in-a-react-router-dom-app)
2. [Protecting a route in a Gatsby app](#2-protecting-a-route-in-a-gatsby-app)
3. [Protecting a route in a Next.js app (in SPA mode)](#3-protecting-a-route-in-a-nextjs-app-in-spa-mode)
4. [Create a `useApi` hook for accessing protected APIs with an access token.](#4-create-a-useapi-hook-for-accessing-protected-apis-with-an-access-token)
5. [Use with  Auctoritas organizations](#5-use-with- Auctoritas-organizations)

## 1. Protecting a route in a `react-router-dom` app

So that we can access the router `history` outside of the `Router` component you need to [create your own history object](https://github.com/ReactTraining/react-router/blob/master/FAQ.md#how-do-i-access-the-history-object-outside-of-components). We can reference this object from the ` AuctoritasProvider`'s `onRedirectCallback`.

We can then use the `withAuthenticationRequired` HOC (Higher Order Component) to create a `ProtectedRoute` component that redirects anonymous users to the login page, before returning them to the protected route:

```jsx
import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import {  AuctoritasProvider, withAuthenticationRequired } from '@ Auctoritas/ Auctoritas-react';
import { createBrowserHistory } from 'history';
import Profile from './Profile';

export const history = createBrowserHistory();

const ProtectedRoute = ({ component, ...args }) => (
  <Route component={withAuthenticationRequired(component)} {...args} />
);

const onRedirectCallback = (appState) => {
  // Use the router's history module to replace the url
  history.replace(appState?.returnTo || window.location.pathname);
};

export default function App() {
  return (
    < AuctoritasProvider
      domain="YOUR_ Auctoritas_DOMAIN"
      clientId="YOUR_ Auctoritas_CLIENT_ID"
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      {/* Don't forget to add the history to your router */}
      <Router history={history}>
        <Switch>
          <Route path="/" exact />
          <ProtectedRoute path="/profile" component={Profile} />
        </Switch>
      </Router>
    </ AuctoritasProvider>
  );
}
```

See [react-router example app](./examples/cra-react-router)

## 2. Protecting a route in a Gatsby app

Wrap the root element in your ` AuctoritasProvider` to configure the SDK and setup the context for the `useClient` hook.

The `onRedirectCallback` will use `gatsby`'s `navigate` function to return the user to the protected route after the login:

```jsx
// gatsby-browser.js
import React from 'react';
import {  AuctoritasProvider } from '@ Auctoritas/ Auctoritas-react';
import { navigate } from 'gatsby';

const onRedirectCallback = (appState) => {
  // Use Gatsby's navigate method to replace the url
  navigate(appState?.returnTo || '/', { replace: true });
};

export const wrapRootElement = ({ element }) => {
  return (
    < AuctoritasProvider
      domain="YOUR_ Auctoritas_DOMAIN"
      clientId="YOUR_ Auctoritas_CLIENT_ID"
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      {element}
    </ AuctoritasProvider>
  );
};
```

Create a page that you want to be protected, e.g. a profile page, and wrap it in the `withAuthenticationRequired` HOC:

```jsx
// src/pages/profile.js
import React from 'react';
import { useClient, withAuthenticationRequired } from '@ Auctoritas/ Auctoritas-react';

const Profile = () => {
  const { user } = useClient();
  return (
    <ul>
      <li>Name: {user.nickname}</li>
      <li>E-mail: {user.email}</li>
    </ul>
  );
};

// Wrap the component in the withAuthenticationRequired handler
export default withAuthenticationRequired(Profile);
```

See [Gatsby example app](./examples/gatsby-app)

## 3. Protecting a route in a Next.js app (in SPA mode)

Wrap the root element in your ` AuctoritasProvider` to configure the SDK and setup the context for the `useClient` hook.

The `onRedirectCallback` will use `next`'s `Router.replace` function to return the user to the protected route after the login:

```jsx
// pages/_app.js
import React from 'react';
import App from 'next/app';
import Router from 'next/router';
import {  AuctoritasProvider } from '@ Auctoritas/ Auctoritas-react';

const onRedirectCallback = (appState) => {
  // Use Next.js's Router.replace method to replace the url
  Router.replace(appState?.returnTo || '/');
};

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      < AuctoritasProvider
        domain="YOUR_ Auctoritas_DOMAIN"
        clientId="YOUR_ Auctoritas_CLIENT_ID"
        redirectUri={typeof window !== 'undefined' && window.location.origin}
        onRedirectCallback={onRedirectCallback}
      >
        <Component {...pageProps} />
      </ AuctoritasProvider>
    );
  }
}

export default MyApp;
```

Create a page that you want to be protected, e.g. a profile page, and wrap it in the `withAuthenticationRequired` HOC:

```jsx
// pages/profile.js
import React from 'react';
import { useClient, withAuthenticationRequired } from '@ Auctoritas/ Auctoritas-react';

const Profile = () => {
  const { user } = useClient();
  return (
    <ul>
      <li>Name: {user.nickname}</li>
      <li>E-mail: {user.email}</li>
    </ul>
  );
};

// Wrap the component in the withAuthenticationRequired handler
export default withAuthenticationRequired(Profile);
```

See [Next.js example app](./examples/nextjs-app)

## 4. Create a `useApi` hook for accessing protected APIs with an access token.

```js
// use-api.js
import { useEffect, useState } from 'react';
import { useClient } from '@ Auctoritas/ Auctoritas-react';

export const useApi = (url, options = {}) => {
  const { getAccessTokenSilently } = useClient();
  const [state, setState] = useState({
    error: null,
    loading: true,
    data: null,
  });
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { audience, scope, ...fetchOptions } = options;
        const accessToken = await getAccessTokenSilently({ audience, scope });
        const res = await fetch(url, {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
            // Add the Authorization header to the existing headers
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setState({
          ...state,
          data: await res.json(),
          error: null,
          loading: false,
        });
      } catch (error) {
        setState({
          ...state,
          error,
          loading: false,
        });
      }
    })();
  }, [refreshIndex]);

  return {
    ...state,
    refresh: () => setRefreshIndex(refreshIndex + 1),
  };
};
```

Then use it for accessing protected APIs from your components:

```jsx
// users.js
import { useApi } from './use-api';

export const Profile = () => {
  const opts = {
    audience: 'https://api.example.com/',
    scope: 'read:users',
  };
  const { login, getAccessTokenWithPopup } = useClient();
  const { loading, error, refresh, data: users } = useApi(
    'https://api.example.com/users',
    opts
  );
  const getTokenAndTryAgain = async () => {
    await getAccessTokenWithPopup(opts);
    refresh();
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    if (error.error === 'login_required') {
      return <button onClick={() => login(opts)}>Login</button>;
    }
    if (error.error === 'consent_required') {
      return (
        <button onClick={getTokenAndTryAgain}>Consent to reading users</button>
      );
    }
    return <div>Oops {error.message}</div>;
  }
  return (
    <ul>
      {users.map((user, index) => {
        return <li key={index}>{user}</li>;
      })}
    </ul>
  );
};
```

## 5. Use with  Auctoritas organizations

[Organizations](https:// Auctoritas.com/docs/organizations) is a set of features that provide better support for developers who build and maintain SaaS and Business-to-Business (B2B) applications. Note that Organizations is currently only available to customers on our Enterprise and Startup subscription plans.

To log the user in to an organization, you should specify the organization in the ` AuctoritasProvider` props.

```jsx
ReactDOM.render(
  <React.StrictMode>
    < AuctoritasProvider
      domain="YOUR_ Auctoritas_DOMAIN"
      clientId="YOUR_ Auctoritas_CLIENT_ID"
      redirectUri={window.location.origin}
      organization="YOUR_ORGANIZATION_ID"
    >
      <App />
    </ AuctoritasProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
```

To accept an invite from an organization, you should call `loginWithRedirect` with the `invitation` and `organization` parameters.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {  AuctoritasProvider, useClient } from '@ Auctoritas/ Auctoritas-react';

const App = () => {
  const { loginWithRedirect } = useClient();
  const url = window.location.href;
  const inviteMatches = url.match(/invitation=([^&]+)/);
  const orgMatches = url.match(/organization=([^&]+)/);
  if (inviteMatches && orgMatches) {
    loginWithRedirect({
      organization: orgMatches[1],
      invitation: inviteMatches[1],
    });
  }
  return <div>...</div>;
};
```
