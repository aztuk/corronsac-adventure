import {CombatQueueService} from '../../../services/combat-queue.service';
import {Component, HostBinding, Input, OnDestroy, OnInit} from '@angular/core';
import {IEntityActor} from '../../../sharedScript/interfaces';

@Component({
  selector: 'civ-item-characters',
  templateUrl: './item-characters.component.html',
  styleUrls: ['./item-characters.component.scss']
})
export class ItemCharactersComponent implements OnInit, OnDestroy {

  @Input() character: IEntityActor;
  @Input() isTarget: boolean;

  @HostBinding('class.target') get isTarget$() {
    return this.isTarget;
  }
  @HostBinding('class.dead') get isDead() {
    return this.character.health.isDead;
  }
  @HostBinding('class.possessed') get possessed() {
    return this.character.possessed;
  }

  public queue;
  public played = 0;
  public currentTurn;
  public speedBuffs;

  public queueSub;
  public turnSub;

  constructor(private queueService: CombatQueueService) {
  }

  ngOnInit(): void {
    this.queueSub = this.queueService.queue$.subscribe((q) => this.queue = q);
    this.turnSub = this.queueService.currentTurn$.subscribe((c) => this.currentTurn = c);
  }


  ngOnDestroy(): void {
    this.queueSub.unsubscribe()
    this.turnSub.unsubscribe()
  }


  getTurnProgress() {
    let newProgress = this.queue.find((i) => i.actor.id === this.character.id).played * this.character.stats.speed;
    return this.currentTurn - newProgress;
  }

  getNextTurn() {
    let newMax = this.queue.find((i) => i.actor.id === this.character.id).played * this.character.stats.speed;
    return this.queue.find((i) => i.actor.id === this.character.id).nextTurn - newMax;
  }

}
