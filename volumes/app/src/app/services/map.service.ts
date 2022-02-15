import { ScoreService } from './score.service';
import { Router } from '@angular/router';
import {Combat} from '../object/system/combat';
import {ELevelType} from '../sharedScript/enums';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ICombat, ILevel} from '../sharedScript/interfaces';
import {exists, getRandomInt, weightedRand} from '../sharedScript/helpers';
import { CharactersService } from './characters.service';


@Injectable({
  providedIn: 'root'
})
export class MapService {

  //public mapPhysionomy: ELevelType[] = [];

  public mapSizeX: number = 7;
  public mapSizeY: number = 17;
  public map$: BehaviorSubject<ILevel[]> = new BehaviorSubject([]);
  public currentLevel: ICombat;

  public set map(value: any) {
    this.map$.next(value);
  }

  public get map() {
    return this.map$.getValue();
  }

  typeBucket = {
    'shop': 8,
    'heal': 12,
    'event': 17,
    'elite': 9,
    'normal': 53
  }

  constructor(private _router: Router, private cs: CharactersService) {
  }

  antiCheat(expectedLevel: ELevelType[]) {
    if(!exists(this.currentLevel) ||  !expectedLevel.includes(this.currentLevel.type)) {
      console.error('N\'ESSAYE PAS DE TRICHER ADRIEN!');
      this._router.navigate(['map']);
    }

    if (this.cs.characters.length === 0) {
      this._router.navigate(['']);
    }
  }

  setCurrentLevel(level) {
    // Lock siblings
    this.currentLevel = level;
    this.getSiblings(level).map((room) => room.unlocked = false);
  }

  finished() {
    this.currentLevel.done = true;
    ScoreService.getInstance().stats.floorsClimbed++;

    // Unlock next room
    this.currentLevel.parents.forEach(element => {
      this.getRoomById(element).unlocked = true;
    });
  }

  generateMap() {
    if (this.map.length === 0) {
      this.map = this.emptyMap();
      const bossRoom = this.generateBoss();
      this.generatePath(1);
      this.generatePath(3);
      this.generatePath(5);
      this.forcedTypes();
      this.applyTypes();
    }
  }

  getSiblings(level) {
    return this.map[level.floor].filter((room) => room instanceof Combat && room.id !== level.id);
  }

  forcedTypes() {
    let treasureFloors = Math.floor(this.map.length / 2);
    let shopFloors = Math.floor(this.map.length / 2) + 1;
    let penultimumFloor = this.map.length - 2;

    this.map[treasureFloors].forEach(combat => {
      if (exists(combat)) {
        combat.type = ELevelType.TREASURE;
      }
    });
    this.map[shopFloors].forEach(combat => {
      if (exists(combat)) {
        combat.type = ELevelType.SHOP;
      }
    });
    this.map[penultimumFloor].forEach(combat => {
      if (exists(combat)) {
        combat.type = ELevelType.HEAL;
      }
    });
  }

  applyTypes() {
    let treasureFloors = Math.floor(this.map.length / 2);
    let shopFloors = Math.floor(this.map.length / 2) + 1;
    let penultimumFloor = this.map.length - 2;

    this.map.forEach((floor, floorIndex) => {
      if (floorIndex !== 0 && floorIndex !== treasureFloors && floorIndex !== shopFloors && floorIndex !== penultimumFloor) {
        floor.forEach((node, room) => {
          if (node instanceof Combat && node.type === undefined) {
            this.setTypeWithRules(floorIndex, room, node);
          }
        });
      }
    });
  }

  normalizeType(type) {
    switch (type) {
      case 'shop':
        return ELevelType.SHOP;
      case 'heal':
        return ELevelType.HEAL;
      case 'event':
        return ELevelType.EVENT;
      case 'elite':
        return ELevelType.COMBAT_TIER_2;
      case 'normal':
        return ELevelType.COMBAT_TIER_1;
    }
  }

  setTypeWithRules(floor, room, node) {
    let pickedType = this.normalizeType(weightedRand(this.typeBucket));

    // Rooms on previous floor which are connected with picked one shouldn't be the same type in case if this type is one of MonsterRoomElite, ShopRoom or RestRoom (and TreasureRoom, but there are none of these in bucket anyway).
    if (pickedType === ELevelType.SHOP || pickedType === ELevelType.HEAL || pickedType === ELevelType.COMBAT_TIER_2) {
      node.parents.forEach(id => {
        if (this.getRoomById(id).type === pickedType) {
          this.setTypeWithRules(floor, room, node);
          return;
        }
      });
    }

    if (floor < 3 && (pickedType === ELevelType.SHOP)) {
      this.setTypeWithRules(floor, room, node);
      return;
    }

    //MonsterRoomElite and RestRoom can't be assigned to rooms below 6th floor.
    if (floor < 5 && (pickedType === ELevelType.HEAL || pickedType === ELevelType.COMBAT_TIER_2)) {
      this.setTypeWithRules(floor, room, node);
      return;
    }

    // RestRoom can't be on 14th floor.
    let penultimumFloor = this.map.length - 3;
    if (floor === penultimumFloor && pickedType === ELevelType.HEAL) {
      this.setTypeWithRules(floor, room, node);
      return;
    }

    node.type = pickedType;
  }

  getRoomById(id) {
    let result;
    this.map.forEach((floor) => {
      floor.forEach(room => {
        if (room instanceof Combat && room.id === id) {
          result = room;
        }
      });
    })
    return result;
  }

  generateBoss() {
    // ADD BOSS
    let combat = new Combat(this.mapSizeY - 1);
    combat.type = ELevelType.COMBAT_TIER_3;
    const randomRoom = this.getRandomCellOfFloor(this.mapSizeY - 1);
    this.map[this.mapSizeY - 1][3] = combat;
  }

  generatePath(firstRoom) {
    let combat = new Combat(0);
    combat.type = ELevelType.COMBAT_TIER_1;
    combat.unlocked = true;
    this.map[0][firstRoom] = combat;

    let roomRef = firstRoom;
    let floor = 1;

    while (floor < this.mapSizeY - 1) {
      let parentCombat;
      let room = this.getRandomCellOfFloor(floor, roomRef);

      if (this.map[floor][room] === null) {
        parentCombat = new Combat(floor);
      } else {
        parentCombat = this.map[floor][room];
      }

      this.map[floor][room] = parentCombat;

      // Add to children list if not exist already
      if (!parentCombat.children.includes(combat.id)) {
        parentCombat.children.push(combat.id);
      }
      // Add to parent list if not exist already
      if (!combat.parents.includes(parentCombat.id)) {
        combat.parents.push(parentCombat.id);
      }

      combat = parentCombat;
      roomRef = room;

      if (floor === this.mapSizeY - 2) {
        combat.parents.push(this.map[this.mapSizeY - 1][3].id);
      }

      floor++;
    }

  }

  getRandomCellOfFloor(floor, connectedRoom?) {
    let min = 0, max = this.map[floor].length;

    if (connectedRoom !== undefined) {
      min = (connectedRoom - 1 >= 0) ? connectedRoom - 1 : 0;
      max = (connectedRoom + 1 <= this.mapSizeX - 1) ? connectedRoom + 1 : this.mapSizeX - 1;
    }

    // here we trim the min & max

    const room = getRandomInt(min, max);

    return room;
  }

  emptyMap() {
    let rows = [];
    for (let row = 0; row < this.mapSizeY; row++) {

      let columns = [];
      for (let col = 0; col < this.mapSizeX; col++) {
        columns.push(null);
      }
      rows.push(columns);

    }

    return rows;
  }
}
