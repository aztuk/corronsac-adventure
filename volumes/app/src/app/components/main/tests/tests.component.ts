import { EquipmentDescription } from './../../../object/components/equipment-description';
import { SpellCast } from './../../../object/system/spellCast';
import { MapService } from './../../../services/map.service';
import { CombatService } from './../../../services/combat.service';
import { EnemiesService } from './../../../services/enemies.service';
import { CharactersService } from './../../../services/characters.service';
import { ICombat, IEntityActor, ISystemDamage, ISystemHeal } from './../../../sharedScript/interfaces';
import { EHero, ELevelType } from './../../../sharedScript/enums';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { getRandomInArray, objectToArray } from '../../../sharedScript/helpers';
import { Combat } from '../../../object/system/combat';
import { CombatQueueService } from '../../../services/combat-queue.service';

@Component({
  selector: 'civ-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss']
})
export class TestsComponent implements OnInit {

  public selectableHeroes = objectToArray(EHero);
  public heroes: IEntityActor[] = [];

  public floors = new Array(this.map.mapSizeY);
  public enemies: IEntityActor[] = [];
  public level:ICombat;



  constructor(private cs: CharactersService, private es: EnemiesService, private combat: CombatService, private map: MapService, private queue: CombatQueueService) { }

  ngOnInit(): void {
    this.queue.turnTimeout = 1;
    this.combat.actors$.subscribe((c) => this.actorsSimulation= c);
  }



  // HEROES FORM
  addHero(hero) {
    let newHero = this.cs.createCharacterByName(EHero[hero]);
    this.heroes.push(newHero);
  }
  unlockEntity(entity,hero?) {
    entity.unlocked = !entity.unlocked;
    if(entity instanceof EquipmentDescription) {
      entity.giveEquipmentTo(hero);
    }
  }

  // ENEMY FORM
  createLevel(form) {
    this.level = new Combat(form.floor);
    this.level.type = form.type;
    this.enemies = this.es.generateEnemies(this.level);
    this.generateCombat();
  }

  public actorsSimulation: IEntityActor[];
  generateCombat() {
    this.combat.resetCombat();
    this.combat.actors = this.heroes.concat(this.enemies);
    this.queue.createQueue(this.combat.actors);
  }

  // Simulation
  simulateCombat(numberOfCombats) {
      this.nextTurn();
      setTimeout(() => {
        if(!this.checkEndCombat()) {
          this.simulateCombat(numberOfCombats);
        }
      }, 50)
   }

  nextTurn() {
    this.queue.findNextActorTurn((nextActor) => {
      nextActor.runCooldowns();
      this.applyDamages(nextActor.runDots());
      if(!nextActor.isIncapacitated() && !nextActor.health.isDead) {
        this.turn(nextActor);
      }
    });
  }

  checkEndCombat() {
    return this.getAllies().every(a => a.health.isDead) || this.getEnemies().every(a => a.health.isDead);
  }

  turn(actor: IEntityActor) {
    console.log('Turn of ' + actor.name);
    const randomSpell =  getRandomInArray(actor.spells.filter(s => s.unlocked));
    let spellCast:SpellCast = new SpellCast(actor, this.getSpellActors(actor),randomSpell);
    console.log(randomSpell.name);
    this.invoke(spellCast.invocations);
    this.applyHeals(spellCast.heals);
    this.applyDamages(spellCast.damages);
    console.log('------------------');
    console.log('------------------');
  }

  invoke(newActors: IEntityActor[]): void {
    (newActors ?? []).forEach((a) => {
      this.combat.actors.push(a);
      this.queue.addActor(a);
    });
  }

  applyHeals(heals: ISystemHeal[]): void {
    (heals ?? []).forEach((h) => {
      h.applyHeal();
      console.log(h.heal + 'PV healing of ' + h.target.name);
    });
  }

  applyDamages(damages: ISystemDamage[]): void {
    (damages ?? []).forEach((d, i) => {
      if (d.applyDamage()) {
        this.queue.removeActorFromQueue(d.target);
        console.log(d.target.name + ' is dead');
      }
      console.log(d.damage + ' infligé à ' + d.target.name);
    });
  }

  getSpellActors(actor) {
    if(actor.possessed) {
      return {
        allies: this.getAllies(),
        enemies: this.getEnemies(),
        target: getRandomInArray(this.getEnemies())
      }
    } else {
      return {
        allies: this.getEnemies(),
        enemies: this.getAllies(),
        target: getRandomInArray(this.getAllies())
      }
    }
  }


  getAllies() {
    return this.combat.getAllies();
  }

  getEnemies() {
    return this.combat.getEnemies();
  }


}
