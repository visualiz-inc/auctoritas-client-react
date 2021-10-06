/* eslint-disable react/display-name */
import {  AuctoritasClientOptions } from '@auctoritas/client-vanilla';
import React, { PropsWithChildren } from 'react';
import  AuctoritasProvider from '../src/auctoritas-provider';

export const createWrapper = ({
  clientId = '__test_client_id__',
  domain = '__test_domain__',
  ...opts
}: Partial< AuctoritasClientOptions> = {}) => {
  return ({ children, }: PropsWithChildren<{}>): JSX.Element => (
    < AuctoritasProvider domain={domain} clientId={clientId} {...opts}>
      {children}
    </ AuctoritasProvider>
  );
};
