import { StatisticsComponent } from './../../panels/statistics/statistics.component';
import { ComponentFactoryService } from './../../../services/component-factory.service';
import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { CharactersService } from '../../../services/characters.service';
import { GlobalstatsService } from '../../../services/globalstats.service';
import { ScoreService } from '../../../services/score.service';
import { ShopService } from '../../../services/shop.service';
import { IEntityActor } from '../../../sharedScript/interfaces';

@Component({
  selector: 'civ-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit, OnDestroy {

  @ViewChild('statisticsContainer', { read: ViewContainerRef}) container;

  public scoreS = ScoreService.getInstance();
  public score;
  public scoreSub;

  public characters: IEntityActor[] = [];
  public charSub;

  public currency;
  public currSub;

  public showRankingBool: boolean = false;
  public leaderboard;

  constructor(private charService: CharactersService, private ss: ShopService, private statsService: GlobalstatsService, private cfs: ComponentFactoryService) {
    this.charSub = this.charService.characters$.subscribe((c) => this.characters = c);
    this.currSub = this.ss.currency$.subscribe(c => this.currency = c);
    this.scoreSub = this.scoreS.score$.subscribe(c => {
      this.score = c;
    });
  }

  ngOnInit(): void {
  }


  ngOnDestroy(): void {
    this.charSub.unsubscribe();
    this.currSub.unsubscribe();
    this.scoreSub.unsubscribe();
  }

  showStatistics() {
    let statisticPanel = this.cfs.createComponent(this.container, StatisticsComponent, true);
    statisticPanel.instance.close.subscribe((a) => statisticPanel.destroy());
  }

  showRanking() {
    this.statsService.getScore().then((data) => {
      this.leaderboard = data.data;
      this.showRankingBool = true;
  });
  }
  hideRanking() {
    this.showRankingBool = false;
  }
  restart() {

    window.location.reload();
  }
}
