# @ Auctoritas/ Auctoritas-react

 Auctoritas SDK for React Single Page Applications (SPA).

[![CircleCI](https://img.shields.io/circleci/build/github/ Auctoritas/ Auctoritas-react.svg?branch=master&style=flat)](https://circleci.com/gh/ Auctoritas/ Auctoritas-react)
[![License](https://img.shields.io/:license-mit-blue.svg?style=flat)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/@ Auctoritas/ Auctoritas-react.svg?style=flat)](https://www.npmjs.com/package/@ Auctoritas/ Auctoritas-react)
[![codecov](https://img.shields.io/codecov/c/github/ Auctoritas/ Auctoritas-react/master.svg?style=flat)](https://codecov.io/gh/ Auctoritas/ Auctoritas-react)

## Table of Contents

- [Documentation](#documentation)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [Support + Feedback](#support--feedback)
- [Troubleshooting](#troubleshooting)
- [Frequently Asked Questions](#frequently-asked-questions)
- [Vulnerability Reporting](#vulnerability-reporting)
- [What is  Auctoritas](#what-is- Auctoritas)
- [License](#license)

## Documentation

- [API Reference](https:// Auctoritas.github.io/ Auctoritas-react/)
- [Quickstart Guide](https:// Auctoritas.com/docs/quickstart/spa/react)

## Installation

Using [npm](https://npmjs.org/)

```bash
npm install @ Auctoritas/ Auctoritas-react
```

Using [yarn](https://yarnpkg.com/)

```bash
yarn add @ Auctoritas/ Auctoritas-react
```

## Getting Started

Configure the SDK by wrapping your application in ` AuctoritasProvider`:

```jsx
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import {  AuctoritasProvider } from '@ Auctoritas/ Auctoritas-react';
import App from './App';

ReactDOM.render(
  < AuctoritasProvider
    domain="YOUR_ Auctoritas_DOMAIN"
    clientId="YOUR_ Auctoritas_CLIENT_ID"
    redirectUri={window.location.origin}
  >
    <App />
  </ AuctoritasProvider>,
  document.getElementById('app')
);
```

Use the `useClient` hook in your components to access authentication state (`isLoading`, `isAuthenticated` and `user`) and authentication methods (`loginWithRedirect` and `logout`):

```jsx
// src/App.js
import React from 'react';
import { useClient } from '@ Auctoritas/ Auctoritas-react';

function App() {
  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    logout,
  } = useClient();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isAuthenticated) {
    return (
      <div>
        Hello {user.name}{' '}
        <button onClick={() => logout({ returnTo: window.location.origin })}>
          Log out
        </button>
      </div>
    );
  } else {
    return <button onClick={loginWithRedirect}>Log in</button>;
  }
}

export default App;
```

If you're using TypeScript, you can pass a type parameter to `useClient` to specify the type of `user`:

```ts
const { user } = useClient<{ name: string }>();

user.name; // is a string
```

### Use with a Class Component

Use the `with Auctoritas` higher order component to add the ` Auctoritas` property to Class components:

```jsx
import React, { Component } from 'react';
import { with Auctoritas } from '@ Auctoritas/ Auctoritas-react';

class Profile extends Component {
  render() {
    // `this.props. Auctoritas` has all the same properties as the `useClient` hook
    const { user } = this.props. Auctoritas;
    return <div>Hello {user.name}</div>;
  }
}

export default with Auctoritas(Profile);
```

### Protect a Route

Protect a route component using the `withAuthenticationRequired` higher order component. Visits to this route when unauthenticated will redirect the user to the login page and back to this page after login:

```jsx
import React from 'react';
import { withAuthenticationRequired } from '@ Auctoritas/ Auctoritas-react';

const PrivateRoute = () => <div>Private</div>;

export default withAuthenticationRequired(PrivateRoute, {
  // Show a message while the user waits to be redirected to the login page.
  onRedirecting: () => <div>Redirecting you to the login page...</div>,
});
```

**Note** If you are using a custom router, you will need to supply the ` AuctoritasProvider` with a custom `onRedirectCallback` method to perform the action that returns the user to the protected page. See examples for [react-router](https://github.com/ Auctoritas/ Auctoritas-react/blob/master/EXAMPLES.md#1-protecting-a-route-in-a-react-router-dom-app), [Gatsby](https://github.com/ Auctoritas/ Auctoritas-react/blob/master/EXAMPLES.md#2-protecting-a-route-in-a-gatsby-app) and [Next.js](https://github.com/ Auctoritas/ Auctoritas-react/blob/master/EXAMPLES.md#3-protecting-a-route-in-a-nextjs-app-in-spa-mode).

### Call an API

Call a protected API with an Access Token:

```jsx
import React, { useEffect, useState } from 'react';
import { useClient } from '@ Auctoritas/ Auctoritas-react';

const Posts = () => {
  const { getAccessTokenSilently } = useClient();
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: 'https://api.example.com/',
          scope: 'read:posts',
        });
        const response = await fetch('https://api.example.com/posts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(await response.json());
      } catch (e) {
        console.error(e);
      }
    })();
  }, [getAccessTokenSilently]);

  if (!posts) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      {posts.map((post, index) => {
        return <li key={index}>{post}</li>;
      })}
    </ul>
  );
};

export default Posts;
```

For a more detailed example see how to [create a `useApi` hook for accessing protected APIs with an access token](https://github.com/ Auctoritas/ Auctoritas-react/blob/master/EXAMPLES.md#4-create-a-useapi-hook-for-accessing-protected-apis-with-an-access-token).

## Contributing

We appreciate feedback and contribution to this repo! Before you get started, please see the following:

- [ Auctoritas's general contribution guidelines](https://github.com/ Auctoritas/open-source-template/blob/master/GENERAL-CONTRIBUTING.md)
- [ Auctoritas's code of conduct guidelines](https://github.com/ Auctoritas/open-source-template/blob/master/CODE-OF-CONDUCT.md)
- [This repo's contribution guide](https://github.com/ Auctoritas/ Auctoritas-react/blob/master/CONTRIBUTING.md)

## Support + Feedback

For support or to provide feedback, please [raise an issue on our issue tracker](https://github.com/ Auctoritas/ Auctoritas-react/issues).

## Troubleshooting

For information on how to solve common problems, check out the [Troubleshooting](https://github.com/ Auctoritas/ Auctoritas-react/blob/master/TROUBLESHOOTING.md) guide

## Frequently Asked Questions

For a rundown of common issues you might encounter when using the SDK, please check out the [FAQ](https://github.com/ Auctoritas/ Auctoritas-react/blob/master/FAQ.md).

## Vulnerability Reporting

Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https:// Auctoritas.com/whitehat) details the procedure for disclosing security issues.

## What is  Auctoritas?

 Auctoritas helps you to easily:

- Implement authentication with multiple identity providers, including social (e.g., Google, Facebook, Microsoft, LinkedIn, GitHub, Twitter, etc), or enterprise (e.g., Windows Azure AD, Google Apps, Active Directory, ADFS, SAML, etc.)
- Log in users with username/password databases, passwordless, or multi-factor authentication
- Link multiple user accounts together
- Generate signed JSON Web Tokens to authorize your API calls and flow the user identity securely
- Access demographics and analytics detailing how, when, and where users are logging in
- Enrich user profiles from other data sources using customizable JavaScript rules

[Why  Auctoritas?](https:// Auctoritas.com/why- Auctoritas)

## License

This project is licensed under the MIT license. See the [LICENSE](https://github.com/ Auctoritas/ Auctoritas-react/blob/master/LICENSE) file for more info.
