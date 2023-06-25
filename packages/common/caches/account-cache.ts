
import IdentityApi from '../api-wrappers/identity';
import { Account } from '../database/models';
import accountRepo from '../database/repositories-orm/account';


export default class AccountCache {
  private identityApiClient: IdentityApi;

  constructor(identityApiClient: IdentityApi) {
    this.identityApiClient = identityApiClient;
  }

  getRepo = () => accountRepo();

  saveAccount = async (account: Partial<Account>): Promise<any> => {
    return this.getRepo().save(account);
  };

  getAccount = async (handle: string): Promise<any> => {
    const accountFromCache = await this.getRepo().find(handle);

    if (accountFromCache && accountFromCache.timeToLive && new Date(accountFromCache.timeToLive) > new Date()) {
      return accountFromCache;
    }

    const fetchedAccount = await this.identityApiClient.fetchAccount(handle);
    const hour = 3600e3;

    return this.getRepo().save({ ...fetchedAccount, timeToLive: new Date(Date.now() + hour) });
  };
}