import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentDecoratorComponent } from './equipment-decorator.component';

describe('EquipmentDecoratorComponent', () => {
  let component: EquipmentDecoratorComponent;
  let fixture: ComponentFixture<EquipmentDecoratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquipmentDecoratorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentDecoratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
