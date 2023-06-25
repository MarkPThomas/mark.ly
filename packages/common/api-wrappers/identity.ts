import axios, { AxiosInstance } from 'axios';

export interface UserAccount {
  handle: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  accountClosed: boolean;
  additionalEmails: string[];
  lastSignIn: string;
  acceptedTermsOn: string;
  acceptedPrivacyOn: string;
  needsToAcceptTermsAndConditions: boolean;
  createdAt: string;
}

interface IdentityApiConfig {
  apiKey: string;
  apiUrl: string;
}

export interface ValidSession {
  isValid: true;
  id: string;
  handle: string;
  impersonatorHandle: string;
  creationDate: string;
}

export interface InvalidSession {
  isValid: false;
  error: string;
}

export default class IdentityApi {
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private client: AxiosInstance;

  constructor({ apiKey, apiUrl }: IdentityApiConfig) {
    if (!apiUrl) {
      throw new Error('Identity API requires an apiUrl.');
    }

    if (!apiKey) {
      throw new Error('Identity API requires an apiKey');
    }

    this.apiUrl = apiUrl;
    this.apiKey = apiKey;

    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        Authorization: `Token ${this.apiKey}`
      }
    });
  }

  async getSession(sessionId?: string): Promise<ValidSession | InvalidSession> {
    const response = await this.client.get<ValidSession | InvalidSession>(
      `/session/verify?sessionId=${sessionId || ''}`
    );
    return response.data;
  }

  async fetchUserClaims(handle: string): Promise<string[]> {
    const response = await this.client.get<string[]>(`/v2/users/${handle}/claims`);

    return response.data;
  }

  async fetchAccount(handle: string): Promise<UserAccount> {
    const response = await this.client.get<UserAccount>(`/v2/users/${handle}`);

    return response.data;
  }

  async setUserClaim(handle: string, claim: string) {
    const response = await this.client.put(`/v2/users/${handle}/claims/${claim}`);

    return response.data;
  }

  async deleteUserClaim(handle: string, claim: string) {
    const response = await this.client.delete(`/v2/users/${handle}/claims/${claim}`);

    return response.data;
  }
}