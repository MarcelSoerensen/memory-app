import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerId, ThemeId } from '../game-settings.service';

@Component({
  selector: 'app-winner-screen',
  imports: [],
  templateUrl: './winner-screen.html',
  styleUrl: './winner-screen.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WinnerScreen {
  private readonly router = inject(Router);

  readonly themeId = input<ThemeId>('code-vibes-theme');
  readonly scores = input<Record<PlayerId, number>>({ blue: 0, orange: 0 });

  readonly winnerId = computed<PlayerId | null>(() => {
    const { blue, orange } = this.scores();

    if (blue === orange) {
      return null;
    }

    return blue > orange ? 'blue' : 'orange';
  });

  readonly isDraw = computed(() => this.winnerId() === null);

  readonly winnerLabel = computed(() => {
    const winner = this.winnerId();
    if (!winner) {
      return 'Draw';
    }

    return winner === 'blue' ? 'Blue Player' : 'Orange Player';
  });

  readonly winnerImageUrl = computed(() => {
    const winner = this.winnerId();
    if (!winner) {
      return '';
    }

    return `/assets/images/${this.themeId()}/win-${winner}.svg`;
  });

  readonly drawPlayers = computed(() => [
    {
      id: 'orange' as const,
      label: 'Player Orange',
      imageUrl: `/assets/images/${this.themeId()}/win-orange.svg`,
    },
    {
      id: 'blue' as const,
      label: 'Player Blue',
      imageUrl: `/assets/images/${this.themeId()}/win-blue.svg`,
    },
  ]);

  readonly homeButtonLabel = computed(() =>
    this.themeId() === 'code-vibes-theme' ? 'Back to start' : 'Home',
  );

  async goToStart(): Promise<void> {
    await this.router.navigate(['/']);
  }
}
