import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PlayerId, ThemeId } from '../game-settings.service';

@Component({
  selector: 'app-winner-screen',
  imports: [],
  templateUrl: './winner-screen.html',
  styleUrl: './winner-screen.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WinnerScreen {
  readonly themeId = input<ThemeId>('code-vibes-theme');
  readonly scores = input<Record<PlayerId, number>>({ blue: 0, orange: 0 });

  readonly winnerLabel = computed(() => {
    const { blue, orange } = this.scores();

    if (blue === orange) {
      return 'Draw';
    }

    return blue > orange ? 'Blue Wins' : 'Orange Wins';
  });
}
