import { ChangeDetectionStrategy, Component, OnDestroy, computed, input, output, signal } from '@angular/core';
import { PlayerId, ThemeId } from '../game-settings.service';

@Component({
  selector: 'app-game-over-screen',
  imports: [],
  templateUrl: './game-over-screen.html',
  styleUrl: './game-over-screen.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameOverScreen implements OnDestroy {
  private readonly enterDurationMs = 1400;
  private readonly visibleDurationMs = 2000;
  private readonly exitDurationMs = 900;

  private readonly fadeOutTimeoutId: ReturnType<typeof setTimeout>;
  private readonly sequenceDoneTimeoutId: ReturnType<typeof setTimeout>;

  readonly themeId = input<ThemeId>('code-vibes-theme');
  readonly scores = input<Record<PlayerId, number>>({ blue: 0, orange: 0 });
  readonly sequenceDone = output<void>();
  readonly isFadingOut = signal(false);

  readonly bluePlayerIcon = computed(
    () => `/assets/images/${this.themeId()}/player-blue.svg`,
  );
  readonly orangePlayerIcon = computed(
    () => `/assets/images/${this.themeId()}/player-orange.svg`,
  );

  constructor() {
    this.fadeOutTimeoutId = setTimeout(() => {
      this.isFadingOut.set(true);
    }, this.enterDurationMs + this.visibleDurationMs);

    this.sequenceDoneTimeoutId = setTimeout(() => {
      this.sequenceDone.emit();
    }, this.enterDurationMs + this.visibleDurationMs + this.exitDurationMs);
  }

  ngOnDestroy(): void {
    clearTimeout(this.fadeOutTimeoutId);
    clearTimeout(this.sequenceDoneTimeoutId);
  }
}
