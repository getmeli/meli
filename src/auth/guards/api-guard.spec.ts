import { apiGuard } from './api-guard';
import { ApiScope } from '../../entities/api/api-scope';
import { ForbiddenError } from '../../commons/errors/forbidden-error';

describe('apiGuard', () => {

  // afterEach(() => jest.restoreAllMocks());

  it('should send forbidden error when scope not in api token', async () => {
    const guard = apiGuard(ApiScope.org_logo_remove);
    const next = jest.fn();

    guard(
      <any>{
        apiToken: {
          scopes: [],
        },
      },
      null,
      next,
    );

    expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
  });

  it('should be okay when no api token', async () => {
    const guard = apiGuard(ApiScope.org_logo_remove);
    const next = jest.fn();

    guard(
      <any>{},
      null,
      next,
    );

    expect(next).toHaveBeenCalledWith();
  });

  it('should be ok when api token has scopes', async () => {
    const guard = apiGuard(ApiScope.org_logo_remove);
    const next = jest.fn();

    guard(
      <any>{
        apiToken: {
          scopes: [ApiScope.org_logo_remove],
        },
      },
      null,
      next,
    );

    expect(next).toHaveBeenCalledWith();
  });

});
