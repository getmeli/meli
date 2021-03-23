import { allowedHosts } from './allowed-hosts';
import { promises } from 'dns';

describe('allowedHosts', () => {

  afterEach(() => jest.restoreAllMocks());

  it('should return empty ip list when url IP is restricted', async () => {
    const spy = jest.spyOn(promises, 'resolve').mockReturnValue(Promise.resolve(['10.0.1.0']));
    const res = await allowedHosts(
      'https://10.0.1.0:1234/admin',
      ['10.0.0.0/16'],
      [],
    );
    expect(res).toEqual({ host: '10.0.1.0', ips: [] });
    expect(spy).not.toHaveBeenCalled();
  });

  it('should return empty ip list when url domain is restricted', async () => {
    const spy = jest.spyOn(promises, 'resolve');
    const res = await allowedHosts(
      'https://my.domain:1234/admin',
      [],
      ['my.doma.*'],
    );
    expect(res).toEqual({ host: 'my.domain', ips: [] });
    expect(spy).not.toHaveBeenCalled();
  });

  it('should return empty ip list when url resolves to restricted ip', async () => {
    const spy = jest.spyOn(promises, 'resolve').mockReturnValue(Promise.resolve(['10.0.1.0']));
    const res = await allowedHosts(
      'https://my.domain:1234/admin',
      ['10.0.0.0/16'],
      [],
    );
    expect(res).toEqual({ host: 'my.domain', ips: [] });
    expect(spy).toHaveBeenCalledWith('my.domain');
  });

  it('should return host and ips when IP not restricted', async () => {
    const spy = jest.spyOn(promises, 'resolve').mockReturnValue(Promise.resolve(['1.0.1.0']));
    const res = await allowedHosts(
      'https://my.other.domain:1234/admin',
      ['10.0.0.0/16'],
      ['my.doma.*'],
    );
    expect(res).toEqual({ host: 'my.other.domain', ips: ['1.0.1.0'] });
    expect(spy).toHaveBeenCalledWith('my.other.domain');
  });

  it('should return host and ips when domain not restricted and does not resolve to restricted IP', async () => {
    const spy = jest.spyOn(promises, 'resolve');
    const res = await allowedHosts(
      'https://1.0.1.0:1234/admin',
      ['10.0.0.0/16'],
      ['my.doma.*'],
    );
    expect(res).toEqual({ host: '1.0.1.0', ips: ['1.0.1.0'] });
    expect(spy).not.toHaveBeenCalled();
  });

});
