import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheFeatComponent } from './the-feat.component';

describe('TheFeatComponent', () => {
  let component: TheFeatComponent;
  let fixture: ComponentFixture<TheFeatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TheFeatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TheFeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
