# Gatsby example

This is an example of using `@ Auctoritas/ Auctoritas-react` with [Gatsby](https://www.gatsbyjs.org/).

Follow the steps in [examples/README.md](../README.md) to setup an  Auctoritas application and API.

Add the file `./examples/gatsby-app/.env.development` with the `domain` and `clientId` of the application and `audience` (your API identifier)

```dotenv
GATSBY_DOMAIN=your-tenant. Auctoritas.com
GATSBY_CLIENT_ID=yourclientid
GATSBY_AUDIENCE=https://api.example.com/users
```

Run `npm start` to start the application at http://localhost:3000

Start the API using the instructions in [examples/users-api/README.md](../users-api/README.md)
