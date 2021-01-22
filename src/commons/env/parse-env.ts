import { object, Schema } from 'joi';
import { JOI_OPTIONS } from '../../constants';
import { Logger } from '../logger/logger';

const logger = new Logger('meli.api:env.parse');

export interface EnvVarSpec {
  transform?: (val: any) => any;
  schema: Schema;
}

export type EnvSpec<E = any> = { [varName in keyof E]: EnvVarSpec };

export function parseEnv(spec: EnvSpec, processEnv: any = process.env): any {
  // create object from env
  const env = Object.fromEntries(Object
    .entries(spec)
    .map(([envVarName, { transform }]) => {
      const rawValue = processEnv[envVarName];
      const value = transform ? transform(rawValue) : rawValue;
      return [envVarName, value];
    }));

  const schemaKeys = Object.fromEntries(Object
    .entries(spec)
    .map(([name, { schema }]) => [name, schema]));

  const schema = object(schemaKeys).required();

  const { error, value } = schema.validate(env, {
    ...JOI_OPTIONS,
    abortEarly: false,
  });

  if (error) {
    const separator = '\n- ';
    const details = separator + error.details.map(d => d.message).join(separator);
    logger.error(`Invalid environment configuration:${details}`);
    process.exit(1);
  }

  return value;
}
