import {IEntityActor} from '../../../sharedScript/interfaces';
import {Component, HostBinding, Input, OnInit} from '@angular/core';

@Component({
  selector: 'civ-tooltip-character',
  templateUrl: './tooltip-character.component.html',
  styleUrls: ['./tooltip-character.component.scss']
})
export class TooltipCharacterComponent implements OnInit {

  @Input() entity: IEntityActor;
  @HostBinding('class.tooltip') isTooltip = true;


  constructor() {
  }

  ngOnInit(): void {
  }

}
