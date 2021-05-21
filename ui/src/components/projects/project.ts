export interface Project {
  _id: string;
  orgId: string;
  name: string;
  color: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}
