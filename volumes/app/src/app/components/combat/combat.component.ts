import { LootComponent } from './../panels/loot/loot.component';
import { ComponentFactoryService } from './../../services/component-factory.service';
import {MapService} from '../../services/map.service';
import {Heal} from '../../object/system/heal';
import {Damage} from '../../object/system/damage';
import {DamageAnimationDirective} from '../../directive/damage-animation.directive';
import {DamageDisplayDirective} from '../../directive/damage-display.directive';
import {CombatQueueService} from '../../services/combat-queue.service';
import {CombatService} from '../../services/combat.service';
import {ICombatLogItem, IEntityActor, ISystemCast, ISystemDamage, ISystemHeal} from '../../sharedScript/interfaces';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {ECombatState, EDamageType, ELevelType} from '../../sharedScript/enums';
import {exists, getRandomInArray} from '../../sharedScript/helpers';
import {CharactersService} from '../../services/characters.service';
import {Router} from '@angular/router';
import {SpellCast} from "../../object/system/spellCast";
import { ScoreService } from '../../services/score.service';

@Component({
  selector: 'civ-combat',
  templateUrl: './combat.component.html',
  styleUrls: ['./combat.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class CombatComponent implements OnInit, OnDestroy {

  @ViewChild('lootContainer', { read: ViewContainerRef }) lootContainer;
  @ViewChildren(DamageDisplayDirective) actorCards!: QueryList<DamageDisplayDirective>;
  @ViewChildren(DamageAnimationDirective) animatedActors!: QueryList<DamageAnimationDirective>;
  public container: ComponentRef<any>;

  public actors: Array<IEntityActor>;
  public actorTurn: IEntityActor;
  public target: IEntityActor;

  public combatLog: ICombatLogItem[] = [];

  public damageAnimationInstance: ISystemDamage;

  public mode$ = ECombatState.BEGIN;
  public actorSubscription;

  constructor(private scoreService: ScoreService, private queue: CombatQueueService, private combatService: CombatService, private _router: Router, private ms: MapService, private cs: CharactersService, private cfs: ComponentFactoryService) {

  }

  // STATE MACHINE
  get mode(): ECombatState {
    return this.mode$;
  }

  set mode(value) {
    this.mode$ = value;
    if (value === ECombatState.WIN) {
      this.getLoot();
    }
    if (value === ECombatState.WAITING) {
      this.selectNextActorTurn();
    }
    if (value === ECombatState.AI_TURN) {
      this.launchAiAttack();
    }
  }

  ngOnInit(): void {
    this.ms.antiCheat([ELevelType.COMBAT_TIER_1, ELevelType.COMBAT_TIER_2, ELevelType.COMBAT_TIER_3]);
    this.actorSubscription = this.combatService.actors$.subscribe((actors) => this.actors = actors);
    this.combatService.initCombat(this.ms.currentLevel);
    this.queue.createQueue(this.actors);
  }

  ngOnDestroy(): void {
    this.actorSubscription.unsubscribe();
  }

  beginCombat(): void {
    if (this.mode === ECombatState.BEGIN) {
      this.mode = ECombatState.WAITING;
    }
  }


  // WAITING
  selectNextActorTurn(): void {
    if(this.cs.isPartyDead()){
      this._router.navigate(['end']);
    }
    this.setTarget(this.target);
    this.queue.findNextActorTurn((nextActor) => {
      this.actorTurn = nextActor;
      this.actorTurn.runCooldowns();
      const timeout = (this.actorTurn.possessed) ? 1 : 1000;
      setTimeout(() => {
        this.applyDamages(this.actorTurn.runDots());
        this.setCombatMode();
      }, timeout);
    });
  }

  // AI_TURN
  launchAiAttack(): void {
    this.abstractTurn(this.combatService.aiTurn(this.actorTurn));
  }

  // PLAYER_TURN
  endPlayerTurn(spell: SpellCast): void {
    this.abstractTurn(spell);
  }

  abstractTurn(spell: SpellCast): void {
    this.populateLog(spell);
    this.invoke(spell.invocations);
    this.applyHeals(spell.heals);
    this.applyDamages(spell.damages);
    this.setCombatMode();
  }

  invoke(newActors: IEntityActor[]): void {
    (newActors ?? []).forEach((a) => {
      this.actors.push(a);
      this.queue.addActor(a);
    });
  }

  applyDamages(damages: ISystemDamage[]): void {
    (damages ?? []).forEach((d, i) => {
      if (d.applyDamage()) {
        this.queue.removeActorFromQueue(d.target);
      }
      this.animateActor(d);
      this.createDamageView(d);
    });
  }

  applyHeals(heals: ISystemHeal[]): void {
    (heals ?? []).forEach((h) => {
      h.applyHeal();
      this.animateActor(h);
      this.createDamageView(h);
    });
  }

  populateLog(spell): void {
    this.combatLog.unshift({actor: this.actorTurn, spell: spell});
  }

  animateActor(cast: ISystemCast): void {
    let actors: DamageAnimationDirective[] = this.animatedActors.toArray();
    let caster: DamageAnimationDirective = actors.find((c) => c.id === cast.caster.id);
    let target: DamageAnimationDirective = actors.find((c) => c.id === cast.target.id);
    if (cast instanceof Damage) {
      if(cast.damageType !== EDamageType.DOT){
        caster.animateHit(cast);
      }
      target.animateHurt(cast);
    }
    if (cast instanceof Heal) {
      caster.animateHealing();
      target.animateHealed();
    }
  }

  createDamageView(damage) {
    let cards: DamageDisplayDirective[] = this.actorCards.toArray();
    let targetCard: DamageDisplayDirective = cards.find((c) => c.id === damage.target.id);
    targetCard.displayDamage(damage);
  }

  setCombatMode() {
    // CHECK WIN
    if (this.combatService.isCombatWin()) {
      this.mode = ECombatState.WIN;
      return;
    }

    // WAITING
    if (this.mode === ECombatState.AI_TURN || this.mode === ECombatState.PLAYER_TURN) {
      this.mode = ECombatState.WAITING;
      return;
    }

    if (this.actorTurn.isIncapacitated()) {
      this.mode = ECombatState.WAITING;
      this.actorTurn.runCooldowns();
      return;
    }

    // AI
    if (!this.actorTurn.possessed) {
      this.mode = ECombatState.AI_TURN;
      return;
      // PLAYER
    } else {
      this.mode = ECombatState.PLAYER_TURN;
      return;
    }
  }

  // LOST
  getLoot() {
    setTimeout(() => {
      if(this.ms.currentLevel.type === ELevelType.COMBAT_TIER_1) {
        this._router.navigate(['loot']);
      } else if(this.ms.currentLevel.type === ELevelType.COMBAT_TIER_2){
        this._router.navigate(['treasure']);
      } else if(this.ms.currentLevel.type === ELevelType.COMBAT_TIER_3) {
        this.ms.finished();
        this._router.navigate(['end']);
      }

    },
    1000);
  }

  getAllies() {
    return this.combatService.getAllies();
  }

  getEnemies() {
    return this.combatService.getEnemies();
  }

  setTarget(target) {
    let validTargets = this.combatService.getTargetableAi();

    if (!exists(this.target)) {
      this.target = getRandomInArray(validTargets);
    } else if (validTargets.some(t => t.id === target.id)) {
      this.target = target;
    } else {
      this.target = getRandomInArray(validTargets);
    }
  }

}
