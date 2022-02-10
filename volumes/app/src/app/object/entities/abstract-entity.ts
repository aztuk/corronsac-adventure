import {generateUID} from '../../sharedScript/helpers';
import {IEntity} from '../../sharedScript/interfaces';

export class AbstractEntity implements IEntity {
  public id: string;

  constructor() {
    this.id = generateUID();
  }
}
