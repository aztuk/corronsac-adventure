import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'char-deco',
  templateUrl: './character-decorator.component.html',
  styleUrls: ['./character-decorator.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterDecoratorComponent implements OnInit, OnChanges {

  @Input() character;
  @Input() big;
  name;
  cssClass;

  constructor() {
  }

  ngOnInit(): void {
    this.name = this.character;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.name = String(this.character).toLowerCase();
      this.cssClass = this.character.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(' ', '').toUpperCase();
    }
  }

}
