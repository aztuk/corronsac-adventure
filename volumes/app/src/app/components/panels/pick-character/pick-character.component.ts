import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CharactersService} from '../../../services/characters.service';
import {IEntityActor} from '../../../sharedScript/interfaces';
import {EHero} from "../../../sharedScript/enums";

@Component({
  selector: 'civ-pick-character',
  templateUrl: './pick-character.component.html',
  styleUrls: ['./pick-character.component.scss']
})
export class PickCharacterComponent implements OnInit {

  public pickableCharacters: IEntityActor[] = [];

  constructor(private charService: CharactersService, private _router: Router) {
  }

  ngOnInit(): void {
    this.pickableCharacters.push(this.charService.createClement(false));
    this.pickableCharacters.push(this.charService.createAdrien(false));
    this.pickableCharacters.push(this.charService.createLoic(false));
    this.pickableCharacters.push(this.charService.createKevin(false));
    this.pickableCharacters.push(this.charService.createQuentin(false));
    this.pickableCharacters.push(this.charService.createCosty(false));

    if(this.charService.characters.length > 0) {

    this._router.navigate(['map']);
    }
  }

  getDescription(char) {
    let text = '';
    switch (char) {
      case EHero.ADRIEN:
        text = 'Adrien est un combattant polyvalent, capable d\'étourdir. Il excelle dans dans l\'art de l\'évasion et les attaques enchaînées.';
        break;
      case EHero.CLEMENT:
        text = 'Il est considéré comme le protecteur du groupe. Il attire les enemis et sa confiance lui permet d\'absorber plus facilement les coups.';
        break;
      case EHero.LOIC:
        text = 'Loic n\'hésitera pas à foncer dans le tas sans considérer les risques. Ses attaques sont considérées comme les plus dévastatrices.';
        break;
      case EHero.KEVIN:
        text = 'Kevin est un puissant alchimiste et manipule le poison comme personne, qu\'il s\'agisse de poisons liquides ou à fumer. Il dispose aussi de pouvoirs d\'invocations.';
        break;
      case EHero.QUENTIN:
        text = 'Il exaspère ses enemis par son comportement insistant, permettant d\'infliger des dégâts de plus en plus élevés à mesure que le combat évolue. C\'est cependant une véritable chips.';
        break;
      case EHero.COSTY:
        text = 'Costy trouvera toujours un moyen de soutenir ses coéquippiers, améliorant la qualité de leurs attaques. C\'est aussi un puissant soigneur, mais piètre combattant.';
        break;
      default:
        text = 'Lol';
        break;
    }

    return text;
  }

  pickHero(char) {
    this.charService.initCharacterGame(char.name);
    this._router.navigate(['map']);
  }

  littleSquare(value, div, inverted?) {
    if(inverted) {
      return Array(Math.round((50 - value )/ div));
    }
    return Array(Math.round(value / div));
  }


}
