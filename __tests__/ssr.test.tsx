/**
 * @jest-environment node
 */
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {  AuctoritasProvider, ClientContext } from '../src';

jest.unmock('auctoritas-client-vanilla');

describe('In a Node SSR environment', () => {
  it('auth state is initialised', async () => {
    let isLoading, isAuthenticated, user, loginWithRedirect;
    ReactDOMServer.renderToString(
      < AuctoritasProvider clientId="__client_id__" domain="__domain__">
        <ClientContext.Consumer>
          {(value): JSX.Element => {
            ({ isLoading, isAuthenticated, user, loginWithRedirect } = value);
            return <div>App</div>;
          }}
        </ClientContext.Consumer>
      </ AuctoritasProvider>
    );
    expect(isLoading).toBeTruthy();
    expect(isAuthenticated).toBeFalsy();
    expect(user).toBeUndefined();
    await expect(loginWithRedirect).rejects.toThrowError(
      'window is not defined'
    );
  });
});
