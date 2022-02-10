import {IComponentResource} from "../../sharedScript/interfaces";

export class Resource implements IComponentResource {

  name: string
  current: number
  max: number
  regen: number
  canRegen: boolean = true;

  constructor(name, max, regen) {
    this.name = name;
    this.current = max;
    this.max = max;
    this.regen = regen;
  }

}
