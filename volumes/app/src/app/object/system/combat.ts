import {ELevelType} from "../../sharedScript/enums";
import {generateUID} from "../../sharedScript/helpers";
import {ICombat, IEntityActor} from "../../sharedScript/interfaces";

export class Combat implements ICombat {

  id: string;
  floor: number;
  unlocked: boolean = false;
  done: boolean = false;
  type: ELevelType;
  enemies?: IEntityActor[];
  parents: string[] = [];
  children: string[] = [];

  constructor(floor: number) {
    this.id = generateUID();
    this.floor = floor;
  }

}
