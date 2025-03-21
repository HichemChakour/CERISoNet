import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedPosteComponent } from './detailed-poste.component';

describe('DetailedPosteComponent', () => {
  let component: DetailedPosteComponent;
  let fixture: ComponentFixture<DetailedPosteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailedPosteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailedPosteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
