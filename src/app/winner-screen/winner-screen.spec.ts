import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinnerScreen } from './winner-screen';

describe('WinnerScreen', () => {
  let component: WinnerScreen;
  let fixture: ComponentFixture<WinnerScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WinnerScreen],
    }).compileComponents();

    fixture = TestBed.createComponent(WinnerScreen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
