import { useContext } from 'react';
import { User } from 'auctoritas-client-vanilla';
import ClientContext, { ClientContextInterface } from './auctoritas-context';

/**
 * ```js
 * const {
 *   // Auth state:
 *   error,
 *   isAuthenticated,
 *   isLoading,
 *   user,
 *   // Auth methods:
 *   getAccessTokenSilently,
 *   getAccessTokenWithPopup,
 *   getIdTokenClaims,
 *   loginWithRedirect,
 *   loginWithPopup,
 *   logout,
 * } = useClient<TUser>();
 * ```
 *
 * Use the `useClient` hook in your components to access the auth state and methods.
 *
 * TUser is an optional type param to provide a type to the `user` field.
 */
const useClient = <TUser extends User = User>(): ClientContextInterface<TUser> =>
  useContext(ClientContext) as ClientContextInterface<TUser>;

export default useClient;  
