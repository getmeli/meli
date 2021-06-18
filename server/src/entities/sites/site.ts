import { alternatives, array, boolean, object, string } from 'joi';
import { isCertificate } from '../../commons/validators/is-certificate';
import { isRsaPrivateKey } from '../../commons/validators/is-rsa-private-key';
import { ARRAY_MAX, COLOR_PATTERN, STRING_MAX_LENGTH, SUBDOMAIN_PATTERN } from '../../constants';
import { AppDb } from '../../db/db';
import { Branch } from './branch';
import { Password } from './password';
import { StoredFile } from '../../storage/store-file';
import { $header, Header } from './header';

export interface SiteToken {
  _id: string;
  name: string;
  value: string;
  createdAt: Date;
}

export interface SiteDomain {
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
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
  color: string;
  logo?: StoredFile;
  name: string;
  mainBranch?: string;
  domains: SiteDomain[];
  branches: Branch[];
  tokens: SiteToken[];
  hooks: string[];
  spa?: boolean;
  password?: Password;
  headers?: Header[];
}

export const Sites = () => AppDb.db.collection<Site>('sites');

export const $siteName = string().required().max(STRING_MAX_LENGTH).regex(SUBDOMAIN_PATTERN);

export const $acmeSslConfiguration = object<AcmeSslConfiguration>({
  type: string().equal('acme').required(),
});

export const $manualSslConfiguration = object<ManualSslConfiguration>({
  type: string().equal('manual').required(),
  fullchain: string().custom(isCertificate).min(1).required(),
  privateKey: string().custom(isRsaPrivateKey).min(1).required(),
});

export const $siteDomain = object({
  name: string().required().min(2).max(STRING_MAX_LENGTH),
  sslConfiguration: alternatives([
    $acmeSslConfiguration,
    $manualSslConfiguration,
  ]),
  exposeBranches: boolean().optional().default(false),
});

export const $site = object<Site>({
  name: $siteName,
  color: string().required().regex(COLOR_PATTERN),
  mainBranch: string()
    .optional().empty('').empty(null)
    .max(STRING_MAX_LENGTH),
  domains: array().min(0).max(ARRAY_MAX).optional()
    .default([])
    .items($siteDomain),
  spa: boolean().optional().default(false),
  headers: array().min(0).max(ARRAY_MAX).optional()
    .default([])
    .items($header),
});
