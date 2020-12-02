const config = {
  // we actually don't use this
  mongodb: {
    url: "mongodb://localhost:27017",
    databaseName: "migrate-test",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog"
};

module.exports = config;
