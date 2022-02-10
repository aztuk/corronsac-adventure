import {Component, Input, OnInit} from '@angular/core';
import {Effects} from '../../../object/system/effects';

@Component({
  selector: 'civ-effects',
  templateUrl: './effects.component.html',
  styleUrls: ['./effects.component.scss']
})
export class EffectsComponent implements OnInit {

  @Input() effect;

  simpleIcon: boolean = true;

  constructor() {

  }

  ngOnInit(): void {
    if (this.effect instanceof Effects) {
      this.simpleIcon = false;
    }
  }


}
