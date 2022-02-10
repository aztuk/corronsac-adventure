import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Actor} from "../object/entities/actor";
import {IEntityActor} from "../sharedScript/interfaces";

@Injectable({
  providedIn: 'root'
})
export class CombatQueueService {

  public queue$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public currentTurn$: BehaviorSubject<number> = new BehaviorSubject(0);

  public set currentTurn(value: any) {
    this.currentTurn$.next(value);
  }

  public get currentTurn() {
    return this.currentTurn$.getValue();
  }

  public set queue(value: any) {
    this.queue$.next(value);
  }

  public get queue() {
    return this.queue$.getValue();
  }

  public actorTurn: any;

  private actors: IEntityActor[];

  constructor() {
  }

  createQueue(actors: IEntityActor[]) {
    this.queue = [];
    this.currentTurn = 0;
    this.actors = actors;
    this.actors.filter((a) => !a.health.isDead).forEach(actor => {
      this.addActor(actor);
    });
  }

  addActor(actor: IEntityActor) {
    let nextTurn = actor.stats.speed;
    let played = Math.floor(this.currentTurn / actor.stats.speed);

    if (this.currentTurn > actor.stats.speed) {
      nextTurn *= (played + 1);
    }

    const queueItem = {
      actor: actor,
      nextTurn: nextTurn,
      played: played
    }
    this.queue.push(queueItem);
  }

  findNextActorTurn(_callback) {
    setTimeout(() => {
      let index = this.queue.findIndex((q) => q.nextTurn === this.currentTurn);
      if (index !== -1) {
        _callback(this.queue[index].actor);
        this.spendTurnPlay(index);
        return false;
      }

      this.currentTurn++;
      this.findNextActorTurn(_callback);
    }, 100);
  }

  spendTurnPlay(index) {
    this.queue[index].nextTurn += this.queue[index].actor.stats.speed;
    this.queue[index].played++;
  }

  removeActorFromQueue(target) {
    const index = this.queue.findIndex((e) => e.actor.id === target.id);

    if (index >= 0) {
      this.queue.splice(index, 1);
    }
  }

}
