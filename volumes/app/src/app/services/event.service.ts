import { IEntityActor, IEvent } from './../sharedScript/interfaces';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ICombat } from '../sharedScript/interfaces';
import { EVENTS } from '../sharedScript/events-enum';
import { exists, getRandomInArray } from '../sharedScript/helpers';
import { EHero } from '../sharedScript/enums';

@Injectable({
  providedIn: 'root'
})
export class EventService {


  constructor() { }

  generateEvent(actors: IEntityActor[]): IEvent {
    return getRandomInArray(this.getEventsFor(actors));
  }

  getEventsFor(actors: IEntityActor[]): IEvent[] {
    let potentialEvents: IEvent[] = [];

    // TODO Remove events on this list if owner is dead
    for(const event of EVENTS) {
      if(exists(event.condition) && event.condition(actors, event) || !exists(event.condition)) {
          potentialEvents.push(event);
      }
    }

    return potentialEvents;
  }

}
