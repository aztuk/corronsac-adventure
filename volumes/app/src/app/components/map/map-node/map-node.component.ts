import {Component, ElementRef, HostBinding, Input, OnInit, Renderer2} from '@angular/core';
import {getRandomInt} from '../../../sharedScript/helpers';
import {ICombat} from '../../../sharedScript/interfaces';

@Component({
  selector: 'civ-map-node',
  templateUrl: './map-node.component.html',
  styleUrls: ['./map-node.component.scss']
})
export class MapNodeComponent implements OnInit {

  @Input() node: ICombat;

  @HostBinding('class.unlocked') get isUnlocked() {
    return this.node.unlocked;
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.renderer.addClass(this.el.nativeElement, 'animate-' + getRandomInt(1, 29));
    this.renderer.addClass(this.el.nativeElement, 'type-' + this.node.type);
  }

}
