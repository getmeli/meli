import { Branch } from './branches/branch';
import { Header } from './branches/header';

export interface SiteDomain {
  _id: string;
  name: string;
  sslConfiguration: SslConfiguration;
  exposeBranches?: boolean;
}

export type SslConfiguration =
  AcmeSslConfiguration
  | ManualSslConfiguration;

export interface AcmeSslConfiguration {
  type: 'acme';
}

export interface ManualSslConfiguration {
  type: 'manual';
  fullchain: string; // cert + chain
  privateKey: string;
}

export interface Site {
  _id: string;
  teamId: string;
  name: string;
  color: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
  mainBranch: string;
  domains: SiteDomain[];
  branches: Branch[];
  url: string;
  hasPassword: boolean;
  headers: Header[];
}
