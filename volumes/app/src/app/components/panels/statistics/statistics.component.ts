import { StatisticsService } from './../../../services/statistics.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CharactersService } from '../../../services/characters.service';

@Component({
  selector: 'civ-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  @Output() close = new EventEmitter();

  public heroStats = [];

  constructor(private statistics: StatisticsService, private cs: CharactersService) {

  }

  ngOnInit(): void {
    this.heroStats = this.statistics.processHeroStats(this.cs.characters);
  }

  closePanel(){
    this.close.emit();
  }

}
