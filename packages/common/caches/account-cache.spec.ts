
import { datatype, name, internet, lorem } from 'community-faker';

import { Account } from '../database/models';
import IdentityApi from '../api-wrappers/identity';
import AccountCache from './account-cache';

const createAccountMock = (replace?: any) => ({
  handle: datatype.uuid(),
  firstName: name.firstName(),
  lastName: name.lastName(),
  email: internet.email(),
  gravatarUrl: internet.url(),
  username: `${lorem.word()}_${lorem.word()}`.toLocaleLowerCase(),
  accountClosed: false,
  additionalEmails: [],
  lastSignIn: new Date().toISOString(),
  acceptedTermsOn: new Date().toISOString(),
  acceptedPrivacyOn: new Date().toISOString(),
  needsToAcceptTermsAndConditions: false,
  createdAt: new Date().toISOString(),
  ...replace
});

describe('AccountCache', () => {
  describe('saveAccount', () => {
    const account = createAccountMock();
    const accountRepoMock: any = {
      find: jest.fn().mockResolvedValue(undefined),
      save: jest.fn().mockResolvedValue(account)
    };

    let result: any;
    beforeEach(async () => {
      const identityApi = new IdentityApi({ apiKey: 'key', apiUrl: 'url' });
      const accountCache = new AccountCache(identityApi);
      accountCache.getRepo = jest.fn().mockImplementation(() => accountRepoMock);

      result = await accountCache.saveAccount(account);
    });
    it('should save account to repo', () => {
      expect(result).toEqual(account);
    });
  });

  describe('getAccount', () => {
    describe("If Account cache doesn't exist in db", () => {
      const identityApi = new IdentityApi({ apiKey: 'key', apiUrl: 'url' });
      const accountCache = new AccountCache(identityApi);
      let result: Account;

      const handle = datatype.uuid();
      const userAccount = createAccountMock({ handle });

      const accountRepoMock: any = {
        find: jest.fn().mockResolvedValue(undefined),
        save: jest.fn().mockReturnValue({
          handle,
          firstName: userAccount.firstName,
          lastName: userAccount.lastName,
          email: userAccount.email,
          username: userAccount.userName,
          accountClosed: false,
          accountRemoved: false,
          timeToLive: new Date()
        })
      };

      beforeEach(async () => {
        accountCache.getRepo = jest.fn().mockImplementation(() => accountRepoMock);
        identityApi.fetchAccount = jest.fn().mockResolvedValue(userAccount);

        result = await accountCache.getAccount(handle);
      });

      it('should save account into DB', () => {
        const args = accountRepoMock.save.mock.calls[0][0];
        const { timeToLive, ...account } = args;

        expect(account).toEqual(userAccount);
        expect(timeToLive).toBeTruthy();
      });

      it('should call identityApi to fetch user account', () => {
        expect(identityApi.fetchAccount).toBeCalledWith(handle);
      });

      it('should return user account', () => {
        const { timeToLive, ...account } = result;

        expect(account).toEqual({
          handle,
          firstName: userAccount.firstName,
          lastName: userAccount.lastName,
          email: userAccount.email,
          username: userAccount.userName,
          accountClosed: false,
          accountRemoved: false
        });

        expect(timeToLive).toBeTruthy();
      });
    });

    describe('If Account exists in db and timeToLive is not expired', () => {
      const identityApi = new IdentityApi({ apiKey: 'key', apiUrl: 'url' });
      const accountCache = new AccountCache(identityApi);

      let result: any;

      const SOME_AMOUNT_OF_TIME = 1800e3;

      const handle = datatype.uuid();
      const userAccount = createAccountMock({ handle, timeToLive: new Date(Date.now() + SOME_AMOUNT_OF_TIME) });

      const accountRepoMock: any = {
        find: jest.fn().mockResolvedValue(userAccount),
        save: jest.fn().mockResolvedValue(undefined)
      };

      beforeEach(async () => {
        accountCache.getRepo = jest.fn().mockImplementation(() => accountRepoMock);
        identityApi.fetchAccount = jest.fn().mockResolvedValue(undefined);
        result = await accountCache.getAccount(handle);
      });

      it("shouldn't call identity api", () => {
        expect(identityApi.fetchAccount).toHaveBeenCalledTimes(0);
      });

      it('should return user account', () => {
        expect(result).toEqual(userAccount);
      });
    });

    describe('If Account exists in db and timeToLive expired', () => {
      const identityApi = new IdentityApi({ apiKey: 'key', apiUrl: 'url' });
      const accountCache = new AccountCache(identityApi);

      let result: Account;

      const SOME_AMOUNT_OF_TIME = 1800e3;

      const handle = datatype.uuid();
      const dbUserAccount = createAccountMock({ handle, timeToLive: new Date(Date.now() - SOME_AMOUNT_OF_TIME) });

      const identityUserAccount = createAccountMock({ handle });

      const accountRepoMock: any = {
        find: jest.fn().mockResolvedValue(dbUserAccount),
        save: jest.fn().mockResolvedValue({
          handle: identityUserAccount.handle,
          firstName: identityUserAccount.firstName,
          lastName: identityUserAccount.lastName,
          email: identityUserAccount.email,
          accountClosed: identityUserAccount.accountClosed,
          accountRemoved: false
        })
      };

      beforeEach(async () => {
        accountCache.getRepo = jest.fn().mockImplementation(() => accountRepoMock);
        identityApi.fetchAccount = jest.fn().mockResolvedValue(identityUserAccount);
        result = await accountCache.getAccount(handle);
      });

      it('should call identity api', () => {
        expect(identityApi.fetchAccount).toHaveBeenCalled();
      });

      it('should return user account', () => {
        expect(result).toEqual({
          handle: identityUserAccount.handle,
          firstName: identityUserAccount.firstName,
          lastName: identityUserAccount.lastName,
          email: identityUserAccount.email,
          accountClosed: identityUserAccount.accountClosed,
          accountRemoved: false
        });
      });
    });
  });
});