import { Injectable, computed, signal } from '@angular/core';

export type ThemeId = 'code-vibes-theme' | 'gaming-theme' | 'da-projects-theme' | 'foods-theme';
export type PlayerId = 'blue' | 'orange';
export type BoardSize = 16 | 24 | 36;

export interface ThemeOption {
  id: ThemeId;
  label: string;
  navLabel: string;
  preview: string;
}

export interface PlayerOption {
  id: PlayerId;
  label: string;
}

export interface BoardSizeOption {
  size: BoardSize;
  label: string;
  navLabel: string;
  cols: number;
  rows: number;
}

export const THEMES: ThemeOption[] = [
  { id: 'code-vibes-theme', label: 'Code vibes theme', navLabel: 'Code vibes', preview: '/assets/images/code-vibes-theme/theme-preview.svg' },
  { id: 'gaming-theme', label: 'Gaming theme', navLabel: 'Gaming', preview: '/assets/images/gaming-theme/theme-preview.svg' },
  { id: 'da-projects-theme', label: 'DA Projects theme', navLabel: 'DA Projects', preview: '/assets/images/da-projects-theme/theme-preview.svg' },
  { id: 'foods-theme', label: 'Foods theme', navLabel: 'Foods', preview: '/assets/images/foods-theme/theme-preview.svg' },
];

export const PLAYERS: PlayerOption[] = [
  { id: 'blue', label: 'Blue' },
  { id: 'orange', label: 'Orange' },
];

export const BOARD_SIZES: BoardSizeOption[] = [
  { size: 16, label: '16 cards', navLabel: 'Board-16 cards', cols: 4, rows: 4 },
  { size: 24, label: '24 cards', navLabel: 'Board-24 cards', cols: 6, rows: 4 },
  { size: 36, label: '36 cards', navLabel: 'Board-36 cards', cols: 6, rows: 6 },
];

@Injectable({ providedIn: 'root' })
export class GameSettingsService {
  selectedTheme = signal<ThemeOption>(THEMES[0]);
  selectedPlayer = signal<PlayerOption | null>(null);
  selectedBoardSize = signal<BoardSizeOption | null>(null);

  readonly themeFolder = computed(() => this.selectedTheme().id);

  readonly cardBackUrl = computed(
    () => `/assets/images/${this.themeFolder()}/card-back.svg`,
  );

  readonly allCards = computed(() =>
    Array.from({ length: 18 }, (_, i) =>
      `/assets/images/${this.themeFolder()}/card-${i + 1}.svg`,
    ),
  );

  readonly playerImageUrl = computed(() => {
    const player = this.selectedPlayer();
    if (!player) return null;
    return `/assets/images/${this.themeFolder()}/player-${player.id}.svg`;
  });

  readonly winImageUrl = computed(() => {
    const player = this.selectedPlayer();
    if (!player) return null;
    return `/assets/images/${this.themeFolder()}/win-${player.id}.svg`;
  });
}
