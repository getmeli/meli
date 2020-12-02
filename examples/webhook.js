require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const createHmac = require('crypto').createHmac;

function signBody(payload, secret) {
  return createHmac('sha256', secret)
    .update(payload)
    .digest()
    .toString('hex');
}

function verifyWebhookSignature(req, secret) {
  const signature = req.header('X-Webhook-Signature');
  const { rawBody } = req;
  if (!signature || !rawBody || !Buffer.isBuffer(rawBody)) {
    return false;
  }
  return signBody(rawBody, secret) === signature;
}

const app = express();

app.use(bodyParser.json({
  verify: (req, res, buf) => {
    // for performance, only do this when needed
    if (Buffer.isBuffer(buf) && req.header('X-Webhook-Signature')) {
      // store raw body for signature verification
      req.rawBody = buf;
    }
    return true;
  },
}));

app.post('/', (req, res) => {
  const isValid = verifyWebhookSignature(req, process.env.WEBHOOK_SECRET);

  if (!isValid) {
    res.status(400).send({
      message: 'signature is invalid',
    });
    return;
  }

  res.status(204).send();

  console.log(JSON.stringify(req.body, null, 2));
});

const port = 8000;
app.listen(port, () => console.log(`Listening on ${port}`));
