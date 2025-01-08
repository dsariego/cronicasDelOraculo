import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatacombsComponent } from './catacombs.component';

describe('CatacombsComponent', () => {
  let component: CatacombsComponent;
  let fixture: ComponentFixture<CatacombsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatacombsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatacombsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
