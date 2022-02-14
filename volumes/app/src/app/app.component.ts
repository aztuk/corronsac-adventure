import { EquipmentDecoratorComponent } from './components/decorators/equipment-decorator/equipment-decorator.component';
import {CharacterDecoratorComponent} from './components/decorators/character-decorator/character-decorator.component';
import {DamageDecoratorComponent} from './components/decorators/damage-decorator/damage-decorator.component';
import { Component, HostListener, Injector, OnDestroy } from '@angular/core';
import {createCustomElement} from '@angular/elements';
import {EffectDecoratorComponent} from './components/decorators/effect-decorator/effect-decorator.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'Corronsac Adventures';

  constructor(private injector: Injector) {
    const effectDecorator = createCustomElement(EffectDecoratorComponent, {injector});
    const damageDecorator = createCustomElement(DamageDecoratorComponent, {injector});
    const characterDecorator = createCustomElement(CharacterDecoratorComponent, {injector});
    const equipmentDecorator = createCustomElement(EquipmentDecoratorComponent, {injector});
    customElements.define('eff-deco', effectDecorator);
    customElements.define('dmg-deco', damageDecorator);
    customElements.define('char-deco', characterDecorator);
    customElements.define('equip-deco', equipmentDecorator);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
