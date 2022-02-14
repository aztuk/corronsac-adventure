import { ScoreService } from './../../../services/score.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { GlobalstatsService } from '../../../services/globalstats.service';

@Component({
  selector: 'civ-end',
  templateUrl: './end.component.html',
  styleUrls: ['./end.component.scss']
})
export class EndComponent implements OnInit, AfterViewInit {

  @ViewChild('usernameInput') username: ElementRef;

  public score;
  public total;

  public showRankingBool: boolean = false;
  public leaderboard;
  public usernameValid: boolean = false;
  public usernameValue: string = '';

  constructor(private statsService: GlobalstatsService) { }

  ngOnInit(): void {
    this.score = ScoreService.getInstance();
    this.total = this.score.getScore();
  }

  ngAfterViewInit(): void {
  }

  isUsernameOk($event) {
    this.usernameValid = $event.srcElement.value.length > 3;
    this.usernameValue = $event.srcElement.value;
  }

  saveScore() {
    this.statsService.saveScore(this.usernameValue, this.total).then((data) => {
      this.showRanking();
  });
  }

  showRanking() {
    this.showRankingBool = true;
    this.statsService.getScore().then((data) => {
      this.leaderboard = data.data;
  });
  }
  hideRanking() {
    this.showRankingBool = false;
  }

  restart() {
    console.log('restart');
  }

}
