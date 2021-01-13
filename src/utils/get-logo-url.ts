import { env } from '../env/env';
import { StoredFile } from '../storage/store-file';
import qs from 'qs';

interface EntityWithLogo {
  _id: string;
  logo?: StoredFile;
}

export function getLogoUrl(context: string, entity: EntityWithLogo, extraQueryParams?: { [key: string]: string }): string | undefined {
  const query = qs.stringify({
    ...extraQueryParams,
    // force cache refresh in frontend
    id: entity.logo.id,
  });
  return entity.logo ? `${env.MELI_URL}/api/v1/${context}/${entity._id}/logo?${query}` : undefined;
}
