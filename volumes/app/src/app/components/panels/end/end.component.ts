import { Router } from '@angular/router';
import { CharactersService } from './../../../services/characters.service';
import { ScoreService } from './../../../services/score.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { GlobalstatsService } from '../../../services/globalstats.service';

@Component({
  selector: 'civ-end',
  templateUrl: './end.component.html',
  styleUrls: ['./end.component.scss']
})
export class EndComponent implements OnInit, OnDestroy {

  @ViewChild('usernameInput') username: ElementRef;

  public score = ScoreService.getInstance();
  public scoreSub;
  public total;

  public showRankingBool: boolean = false;
  public usernameValid: boolean = false;
  public usernameValue: string = '';
  public leaderboard;


  constructor(private statsService: GlobalstatsService, private cs: CharactersService, private _router: Router) { }

  ngOnInit(): void {
    if (this.cs.characters.length === 0) {
      this._router.navigate(['']);
    }
    this.score.stats.sizeTeam =  this.cs.characters.length;
    this.score.stats.fullStuffCharacters = this.cs.countFullStuff();

    this.scoreSub = this.score.score$.subscribe(c => {
      this.total = c;
    });
  }
ngOnDestroy(): void {
  this.scoreSub.unsubscribe();

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
