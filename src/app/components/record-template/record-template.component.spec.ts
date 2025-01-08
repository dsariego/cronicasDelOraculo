import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordTemplateComponent } from './record-template.component';

describe('RecordTemplateComponent', () => {
  let component: RecordTemplateComponent;
  let fixture: ComponentFixture<RecordTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
