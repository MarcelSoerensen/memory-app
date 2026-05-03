import { Component, ChangeDetectionStrategy, computed, signal } from '@angular/core';

interface Theme {
  label: string;
  navLabel: string;
  preview: string;
}

interface Player {
  label: string;
}

interface BoardSize {
  label: string;
  navLabel: string;
}

const THEMES: Theme[] = [
  {
    label: 'Code vibes theme',
    navLabel: 'Code vibes',
    preview: '/assets/images/code-vibes-theme/theme-preview.svg',
  },
  {
    label: 'Gaming theme',
    navLabel: 'Gaming',
    preview: '/assets/images/gaming-theme/theme-preview.svg',
  },
  {
    label: 'DA Projects theme',
    navLabel: 'DA Projects',
    preview: '/assets/images/da-projects-theme/theme-preview.svg',
  },
  {
    label: 'Foods theme',
    navLabel: 'Foods',
    preview: '/assets/images/foods-theme/theme-preview.svg',
  },
];

const PLAYERS: Player[] = [{ label: 'Blue' }, { label: 'Orange' }];

const BOARD_SIZES: BoardSize[] = [
  { label: '16 cards', navLabel: 'Board-16 cards' },
  { label: '24 cards', navLabel: 'Board-24 cards' },
  { label: '36 cards', navLabel: 'Board-36 cards' },
];

@Component({
  selector: 'app-settings-screen',
  imports: [],
  templateUrl: './settings-screen.html',
  styleUrl: './settings-screen.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsScreen {
  readonly themes = THEMES;
  readonly players = PLAYERS;
  readonly boardSizes = BOARD_SIZES;

  selectedTheme = signal<Theme>(THEMES[0]);
  selectedPlayer = signal<Player | null>(null);
  selectedBoardSize = signal<BoardSize | null>(null);
  hoveredTheme = signal<Theme | null>(null);

  readonly activePreviewTheme = computed(() => this.hoveredTheme() ?? this.selectedTheme());
  readonly navThemeLabel = computed(() => this.selectedTheme().navLabel);
  readonly navPlayerLabel = computed(() => {
    const player = this.selectedPlayer();
    return player ? `${player.label} Player` : 'Player';
  });
  readonly navBoardSizeLabel = computed(() => this.selectedBoardSize()?.navLabel ?? 'Board size');
  readonly allSelectionsMade = computed(
    () => this.selectedPlayer() !== null && this.selectedBoardSize() !== null,
  );

  selectTheme(theme: Theme): void {
    this.selectedTheme.set(theme);
  }

  previewTheme(theme: Theme | null): void {
    this.hoveredTheme.set(theme);
  }

  selectPlayer(player: Player): void {
    this.selectedPlayer.set(player);
  }

  selectBoardSize(boardSize: BoardSize): void {
    this.selectedBoardSize.set(boardSize);
  }
}
