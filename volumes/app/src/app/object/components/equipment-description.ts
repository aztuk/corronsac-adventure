import { IComponentStats, IEntityActor, IEquipmentDescription } from "../../sharedScript/interfaces";

export class EquipmentDescription  implements IEquipmentDescription {

  public name: string;
  public unlocked$: boolean = false;
  public description: string;
  public stats: IComponentStats
  public health: number;
  public price: number;
  callback: (actor: IEntityActor) => {};

  constructor(description) {
    this.name = description.name;
    this.description = description.description;
    this.health = description.health;
    this.price = description.price;
    this.stats = description.stats();
    this.callback = description.callback;
  }

  giveEquipmentTo(actor: IEntityActor) {
    this.callback(actor);

    this.unlocked$ = true;
  }

  get unlocked() {
    return this.unlocked$;
  }
  set unlocked(value) {
    this.unlocked$ = value;
  }
}
