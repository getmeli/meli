const config = {
  // we actually don't use this
  mongodb: {
    url: process.env.MELI_MONGO_URI || 'mongodb://localhost:27017',
    databaseName: process.env.MELI_MONGO_DB || 'meli',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'migrations-log',
};

module.exports = config;
