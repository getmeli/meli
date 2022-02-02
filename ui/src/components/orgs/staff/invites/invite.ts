export interface Invite {
  _id: string;
  email: string;
  expiresAt: Date;
  url: string;
  memberOptions: {
    admin: boolean;
  };
}
