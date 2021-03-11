export interface Invite {
  _id: string;
  token: string;
  email: string;
  expiresAt: Date;
  memberOptions: {
    admin: boolean;
  }
}
