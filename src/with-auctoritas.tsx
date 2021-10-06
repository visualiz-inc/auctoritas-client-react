/* eslint-disable react/display-name */
import React, { ComponentType } from 'react';
import ClientContext, { ClientContextInterface } from './auctoritas-context';

/**
 * Components wrapped in `with Auctoritas` will have an additional ` Auctoritas` prop
 */
export interface WithAuctoritasProps {
   Auctoritas: ClientContextInterface;
}

/**
 * ```jsx
 * class MyComponent extends Component {
 *   render() {
 *     // Access the auth context from the ` Auctoritas` prop
 *     const { user } = this.props. Auctoritas;
 *     return <div>Hello {user.name}!</div>
 *   }
 * }
 * // Wrap your class component in with Auctoritas
 * export default with Auctoritas(MyComponent);
 * ```
 *
 * Wrap your class components in this Higher Order Component to give them access to the ClientContext
 */
const withAuctoritas = <P extends WithAuctoritasProps>(
  Component: ComponentType<P>
): ComponentType<Omit<P, keyof WithAuctoritasProps>> => (props): JSX.Element => (
  <ClientContext.Consumer>
    {(auth: ClientContextInterface): JSX.Element => (
      <Component  Auctoritas={auth} {...(props as any)} />
    )}
  </ClientContext.Consumer>
);

export default withAuctoritas;
