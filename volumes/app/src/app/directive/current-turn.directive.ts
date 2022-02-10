import {Directive, HostBinding, Input} from '@angular/core';

@Directive({
  selector: '[current-turn]'
})
export class CurrentTurnDirective {

  @Input('current-turn') isPlaying: boolean;

  @HostBinding('class.turn') get isPlayingDecoration() {
    return this.isPlaying;
  }

  constructor() {
  }

}
