import { datatype, name } from 'community-faker';
import { createMockContext } from '@shopify/jest-koa-mocks';

import deserializeUserData, { IUserData } from './deserialize-user-data';

describe('Deserialize User Data middleware', () => {
  let nextFnStub: jest.Mock;
  const mockXuser: IUserData = {
    userHandle: datatype.uuid(),
    userId: datatype.uuid(),
    claims: [name.title()],
    features: []
  };
  beforeAll(() => {
    nextFnStub = jest.fn().mockImplementation(() => Promise.resolve());
  });

  it('should deserilize user from x-user header and add to the state', () => {
    const ctx = createMockContext({
      headers: {
        'x-user': JSON.stringify(mockXuser)
      }
    });
    deserializeUserData(ctx, nextFnStub);

    expect(nextFnStub).toHaveBeenCalled();
    expect(ctx.state).toEqual(mockXuser);
  });
});