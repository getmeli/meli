import { ARRAY_MAX, COLOR_PATTERN, STRING_MAX_LENGTH, SUBDOMAIN_PATTERN } from '../../constants';
import { AppDb } from '../../db/db';
import { $siteDomain, SiteDomain, SiteToken } from '../sites/site';
import { array, object, string } from 'joi';

export interface ServiceBranch {
  _id: string;
  name: string;
  slug: string;
  release?: string;
}

export interface Service {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
  color: string;
  name: string;
  mainBranch?: string;
  domains: SiteDomain[];
  branches: ServiceBranch[];
  tokens: SiteToken[];
  hooks: string[];
}

export const Services = () => AppDb.db.collection<Service>('services');

export const $serviceName = string().required().max(STRING_MAX_LENGTH).regex(SUBDOMAIN_PATTERN);

export const $service = object<Service>({
  name: $serviceName,
  color: string().required().regex(COLOR_PATTERN),
  mainBranch: string()
    .optional().empty('').empty(null)
    .max(STRING_MAX_LENGTH),
  domains: array().min(0).max(ARRAY_MAX).optional()
    .default([])
    .items($siteDomain),
});
