import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PairDialogComponent } from './pair-dialog.component';

describe('PairDialogComponent', () => {
  let component: PairDialogComponent;
  let fixture: ComponentFixture<PairDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PairDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PairDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
