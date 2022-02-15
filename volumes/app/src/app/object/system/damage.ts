import { ScoreService } from './../../services/score.service';
import {EAttackStatus, EClass, EDamageType} from '../../sharedScript/enums';
import {IEntityActor, ISystemDamage} from '../../sharedScript/interfaces';
import {dice} from '../../sharedScript/helpers';


export class Damage implements ISystemDamage {

  public damageType: EDamageType;
  public target: IEntityActor;
  public caster: IEntityActor;
  public damage: number;
  public status: EAttackStatus;

  constructor(caster: IEntityActor, target: IEntityActor, type: EDamageType, amount: number) {
    this.damageType = type;
    this.target = target;
    this.caster = caster;
    this.setAttackStatus();
    this.setDamage(amount);
  }

  // TODO Use this instead of hurt() in components
  applyDamage(): boolean {
    if(this.target.health.isDead) {
      return true;
    }
    let score = ScoreService.getInstance();
    const isDead = this.target.health.hurt(this.damage);

    score.setDamageInflicted(this);
    if(this.target.possessed && isDead) {
      score.stats.death ++;
    } else if (!this.target.possessed && isDead) {
      if(this.target.specialty === EClass.TIER_1 || this.target.specialty === EClass.INVOCATION) {
        score.stats.tierOneKilled++;
      }
      if(this.target.specialty === EClass.TIER_2) {
        score.stats.tierTwoKilled++;
      }
      if(this.target.specialty === EClass.TIER_3) {
        score.stats.tierThreeKilled++;
      }
      if(this.target.specialty === EClass.INVOCATION) {
        score.stats.tierOneKilled++;
      }
    }
    return isDead;
  }

  private setAttackStatus() {
    if (this.isDodged()) {
      this.status = EAttackStatus.DODGED;
    } else if (this.isCritical()) {
      this.status = EAttackStatus.CRITICAL;
    } else {
      this.status = EAttackStatus.HIT
    }
  }

  private isDodged() {
    return dice(this.target.stats.dodge - this.caster.stats.touch);
  }

  private isCritical() {
    return dice(this.caster.stats.critical);
  }

  private setDamage(damage) {
    if (this.status === EAttackStatus.DODGED) {
      this.damage = 0;
    }
    if (this.status === EAttackStatus.HIT) {
      this.damage = damage;
    }
    if (this.status === EAttackStatus.CRITICAL) {
      this.damage = damage * this.caster.stats.criticalDamage;
    }
  }

}
