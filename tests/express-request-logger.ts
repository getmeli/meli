import { Request, Response } from 'express';
import { appendFileSync } from 'fs';

const outputFile = './express-requests.json';

function getRequestObject(req: Request) {
  const { headers, query, params, body, path, url } = req;
  return {
    date: new Date(),
    url,
    path,
    headers,
    query,
    params,
    body,
  };
}

function getResponseObject(res: Response, body: string) {
  return {
    date: new Date(),
    headers: res.getHeaders(),
    body,
  };
}

export function expressRequestLogger(req, res, next) {
  const oldWrite = res.write;
  const oldEnd = res.end;

  const chunks = [];

  res.write = function (chunk) {
    chunks.push(chunk);
    return oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk) {
      chunks.push(chunk);
    }

    const body = Buffer
      .concat(
        chunks.map(x => (typeof (x) === 'string' ? Buffer.from(x, 'binary') : x)),
      )
      .toString('utf8');

    const request = getRequestObject(req);
    const response = getResponseObject(res, body);
    appendFileSync(outputFile, `${JSON.stringify({
      request,
      response,
    })}\n`);

    oldEnd.apply(res, arguments);
  };

  next();
}
