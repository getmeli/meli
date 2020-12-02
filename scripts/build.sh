npm i
npm run build
rm -rf node_modules
npm ci --production
docker build -t meli/server .
npm i
