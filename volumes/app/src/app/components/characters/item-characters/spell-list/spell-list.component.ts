import {SpellCast} from '../../../../object/system/spellCast';
import {IEntityActor, ISpellDescription} from '../../../../sharedScript/interfaces';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'civ-spell-list',
  templateUrl: './spell-list.component.html',
  styleUrls: ['./spell-list.component.scss']
})
export class SpellListComponent implements OnInit {

  @Input() actor: IEntityActor;
  @Input() allies: IEntityActor[];
  @Input() enemies: IEntityActor[];
  @Input() target: IEntityActor;
  @Output() damageDone = new EventEmitter<any>();


  constructor() {
  }

  ngOnInit(): void {
  }

  launchSpell(spell: ISpellDescription) {
    if (spell.timer === 0) {
      const potentialSpellTarget = {
        allies: this.allies,
        enemies: this.enemies,
        target: this.target
      }
      const spellResult = new SpellCast(this.actor, potentialSpellTarget, spell);
      this.damageDone.emit(spellResult);
    } else {
      console.error('spell on cooldown');
    }
  }
}
