import useClient from '../src/use-auctoritas';
import { renderHook } from '@testing-library/react-hooks';
import { createWrapper } from './helpers';

describe('useClient', () => {
  it('should provide the auth context', async () => {
    const wrapper = createWrapper();
    const {
      result: { current },
      waitForNextUpdate,
    } = renderHook(useClient, { wrapper });
    await waitForNextUpdate();
    expect(current).toBeDefined();
  });

  it('should throw with no provider', () => {
    const {
      result: { current },
    } = renderHook(useClient);
    expect(current.loginWithRedirect).toThrowError(
      'You forgot to wrap your component in < AuctoritasProvider>.'
    );
  });
});
