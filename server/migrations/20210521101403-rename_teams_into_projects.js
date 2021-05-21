const API_SCOPES = {
  team_list: 'project_list',
  team_create: 'project_create',
  team_read: 'project_read',
  team_update: 'project_update',
  team_delete: 'project_delete',
  'team.team_logo_set': 'project.project_logo_set',
  'team.team_logo_remove': 'project.project_logo_remove',
  'team.team_logo_get': 'project.project_logo_get',
  'team.team_member_list': 'project.project_member_list',
  'team.team_member_add': 'project.project_member_add',
  'team.team_member_delete': 'project.project_member_dele',
  'team.team_sites_list': 'project.project_sites_list',
  'team.team_sites_add': 'project.project_sites_add',
  'team.team_hook_list': 'project.project_hook_list',
  'team.team_hook_create': 'project.project_hook_create',
  'team.team_hook_read': 'project.project_hook_read',
  'team.team_hook_update': 'project.project_hook_update',
  'team.team_hook_delete': 'project.project_hook_delete',
};

const EVENT_TYPES = {
  team_added: 'project_added',
  team_updated: 'project_updated',
  team_deleted: 'project_deleted',
  team_logo_set: 'project_logo_set',
  team_logo_removed: 'project_logo_removed',
  team_member_added: 'project_member_added',
  team_member_deleted: 'project_member_deleted',
  team_hook_created: 'project_hook_created',
  team_hook_updated: 'project_hook_updated',
  team_hook_deleted: 'project_hook_deleted',
};

function invertKeyValues(object) {
  return Object.fromEntries(
    Object.entries(object)
      .map(([key, value]) => [value, key]),
  );
}

async function ifCollectionExists(db, name, callback) {
  const collections = await db.listCollections().toArray();
  if (collections.some(collection => collection.name === name)) {
    await callback();
  }
}

async function mapStringArrays(db, collectionName, property, mapping) {
  await ifCollectionExists(db, collectionName, async () => {
    const collection = db.collection(collectionName);
    const array = await collection.find({
      [property]: {
        $in: Object.keys(mapping),
      },
    }).toArray();

    const promises = array.map(document => {
      document[property] = document[property].map(element => mapping[element] || element);

      return collection.save(document);
    });

    await Promise.all(promises);
  });
}

async function renameApiScopesInTokens(db, rollback = false) {
  const mapping = rollback ? invertKeyValues(API_SCOPES) : API_SCOPES;
  await mapStringArrays(db, 'api-tokens', 'scopes', mapping);
}

async function renameEventsInHooks(db, rollback = false) {
  const mapping = rollback ? invertKeyValues(EVENT_TYPES) : EVENT_TYPES;
  await mapStringArrays(db, 'hook', 'events', mapping);
}

module.exports = {
  async up(db, client) {
    await ifCollectionExists(db, 'teams', async () => {
      await db.collection('teams').rename('projects');
    });
    await ifCollectionExists(db, 'sites', async () => {
      await db.collection('sites').updateMany({}, {
        $rename: {
          teamId: 'projectId',
        },
      });
    });
    await renameApiScopesInTokens(db);
    await renameEventsInHooks(db);
  },

  async down(db, client) {
    await ifCollectionExists(db, 'projects', async () => {
      await db.collection('projects').rename('teams');
    });
    await ifCollectionExists(db, 'sites', async () => {
      await db.collection('sites').updateMany({}, {
        $rename: {
          projectId: 'teamId',
        },
      });
    });
    await renameApiScopesInTokens(db, true);
    await renameEventsInHooks(db, true);
  },
};
