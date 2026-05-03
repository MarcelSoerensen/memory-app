import { Component, ChangeDetectionStrategy, computed, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  GameSettingsService,
  THEMES,
  PLAYERS,
  BOARD_SIZES,
  ThemeOption,
  PlayerOption,
  BoardSizeOption,
} from '../game-settings.service';

@Component({
  selector: 'app-settings-screen',
  imports: [],
  templateUrl: './settings-screen.html',
  styleUrl: './settings-screen.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsScreen {
  private readonly settings = inject(GameSettingsService);
  private readonly router = inject(Router);

  readonly themes = THEMES;
  readonly players = PLAYERS;
  readonly boardSizes = BOARD_SIZES;

  readonly hoveredTheme = signal<ThemeOption | null>(null);

  readonly activePreviewTheme = computed(() => this.hoveredTheme() ?? this.settings.selectedTheme());
  readonly selectedTheme = computed(() => this.settings.selectedTheme());
  readonly selectedPlayer = computed(() => this.settings.selectedPlayer());
  readonly selectedBoardSize = computed(() => this.settings.selectedBoardSize());

  readonly navThemeLabel = computed(() => this.settings.selectedTheme().navLabel);
  readonly navPlayerLabel = computed(() => {
    const player = this.settings.selectedPlayer();
    return player ? `${player.label} Player` : 'Player';
  });
  readonly navBoardSizeLabel = computed(
    () => this.settings.selectedBoardSize()?.navLabel ?? 'Board size',
  );
  readonly allSelectionsMade = computed(
    () => this.settings.selectedPlayer() !== null && this.settings.selectedBoardSize() !== null,
  );

  selectTheme(theme: ThemeOption): void {
    this.settings.selectedTheme.set(theme);
  }

  previewTheme(theme: ThemeOption | null): void {
    this.hoveredTheme.set(theme);
  }

  selectPlayer(player: PlayerOption): void {
    this.settings.selectedPlayer.set(player);
  }

  selectBoardSize(size: BoardSizeOption): void {
    this.settings.selectedBoardSize.set(size);
  }

  startGame(): void {
    if (this.settings.selectedPlayer() === null) {
      this.settings.selectedPlayer.set(this.players[0]);
    }

    if (this.settings.selectedBoardSize() === null) {
      this.settings.selectedBoardSize.set(this.boardSizes[0]);
    }

    this.router.navigate(['/game']);
  }
}
