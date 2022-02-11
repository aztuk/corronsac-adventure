import { ScoreService } from './../../services/score.service';
import { ShopService } from './../../services/shop.service';
import { ICombat } from './../../sharedScript/interfaces';
import {CombatService} from '../../services/combat.service';
import {MapNodeDirective} from '../../directive/map-node.directive';
import {MapService} from '../../services/map.service';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {Router} from '@angular/router';
import {IEntityActor, ILevel} from '../../sharedScript/interfaces';
import {CharactersService} from '../../services/characters.service';
import { ELevelType } from '../../sharedScript/enums';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'civ-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('mapContainer') mapContainer;
  @ViewChild('mapWrapper') mapWrapper;
  @ViewChildren(MapNodeDirective) mapNodes!: QueryList<MapNodeDirective>;
  public characters: IEntityActor[] = [];
  public map: ILevel[] = [];

  public mapSub
  public charSub;
  public currSub;

  public scoreS = ScoreService.getInstance();
  public score;

  public currency;

  constructor(private ss: ShopService, private charService: CharactersService, private _router: Router, private ms: MapService, private renderer: Renderer2, private cs: CombatService, private es: EventService) {
    this.charSub = this.charService.characters$.subscribe((c) => this.characters = c);
    this.mapSub = this.ms.map$.subscribe((c) => this.map = c);
    this.currSub = this.ss.currency$.subscribe(c => this.currency = c);
  }

  ngOnInit(): void {
    if (this.characters.length === 0) {
      this._router.navigate(['']);
    }
    this.ms.generateMap();
    // Update full stuff character stat
    ScoreService.getInstance().stats.fullStuffCharacters = this.charService.countFullStuff();
    this.score = this.scoreS.getScore();
  }

  ngOnDestroy(): void {
    this.charSub.unsubscribe();
    this.mapSub.unsubscribe();
    this.currSub.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.drawLines();
    setTimeout(() => {
      this.repositionMap();
    }, 1000)

  }

  finished(level) {
    if (level.unlocked && !level.done) {
      this.ms.finished();
    }
  }

  launch(level: ICombat) {
    this.ms.setCurrentLevel(level);
    if (level.unlocked && !level.done) {
      if(level.type === ELevelType.COMBAT_TIER_1 || level.type === ELevelType.COMBAT_TIER_2 || level.type === ELevelType.COMBAT_TIER_3) {
        this._router.navigate(['combat']);
      } else if (level.type === ELevelType.EVENT) {
        this._router.navigate(['event']);
      } else if (level.type === ELevelType.HEAL) {
        this._router.navigate(['heal']);
      } else if (level.type === ELevelType.SHOP) {
        this._router.navigate(['shop']);
      } else if (level.type === ELevelType.TREASURE) {
        this._router.navigate(['treasure']);
      }
    }
  }

  drawLines() {
    let nodes: MapNodeDirective[] = this.mapNodes.toArray();

    nodes.forEach((n) => {
      if (n.node.parents.length > 0) {
        //console.log(n.node);
        n.node.parents.forEach(path => {
          const parent: MapNodeDirective = nodes.find((f) => f.node.id === path);
          if (parent !== undefined) {
            n.drawLine(parent);
          }
        });
      }
    });
  }

  repositionMap() {
    this.renderer.setStyle(this.mapContainer.nativeElement, 'width', '870px');
    this.renderer.setStyle(this.mapWrapper.nativeElement, 'top', '150px');
    this.renderer.setStyle(this.mapContainer.nativeElement, 'opacity', '1');
  }

}
