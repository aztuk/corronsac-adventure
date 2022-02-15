import { Component, OnInit, OnDestroy } from '@angular/core';
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

  public scoreS = ScoreService.getInstance();
  public score;
  public scoreSub;

  public characters: IEntityActor[] = [];
  public charSub;

  public currency;
  public currSub;

  public showRankingBool: boolean = false;
  public leaderboard;

  constructor(private charService: CharactersService, private ss: ShopService, private statsService: GlobalstatsService) {
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
