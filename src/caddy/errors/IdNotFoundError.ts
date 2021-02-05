import { MeliError } from '../../utils/meli-error';

export class IdNotFoundError extends MeliError {
  constructor(id: string, cause: any) {
    super(`Caddy could not find a config with the id ${id}`, cause);
  }
}
