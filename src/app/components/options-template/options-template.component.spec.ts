import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsTemplateComponent } from './options-template.component';

describe('HoverListComponent', () => {
  let component: OptionsTemplateComponent;
  let fixture: ComponentFixture<OptionsTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionsTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionsTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
