export type AuthProviderType =
  | 'gitlab'
  | 'github'
  | 'gitea'
  | 'google';

export interface AuthProviderUser {
  id: any;
  name: string;
  email: string;
  orgs?: string[];
}

export interface AuthProvider {
  getUser(profile: any): Promise<AuthProviderUser>;
}
