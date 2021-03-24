import { Org } from '../orgs/org';

export interface UserOrg {
  org: Org;
  member: {
    userId: string;
    admin: boolean;
  };
}
