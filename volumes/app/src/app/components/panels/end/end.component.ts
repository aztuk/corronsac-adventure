import { ScoreService } from './../../../services/score.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'civ-end',
  templateUrl: './end.component.html',
  styleUrls: ['./end.component.scss']
})
export class EndComponent implements OnInit {

  public score;

  constructor() { }

  ngOnInit(): void {
    this.score = ScoreService.getInstance();
  }

}
