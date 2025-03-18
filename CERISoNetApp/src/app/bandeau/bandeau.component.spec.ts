import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandeauComponent } from './bandeau.component';

describe('BandeauComponent', () => {
  let component: BandeauComponent;
  let fixture: ComponentFixture<BandeauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BandeauComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BandeauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
