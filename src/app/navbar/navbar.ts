import { Component, computed, input } from '@angular/core';
import { PlayerId, ThemeId } from '../game-settings.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  readonly themeId = input<ThemeId>('code-vibes-theme');
  readonly activePlayerId = input<PlayerId>('blue');
  readonly scores = input<Record<PlayerId, number>>({
    blue: 0,
    orange: 0,
  });

  readonly bluePlayerIcon = computed(
    () => `/assets/images/${this.themeId()}/player-blue.svg`,
  );
  readonly orangePlayerIcon = computed(
    () => `/assets/images/${this.themeId()}/player-orange.svg`,
  );

  readonly currentPlayerIcon = computed(() => {
    if (this.themeId() === 'code-vibes-theme') {
      return this.activePlayerId() === 'blue'
        ? '/assets/icons/current-player-blue.svg'
        : '/assets/icons/current-player-orange.svg';
    }

    return '/assets/icons/current-player.svg';
  });

  readonly currentPlayerLabel = computed(() =>
    this.activePlayerId() === 'blue' ? 'Blue Player' : 'Orange Player',
  );
}
