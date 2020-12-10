import { alternatives, array, object, string } from 'joi';
import { ARRAY_MAX, COLOR_PATTERN, STRING_MAX_LENGTH, SUBDOMAIN_PATTERN } from '../../constants';
import { AppDb } from '../../db/db';
import { Branch } from './branch';

export interface SiteToken {
  _id: string;
  name: string;
  value: string;
  createdAt: Date;
}

export interface SiteDomain {
  name: string;
  sslConfiguration: SslConfiguration;
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
  color: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  mainBranch?: string;
  domains: SiteDomain[];
  branches: Branch[];
  tokens: SiteToken[];
  hooks: string[];
}

export const Sites = () => AppDb.db.collection<Site>('sites');

export function siteSocketRoom(id: string): string {
  return `site.${id}`;
}

export const $siteName = string().required().max(STRING_MAX_LENGTH).regex(SUBDOMAIN_PATTERN);

export const $acmeSslConfiguration = object<AcmeSslConfiguration>({
  type: string().equal('acme').required(),
});
export const $manualSslConfiguration = object<ManualSslConfiguration>({
  type: string().equal('manual').required(),
  fullchain: string().min(1).required(),
  privateKey: string().min(1).required(),
});

export const $siteDomain = object({
  name: string().required().min(2).max(STRING_MAX_LENGTH),
  sslConfiguration: alternatives([
    $acmeSslConfiguration,
    $manualSslConfiguration,
  ]),
});

export const $site = object({
  name: $siteName,
  color: string().required().regex(COLOR_PATTERN),
  mainBranch: string().optional().max(STRING_MAX_LENGTH),
  domains: array().min(0).max(ARRAY_MAX).optional()
    .default([])
    .items($siteDomain),
});
