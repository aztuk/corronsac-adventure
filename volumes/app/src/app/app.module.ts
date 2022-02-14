import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {DndModule} from 'ngx-drag-drop';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MainComponent} from './components/main/main.component';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {ClickOutsideModule} from 'ng-click-outside';
import {AbstractPanelComponent} from './components/main/abstract-panel/abstract-panel.component';
import {InjectHTMLDirective} from './directive/inject-html.directive';
import {ProgressBarComponent} from './components/main/progress-bar/progress-bar.component';
import {ListCharactersComponent} from './components/characters/list-characters/list-characters.component';
import {ItemCharactersComponent} from './components/characters/item-characters/item-characters.component';
import {MapComponent} from './components/map/map.component';
import {CombatComponent} from './components/combat/combat.component';
import {DamageComponent} from './components/combat/damage/damage.component';
import {DamageDisplayDirective} from './directive/damage-display.directive';
import {CurrentTurnDirective} from './directive/current-turn.directive';
import {NextTurnButtonComponent} from './components/combat/next-turn-button/next-turn-button.component';
import {SpellListComponent} from './components/characters/item-characters/spell-list/spell-list.component';
import {SpellItemComponent} from './components/characters/item-characters/spell-item/spell-item.component';
import {DamageTypePipe, EffectNamePipe, NodeTypePipe, SpecialtyNamePipe} from './pipes/effect-name.pipe';
import {EffectsComponent} from './components/icons/effects/effects.component';
import {TooltipDirective} from './directive/tooltip.directive';
import {TooltipSpellComponent} from './components/tooltips/tooltip-spell/tooltip-spell.component';
import {TooltipEffectComponent} from './components/tooltips/tooltip-effect/tooltip-effect.component';
import {TooltipCharacterComponent} from './components/tooltips/tooltip-character/tooltip-character.component';
import {DamageAnimationDirective} from './directive/damage-animation.directive';
import {LogComponent} from './components/combat/log/log.component';
import {StatsComponent} from './components/icons/stats/stats.component';
import {PickCharacterComponent} from './components/panels/pick-character/pick-character.component';
import {SpellsComponent} from './components/icons/spells/spells.component';
import {MapNodeDirective} from './directive/map-node.directive';
import {TooltipMapNodeComponent} from './components/tooltips/tooltip-map-node/tooltip-map-node.component';
import {MapNodeComponent} from './components/map/map-node/map-node.component';
import {EffectDecoratorComponent} from './components/decorators/effect-decorator/effect-decorator.component';
import {DamageDecoratorComponent} from './components/decorators/damage-decorator/damage-decorator.component';
import {CharacterDecoratorComponent} from './components/decorators/character-decorator/character-decorator.component';
import { LootComponent } from './components/panels/loot/loot.component';
import { LootItemComponent } from './components/panels/loot/loot-item/loot-item.component';
import { TooltipEquipmentComponent } from './components/tooltips/tooltip-equipment/tooltip-equipment.component';
import { EquipmentDecoratorComponent } from './components/decorators/equipment-decorator/equipment-decorator.component';
import { EventComponent } from './components/panels/event/event.component';
import { EquipmentComponent } from './components/icons/equipment/equipment.component';
import { RestComponent } from './components/panels/rest/rest.component';
import { ShopComponent } from './components/panels/shop/shop.component';
import { TreasureComponent } from './components/panels/treasure/treasure.component';
import { TooltipScoreComponent } from './components/tooltips/tooltip-score/tooltip-score.component';
import { EndComponent } from './components/panels/end/end.component';
import { HttpClient, HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    AbstractPanelComponent,
    InjectHTMLDirective,
    ProgressBarComponent,
    ListCharactersComponent,
    ItemCharactersComponent,
    MapComponent,
    CombatComponent,
    DamageComponent,
    DamageDisplayDirective,
    CurrentTurnDirective,
    NextTurnButtonComponent,
    SpellListComponent,
    SpellItemComponent,
    EffectNamePipe,
    EffectsComponent,
    TooltipDirective,
    TooltipSpellComponent,
    TooltipEffectComponent,
    TooltipCharacterComponent,
    DamageAnimationDirective,
    LogComponent,
    DamageTypePipe,
    SpecialtyNamePipe,
    StatsComponent,
    PickCharacterComponent,
    SpellsComponent,
    MapNodeDirective,
    TooltipMapNodeComponent,
    MapNodeComponent,
    NodeTypePipe,
    EffectDecoratorComponent,
    DamageDecoratorComponent,
    CharacterDecoratorComponent,
    LootComponent,
    LootItemComponent,
    TooltipEquipmentComponent,
    EquipmentDecoratorComponent,
    EventComponent,
    EquipmentComponent,
    RestComponent,
    ShopComponent,
    TreasureComponent,
    TooltipScoreComponent,
    EndComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DndModule,
    FormsModule,
    NgScrollbarModule,
    ClickOutsideModule,
    HttpClientModule,
    HttpClientJsonpModule
  ],
  entryComponents: [],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
