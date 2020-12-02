import { params } from '../../../commons/express-joi/params';
import { object } from 'joi';
import { $id } from '../../../utils/id';
import { guard } from '../../../commons/express/guard';
import { getUser } from '../../../auth/utils/get-user';
import { ApiTokens } from '../api-token';

export const canAdminApiToken = [
  params(object({
    apiTokenId: $id,
  })),
  guard(
    async req => {
      const { apiTokenId } = req.params;
      const user = getUser(req);
      const count = await ApiTokens().countDocuments({
        _id: apiTokenId,
        userId: user._id,
      }, {
        limit: 1,
      });
      return count === 1;
    },
    'Cannot admin api token',
  ),
];
