import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTemplateComponent } from './item-template.component';

describe('ItemTemplateComponent', () => {
  let component: ItemTemplateComponent;
  let fixture: ComponentFixture<ItemTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
