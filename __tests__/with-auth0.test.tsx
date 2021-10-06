import '@testing-library/jest-dom/extend-expect';
import React, { Component } from 'react';
import withAuctoritas, { WithAuctoritasProps } from '../src/with-auctoritas';
import { render, screen } from '@testing-library/react';

describe('with Auctoritas', () => {
  it('should wrap a class component', () => {
    class MyComponent extends Component<WithAuctoritasProps> {
      render(): JSX.Element {
        return <>hasAuth: {`${!!this.props. Auctoritas}`}</>;
      }
    }
    const WrappedComponent = withAuctoritas(MyComponent);
    render(<WrappedComponent />);
    expect(screen.getByText('hasAuth: true')).toBeInTheDocument();
  });
});
