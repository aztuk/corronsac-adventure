import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {ECombatState} from '../../../sharedScript/enums';


@Component({
  selector: 'civ-next-turn-button',
  templateUrl: './next-turn-button.component.html',
  styleUrls: ['./next-turn-button.component.scss']
})
export class NextTurnButtonComponent implements OnInit {

  @Input() mode;
  @Input() log;
  @Input() forbidden: boolean;

  @Output() begin = new EventEmitter();
  @Output() endPlayerTurn = new EventEmitter();
  @Output() endGame = new EventEmitter();
  @Output() getLoot = new EventEmitter();

  @HostListener('click') emitAction() {
    if (this.mode === ECombatState.BEGIN) {
      this.begin.emit();
    }
    if (this.mode === ECombatState.PLAYER_TURN) {
      this.endPlayerTurn.emit();
    }
    if (this.mode === ECombatState.LOST) {
      this.endGame.emit();
    }
    if (this.mode === ECombatState.WIN) {
      this.getLoot.emit();
    }
  }

  get text() {
    switch (this.mode) {
      case ECombatState.BEGIN:
        return 'Commencer';
      case ECombatState.WAITING:
        return 'En attente du prochain tour...';
      case ECombatState.AI_TURN:
        return 'Attaque de l\'ennemi';
      case ECombatState.PLAYER_TURN:
        return '';
      case ECombatState.LOST:
        return 'Fin de partie';
      case ECombatState.WIN:
        return 'Récupérer les récompenses';
    }
  }

  get lastItem() {
    return this.log[0];
  }

  constructor() {
  }

  ngOnInit(): void {
  }

}
