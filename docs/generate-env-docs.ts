/*
 * npx ts-node ./scripts/generate-env-docs.ts > env.md
 *
 * TODO create env-description.ts file with:
 *  const descriptions: { [varName in keyof EnvSpec<Env>]: string } = {...};
 *  This way, descriptions will not be included in the bundle but we can
 *  still generate the env reference docs.
 */

import { envSpec } from '../src/env/env-spec';

interface Entry {
  name: string;
  type: string;
  required: boolean;
  default: string;
  description: string;
}

const entries: Entry[] = Object.entries(envSpec).map(([varName, { schema }]) => {
  return {
    name: varName,
    type: schema.type,
    default: schema._flags.default + '',
    required: schema._flags.presence !== 'optional',
    description: schema._flags.description,
  }
});

entries.forEach(entry => {
  console.log(`## ${entry.name.replace(/_/g, '\\_')}

**Default**: ${entry.default || 'none'}

**Required**: ${entry.required ? 'yes' : 'no'}

**Type**: ${entry.type}

**Description**:

${entry.description ? `${entry.description}` : ''}
`);
});
