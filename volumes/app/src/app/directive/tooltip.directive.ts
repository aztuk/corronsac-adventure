import { TooltipEquipmentComponent } from './../components/tooltips/tooltip-equipment/tooltip-equipment.component';
import { EquipmentDescription } from './../object/components/equipment-description';
import {TooltipMapNodeComponent} from '../components/tooltips/tooltip-map-node/tooltip-map-node.component';
import {Combat} from '../object/system/combat';
import {Actor} from '../object/entities/actor';
import {Effects} from '../object/system/effects';
import {ComponentFactoryService} from '../services/component-factory.service';
import {TooltipSpellComponent} from '../components/tooltips/tooltip-spell/tooltip-spell.component';
import {SpellDescription} from '../object/components/spell-description';
import {Directive, ElementRef, HostListener, Input, OnDestroy, Renderer2, ViewContainerRef} from '@angular/core';
import {TooltipEffectComponent} from '../components/tooltips/tooltip-effect/tooltip-effect.component';
import {TooltipCharacterComponent} from '../components/tooltips/tooltip-character/tooltip-character.component';

@Directive({
  selector: '[civ-tooltip]'
})
export class TooltipDirective implements OnDestroy {

  @Input('civ-tooltip') entity;
  @Input('civ-tooltip-owner') owner;
  @Input('on-click') onClick:boolean = false;


  @HostListener('mouseup', ['$event']) onMouseClick($event) {
    if(this.onClick){
      this.displayTooltip($event);
      this.position($event);
    }
}


  @HostListener('mouseenter', ['$event']) onMouseEnter($event) {
    if(!this.onClick){
      this.displayTooltip($event);
    }
  }

  @HostListener('mousemove', ['$event']) onMouseMove($event) {
    if(!this.onClick){
      this.position($event);
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if(!this.onClick){
    if (this.tooltip !== undefined) {
      this.tooltip.destroy();
    }
    }
  }

  public component;
  public tooltip;

  constructor(private cfs: ComponentFactoryService, private container: ViewContainerRef, private renderer: Renderer2, private el: ElementRef) {
  }

  ngOnDestroy(): void {
    if (this.tooltip !== undefined) {
      this.tooltip.destroy();
    }
  }

  displayTooltip($event) {
    if (this.entity instanceof SpellDescription) {
      this.component = TooltipSpellComponent;
    }
    if (this.entity instanceof Effects) {
      this.component = TooltipEffectComponent;
    }
    if (this.entity instanceof Actor) {
      this.component = TooltipCharacterComponent;
    }
    if (this.entity instanceof Combat) {
      this.component = TooltipMapNodeComponent;
    }
    if (this.entity instanceof EquipmentDescription) {
      this.component = TooltipEquipmentComponent;
    }

    this.tooltip = this.cfs.createComponent(this.container, this.component);
    this.tooltip.instance.entity = this.entity;
    this.tooltip.instance.owner = this.owner;

    if(this.onClick) {
      let overlay = this.renderer.createElement('div');
      this.renderer.addClass(overlay, 'overlay');
      this.renderer.appendChild(this.tooltip.location.nativeElement, overlay);
      this.renderer.listen(overlay, 'mousedown', ($e) => {
        this.tooltip.destroy();
      })
    }
    $event.stopPropagation();
  }

  position($event) {
    if(!this.onClick) {
      let bottomCoord = $event.pageY - 50 + this.tooltip.location.nativeElement.offsetHeight;
      let deltaY = (bottomCoord > document.body.offsetHeight) ? bottomCoord - document.body.offsetHeight + 10 : 0;

      let rightCoord = $event.pageX - 50 + this.tooltip.location.nativeElement.offsetWidth;

      if(rightCoord >= document.body.offsetWidth) {
        this.renderer.setStyle(this.tooltip.location.nativeElement, 'right',  document.body.offsetWidth - $event.pageX + 50 + "px");
        this.renderer.setStyle(this.tooltip.location.nativeElement, 'left',"auto");
      } else {
        this.renderer.setStyle(this.tooltip.location.nativeElement, 'left', $event.pageX + 50 + "px");
        this.renderer.setStyle(this.tooltip.location.nativeElement, 'right',  "auto");

      }

      this.renderer.setStyle(this.tooltip.location.nativeElement, 'top', $event.pageY - 50 - deltaY + "px");
    } else {
      this.renderer.setStyle(this.tooltip.location.nativeElement, 'right', "20px");
      this.renderer.setStyle(this.tooltip.location.nativeElement, 'bottom', "20px");
      this.renderer.setStyle(this.tooltip.location.nativeElement, 'left',"auto");
      this.renderer.setStyle(this.tooltip.location.nativeElement, 'top',"auto");
    }

    $event.stopPropagation();
  }

}
