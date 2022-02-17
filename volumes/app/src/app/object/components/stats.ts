import {IComponentStats} from "../../sharedScript/interfaces";

export class Stats implements IComponentStats {

  attack: number;
  speed: number;
  power: number;
  critical: number;
  criticalDamage: number;
  dodge: number;
  touch: number;

  constructor(attack, power, speed) {
    if (attack === 0 && power === 0 && speed === 0) {
      this.attack = 0;
      this.speed = 0;
      this.power = 0;
      this.critical = 0;
      this.criticalDamage = 0;
      this.dodge = 0;
      this.touch = 0;
    } else {
      this.attack = attack;
      this.speed = speed;
      this.power = power;
      this.critical = 10;
      this.criticalDamage = 1.5;
      this.dodge = 8;
      this.touch = 0;
    }
  }
}
