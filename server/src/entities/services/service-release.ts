import { AppDb } from '../../db/db';

export interface ServiceRelease {
  _id: string;
  serviceId: string;
  name: string;
  date: Date;
  branches: string[];
}

export const ServiceReleases = () => AppDb.db.collection<ServiceRelease>('service-releases');
