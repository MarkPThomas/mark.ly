import UserClaimsCache from './user-claims-cache';
import IdentityApi from '../api-wrappers/identity';

describe('UserClaimsCache', () => {
  describe("If User Claims doesn't exist in db", () => {
    const identityApi = new IdentityApi({ apiKey: 'key', apiUrl: 'url' });
    const userClaimsCache = new UserClaimsCache(identityApi);

    let result: string[];

    const handle = 'handle';
    const claims = ['superb-claim'];

    const userClaimsRepoMock: any = {
      findOne: jest.fn().mockResolvedValue(undefined),
      save: jest.fn()
    };

    beforeEach(async () => {
      userClaimsCache.getRepo = jest.fn().mockImplementation(() => userClaimsRepoMock);
      identityApi.fetchUserClaims = jest.fn().mockResolvedValue(claims);
      result = await userClaimsCache.getClaimsByHandle(handle);
    });

    it('should call identityApi to get user claims', () => {
      expect(identityApi.fetchUserClaims).toHaveBeenCalledWith(handle);
    });

    it('should save User Claims into DB', () => {
      const args = userClaimsRepoMock.save.mock.calls[0][0];
      expect(args).toHaveProperty('claims', claims);
      expect(args).toHaveProperty('handle', handle);
    });

    it('should return user claims', () => {
      expect(result).toEqual(claims);
    });
  });

  describe('If User Claims exists in db', () => {
    const identityApi = new IdentityApi({ apiKey: 'key', apiUrl: 'url' });
    const userClaimsCache = new UserClaimsCache(identityApi);

    let result: string[];

    const handle = 'handle';
    const claims = ['superb-claim'];

    const userClaimsRepoMock: any = {
      findOne: jest.fn().mockResolvedValue({ handle, claims })
    };

    beforeEach(async () => {
      userClaimsCache.getRepo = jest.fn().mockImplementation(() => userClaimsRepoMock);
      identityApi.fetchUserClaims = jest.fn().mockResolvedValue(claims);
      result = await userClaimsCache.getClaimsByHandle(handle);
    });

    it("shouldn't call identity api", () => {
      expect(identityApi.fetchUserClaims).toHaveBeenCalledTimes(0);
    });

    it('should return user claims', () => {
      expect(result).toEqual(claims);
    });
  });
});