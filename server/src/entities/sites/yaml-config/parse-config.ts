import { promises } from 'fs';
import { parse } from 'yaml';
import { Logger } from '../../../commons/logger/logger';
import { $meliConfig, SiteConfig } from './site-config';
import { JOI_OPTIONS } from '../../../constants';
import { BadRequestError } from '../../../commons/errors/bad-request-error';

const logger = new Logger('app:parseConfig');

export async function parseConfig(releaseDir: string): Promise<SiteConfig> {
  let buffer: Buffer;
  try {
    buffer = await promises.readFile(`${releaseDir}/.meli.yml`);
  } catch (e) {
    logger.debug(e);
    return undefined;
  }

  let parsed: string;
  try {
    parsed = parse(buffer.toString());
  } catch (e) {
    throw new BadRequestError(`Failed to parse .meli.yml: ${e.message}`);
  }

  logger.debug('yaml', parsed);

  try {
    return await $meliConfig.validateAsync(parsed, JOI_OPTIONS);
  } catch (e) {
    throw new BadRequestError('Invalid .meli.yml', e.details);
  }
}
