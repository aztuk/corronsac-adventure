import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalstatsService } from '../../../services/globalstats.service';

@Component({
  selector: 'civ-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit, AfterViewInit {

  public showRankingBool: boolean = false;
  @Input() leaderboard;
  @Output() hide = new EventEmitter();

  constructor() {
 }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

  }

  hideRanking() {
    this.hide.emit(true);
  }

}
