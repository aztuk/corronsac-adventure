import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'dmg-deco',
  templateUrl: './damage-decorator.component.html',
  styleUrls: ['./damage-decorator.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DamageDecoratorComponent implements OnInit {

  @Input() type;
  @Input() stat;
  @Input() amount;
  damage;

  constructor() {
  }

  ngOnInit(): void {
    this.damage = Math.round(Number(this.stat) * Number(this.amount));
  }

}
