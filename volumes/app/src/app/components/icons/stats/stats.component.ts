import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'civ-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  @Input() stat;

  constructor() {
  }

  ngOnInit(): void {
  }

}
