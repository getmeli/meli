export interface Invite {
  _id: string;
  email: string;
  expiresAt: Date;
  memberOptions: {
    admin: boolean;
  };
}
