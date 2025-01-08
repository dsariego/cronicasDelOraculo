import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HermitTemplateComponent } from './hermit-template.component';

describe('HermitTemplateComponent', () => {
  let component: HermitTemplateComponent;
  let fixture: ComponentFixture<HermitTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HermitTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HermitTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
