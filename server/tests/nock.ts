import nock from 'nock';
import { appendFileSync } from 'fs';

console.log('Starting nock recordings');

const fileName = './requests.json';

nock.recorder.rec({
  output_objects: true,
  enable_reqheaders_recording: true,
  use_separator: false,
  logging: content => {
    appendFileSync(fileName, `${JSON.stringify(content)}\n`);
  },
});
