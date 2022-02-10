import {ComponentFactoryService} from '../../../services/component-factory.service';
import {
  AfterContentInit,
  Component,
  ComponentRef,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

@Component({
  selector: 'app-abstract-panel',
  templateUrl: './abstract-panel.component.html',
  styleUrls: ['./abstract-panel.component.scss']
})
export class AbstractPanelComponent implements OnInit, AfterContentInit, OnDestroy {

  @Input() component;
  @Input() entity;
  @ViewChild('componentLoader', {read: ViewContainerRef, static: true}) content;
  public container: ComponentRef<any>;

  @HostBinding('class.hide') get hide() {
    return this.hidden;
  }

  public hidden;

  constructor(private cfs?: ComponentFactoryService, private host?: ElementRef<HTMLElement>) {
  }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    this.container = this.cfs.createComponent(this.content, this.component);
    this.container.instance.entity = this.entity;
    this.container.instance.close.subscribe(e => this.closePanel());
    this.container.instance.hide.subscribe(e => this.hidePanel());
  }

  ngOnDestroy(): void {
  }

  hidePanel() {
    this.hidden = true;
  }

  closePanel() {
    this.container.destroy();
    this.host.nativeElement.remove();
  }

}
