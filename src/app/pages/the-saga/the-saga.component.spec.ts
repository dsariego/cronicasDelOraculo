import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheSagaComponent } from './the-saga.component';

describe('TheSagaComponent', () => {
  let component: TheSagaComponent;
  let fixture: ComponentFixture<TheSagaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TheSagaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TheSagaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
