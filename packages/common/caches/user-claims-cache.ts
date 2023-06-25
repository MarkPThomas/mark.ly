import IdentityApi from '../api-wrappers/identity';
import userClaimsRepo from '../database/repositories-orm/user-claims';

export default class UserClaimsCache {
  private identityApiClient: IdentityApi;

  constructor(identityApiClient: IdentityApi) {
    this.identityApiClient = identityApiClient;
  }

  getRepo = () => userClaimsRepo();

  getClaimsByHandle = async (handle: string): Promise<string[]> => {
    const claimsFromCache = await this.getRepo().findOne(handle);

    if (claimsFromCache && claimsFromCache.claims.length > 0) {
      return claimsFromCache.claims;
    }

    const fetchedClaims = await this.identityApiClient.fetchUserClaims(handle);

    await this.getRepo().save({ handle, claims: fetchedClaims, timeToLive: new Date() });

    return fetchedClaims;
  };
}