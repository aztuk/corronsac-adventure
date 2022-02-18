import { IEntityActor } from './../../../sharedScript/interfaces';
import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'dmg-deco',
  templateUrl: './damage-decorator.component.html',
  styleUrls: ['./damage-decorator.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DamageDecoratorComponent implements OnInit {

  @Input() type: string;
  @Input() amount: number;
  @Input() stat: number;
  damage;

  constructor() {
  }

  ngOnInit(): void {
    this.damage = Math.round(this.amount * this.stat);
  }

}
