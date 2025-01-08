import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChroniclesComponent } from './chronicles.component';

describe('ChroniclesComponent', () => {
  let component: ChroniclesComponent;
  let fixture: ComponentFixture<ChroniclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChroniclesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChroniclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
