import {EClass, EDamageType, EEffects, ELevelType} from '../sharedScript/enums';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'effectName'
})
export class EffectNamePipe implements PipeTransform {

  transform(value: EEffects): string {
    switch (value) {
      case EEffects.POISON:
        return 'Poison';
      case EEffects.STUN:
        return 'Etourdit';
      case EEffects.UP_CRIT_DMG:
        return 'Dégâts critiques augmentés';
      case EEffects.UP_CRIT:
        return 'Chance de critiques augmentées';
      case EEffects.UP_DODGE:
        return 'Esquive augmentée';
      case EEffects.UP_AP:
        return 'Puissance augmentée';
      case EEffects.DOWN_AP:
        return 'Puissance réduite';
      case EEffects.UP_AD:
        return 'Attaque augmentée';
      case EEffects.DOWN_AD:
        return 'Attaque réduite';
      case EEffects.TAUNT:
        return 'Provocation';
      case EEffects.DOWN_DODGE:
        return 'Esquive réduite';
      default:
        return 'Un effet';
    }
  }

}

@Pipe({
  name: 'damageType'
})
export class DamageTypePipe implements PipeTransform {

  transform(value: EDamageType): string {
    switch (value) {
      case EDamageType.MAGIC:
        return 'magical';
      case EDamageType.PHYSIC:
        return 'physical';
    }
  }

}

@Pipe({
  name: 'specialtyName'
})
export class SpecialtyNamePipe implements PipeTransform {

  transform(value: EClass): string {
    switch (value) {
      case EClass.COMBATTANT:
        return 'Front lisse';
      case EClass.INVOCATION:
        return 'Invocation';
      case EClass.MAGE:
        return 'Rageux';
      case EClass.SUPPORT:
        return 'Gentillet';
      case EClass.TANK:
        return 'Costaud';
    }
  }

}


@Pipe({
  name: 'nodeType'
})
export class NodeTypePipe implements PipeTransform {

  transform(value: ELevelType): string {
    switch (value) {
      case ELevelType.COMBAT_TIER_1:
        return 'Combat';
      case ELevelType.COMBAT_TIER_2:
        return 'Nemesis';
      case ELevelType.COMBAT_TIER_3:
        return 'Boss';
      case ELevelType.HEAL:
        return 'Apéro';
      case ELevelType.TREASURE:
        return 'Trésor';
      case ELevelType.SHOP:
        return 'Boutique';
      case ELevelType.EVENT:
        return '???';
    }
  }

}
