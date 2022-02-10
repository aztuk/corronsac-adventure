import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'equip-deco',
  templateUrl: './equipment-decorator.component.html',
  styleUrls: ['./equipment-decorator.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EquipmentDecoratorComponent implements OnInit, OnChanges {

  @Input() equipment;
  name;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.name = this.equipment;
    }
  }
}
