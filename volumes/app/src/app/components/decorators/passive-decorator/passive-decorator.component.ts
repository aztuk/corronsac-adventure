import { IEntityActor } from './../../../sharedScript/interfaces';
import { Component, Input, OnInit } from '@angular/core';
import { PassiveService } from '../../../services/passive.service';

@Component({
  selector: 'civ-passive-decorator',
  templateUrl: './passive-decorator.component.html',
  styleUrls: ['./passive-decorator.component.scss']
})
export class PassiveDecoratorComponent implements OnInit {

  @Input() actor: IEntityActor;
  @Input() small: boolean = true;

  constructor(private passive: PassiveService) { }

  ngOnInit(): void {
  }

  getPassiveDescription(char) {
    return this.passive.getPassiveDescription(char);
  }

}
