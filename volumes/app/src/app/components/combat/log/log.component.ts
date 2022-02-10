import {ChangeDetectionStrategy, Component, HostBinding, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ICombatLogItem} from '../../../sharedScript/interfaces';

@Component({
  selector: 'civ-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

  @Input() log: ICombatLogItem[];
  @HostBinding('class.show') get show() { return this.show$; }

  public show$: boolean = false;

  constructor() {
  }

  ngOnInit(): void {

  }


  toggleCombatLog() {
    this.show$ = !this.show$;
  }

}
