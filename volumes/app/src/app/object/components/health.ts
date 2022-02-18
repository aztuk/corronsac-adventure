import {IComponentHealth} from '../../sharedScript/interfaces';

export class Health implements IComponentHealth {

  current: number;
  max: number;
  isDead: boolean = false;

  constructor(max) {
    this.current = max;
    this.max = max;
  }

  public hurt(amount): boolean {
    this.current -= amount;

    if (this.current <= 0) {
      //this.current = 0;
      this.isDead = true;
      return true
    }

    return false;
  }

  public heal(amount): void {
    if(!this.isDead) {
      this.current += amount;

      if (this.current >= this.max) {
        this.current = this.max;
      }
    }
  }

  public ressucitate(): void {
    this.current = Math.round(this.max * 0.5);
    this.isDead = false;
  }
 }
