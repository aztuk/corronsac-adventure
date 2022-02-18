import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'civ-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {

  @Input() max;
  @Input() current;
  @Input() color = 'black';

  constructor() {
  }

  ngOnInit(): void {

  }


}
