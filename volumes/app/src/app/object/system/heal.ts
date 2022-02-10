import {IEntityActor, ISystemHeal} from "../../sharedScript/interfaces";

export class Heal implements ISystemHeal {

  public target: IEntityActor;
  public caster: IEntityActor;
  public heal: number;

  constructor(caster: IEntityActor, target: IEntityActor, amount: number) {
    this.target = target;
    this.caster = caster;
    this.setHeal(amount);
  }

  applyHeal(): void {
    this.target.health.heal(this.heal);
  }

  private setHeal(amount: number) {
    this.heal = this.caster.health.max * amount;
  }
}
