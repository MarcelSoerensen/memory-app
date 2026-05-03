import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameOverScreen } from './game-over-screen';

describe('GameOverScreen', () => {
  let component: GameOverScreen;
  let fixture: ComponentFixture<GameOverScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameOverScreen],
    }).compileComponents();

    fixture = TestBed.createComponent(GameOverScreen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
