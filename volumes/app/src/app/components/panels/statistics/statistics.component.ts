import { StatisticsService } from './../../../services/statistics.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'civ-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  @Output() close = new EventEmitter();

  public heroStats = [];

  constructor(private statistics: StatisticsService) { }

  ngOnInit(): void {
    this.heroStats = this.statistics.processHeroStats();
    console.log(this.heroStats);
  }

  closePanel(){
    this.close.emit();
  }

}
