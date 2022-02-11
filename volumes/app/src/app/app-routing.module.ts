import {PickCharacterComponent} from './components/panels/pick-character/pick-character.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CombatComponent} from './components/combat/combat.component';
import {MapComponent} from './components/map/map.component';
import { EventComponent } from './components/panels/event/event.component';
import { RestComponent } from './components/panels/rest/rest.component';
import { TreasureComponent } from './components/panels/treasure/treasure.component';
import { ShopComponent } from './components/panels/shop/shop.component';
import { LootComponent } from './components/panels/loot/loot.component';
import { EndComponent } from './components/panels/end/end.component';

const routes: Routes = [{
  path: '',
  component: PickCharacterComponent
}, {
  path: 'map',
  component: MapComponent
}, {
  path: 'combat',
  component: CombatComponent
}, {
  path: 'event',
  component: EventComponent
}, {
  path: 'heal',
  component: RestComponent
}, {
  path: 'shop',
  component: ShopComponent
}, {
  path: 'treasure',
  component: TreasureComponent
}, {
  path: 'loot',
  component: LootComponent
}, {
  path: 'end',
  component: EndComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
