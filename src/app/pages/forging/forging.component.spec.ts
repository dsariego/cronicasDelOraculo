import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgingComponent } from './forging.component';

describe('ForgingComponent', () => {
  let component: ForgingComponent;
  let fixture: ComponentFixture<ForgingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
