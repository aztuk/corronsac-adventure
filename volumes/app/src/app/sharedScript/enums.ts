export enum EClass {
  'SUPPORT',
  'MAGE',
  'COMBATTANT',
  'TANK',
  'INVOCATION',
  'TIER_1',
  'TIER_2',
  'TIER_3',
}

export enum EEffects {
  'POISON' = 'POISON',
  'STUN' = 'STUN',
  'TAUNT' = 'TAUNT',
  'UP_AP' = 'UP_AP',
  'DOWN_AP' = 'DOWN_AP',
  'UP_AD' = 'UP_AD',
  'DOWN_AD' = 'DOWN_AD',
  'UP_CRIT_DMG' = 'UP_CRIT_DMG',
  'UP_CRIT' = 'UP_CRIT',
  'UP_DODGE' = 'UP_DODGE',
  'DOWN_DODGE' = 'DOWN_DODGE'
}

export enum EAttackStatus {
  'HIT' = 'Touché',
  'CRITICAL' = 'Critique',
  'DODGED' = 'Raté'
}

export enum EDamageType {
  'MAGIC',
  'PHYSIC'
}

export enum ECombatState {
  'WAITING',
  'AI_TURN',
  'PLAYER_TURN',
  'LOST',
  'WIN',
  'BEGIN'
}

export enum ETargetTypes {
  'SELF' = 'SELF',
  'ALL_ENEMIES' = 'ALL_ENEMIES',
  'ALL_ALLIES' = 'ALL_ALLIES',
  'TARGET' = 'TARGET',
  'RANDOM_ENEMY' = 'RANDOM_ENEMY',
  'RANDOM_ALLY' = 'RANDOM_ALLY',
}

export enum ELevelType {
  'COMBAT_TIER_1',
  'COMBAT_TIER_2',
  'COMBAT_TIER_3',
  'HEAL',
  'TREASURE',
  'SHOP',
  'EVENT'
}

export enum EHero {
  'CLEMENT' = 'Clément',
  'KEVIN' = 'Kévin',
  'COSTY' = 'Costy',
  'LOIC' = 'Loïc',
  'QUENTIN' = 'Quentin',
  'ADRIEN' = 'Adrien',
}

export enum ELootType {
  'GOLD',
  'CHARACTER',
  'EQUIPMENT',
  'SPELL'
}
