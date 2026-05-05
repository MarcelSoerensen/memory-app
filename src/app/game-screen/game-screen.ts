import { ChangeDetectionStrategy, Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationOverlay } from '../confirmation-overlay/confirmation-overlay';
import { GameOverScreen } from '../game-over-screen/game-over-screen';
import { GameSettingsService, PlayerId } from '../game-settings.service';
import { Navbar } from '../navbar/navbar';
import { WinnerScreen } from '../winner-screen/winner-screen';

interface GameCard {
  id: string;
  imageUrl: string;
  pairId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

@Component({
  selector: 'app-game-screen',
  imports: [Navbar, ConfirmationOverlay, GameOverScreen, WinnerScreen],
  templateUrl: './game-screen.html',
  styleUrl: './game-screen.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameScreen {
  private readonly gameOverDelayMs = 1200;

  private readonly settings = inject(GameSettingsService);
  private readonly router = inject(Router);

  readonly themeId = computed(() => this.settings.selectedTheme().id);
  readonly columns = computed(() => this.settings.selectedBoardSize()?.cols ?? 4);
  readonly rows = computed(() => this.settings.selectedBoardSize()?.rows ?? 4);
  readonly cardBackUrl = computed(() => this.settings.cardBackUrl());
  readonly gameCards = signal<GameCard[]>([]);
  readonly isBoardLocked = signal(false);
  readonly scoreByPlayer = signal<Record<PlayerId, number>>({
    blue: 0,
    orange: 0,
  });
  readonly isExitOverlayOpen = signal(false);
  readonly isGameOver = computed(() => this.gameCards().length > 0 && this.gameCards().every((c) => c.isMatched));
  readonly showGameOverScreen = signal(false);
  readonly showWinnerScreen = signal(false);

  readonly playerOrder = computed<[PlayerId, PlayerId]>(() => {
    const selected = this.settings.selectedPlayer()?.id ?? 'blue';
    const second: PlayerId = selected === 'blue' ? 'orange' : 'blue';
    return [selected, second];
  });
  readonly activePlayerIndex = signal<0 | 1>(0);
  readonly activePlayerId = computed(() => this.playerOrder()[this.activePlayerIndex()]);

  private readonly openedCardIds = signal<string[]>([]);
  private gameOverTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.resetRoundState();
    this.createGameCards();
  }

  ngOnDestroy(): void {
    this.clearGameOverTimeout();
  }

  private resetRoundState(): void {
    this.activePlayerIndex.set(0);
    this.scoreByPlayer.set({ blue: 0, orange: 0 });
    this.openedCardIds.set([]);
    this.isBoardLocked.set(false);
    this.showGameOverScreen.set(false);
    this.showWinnerScreen.set(false);
    this.clearGameOverTimeout();
  }

  private createGameCards(): void {
    const totalCards = this.settings.selectedBoardSize()?.size ?? 16;
    const pairCount = totalCards / 2;

    const randomPairs = this.pickRandomCards(this.settings.allCards(), pairCount);
    const duplicatedCards = randomPairs.flatMap((cardUrl, pairIndex) => [
      {
        id: `${pairIndex}-a`,
        imageUrl: cardUrl,
        pairId: pairIndex,
        isFlipped: false,
        isMatched: false,
      },
      {
        id: `${pairIndex}-b`,
        imageUrl: cardUrl,
        pairId: pairIndex,
        isFlipped: false,
        isMatched: false,
      },
    ]);

    this.gameCards.set(this.shuffleCards(duplicatedCards));
  }

  flipCard(cardId: string): void {
    if (this.isBoardLocked()) {
      return;
    }

    const card = this.gameCards().find((entry) => entry.id === cardId);
    if (!card || card.isFlipped || card.isMatched) {
      return;
    }

    this.gameCards.update((cards) =>
      cards.map((card) => {
        if (card.id !== cardId) {
          return card;
        }

        return {
          ...card,
          isFlipped: true,
        };
      }),
    );

    this.openedCardIds.update((ids) => [...ids, cardId]);
    this.checkOpenedCards();
  }

  private checkOpenedCards(): void {
    const openedIds = this.openedCardIds();
    if (openedIds.length < 2) {
      return;
    }

    const [firstId, secondId] = openedIds;
    const cards = this.gameCards();
    const firstCard = cards.find((card) => card.id === firstId);
    const secondCard = cards.find((card) => card.id === secondId);

    if (!firstCard || !secondCard) {
      this.openedCardIds.set([]);
      return;
    }

    if (firstCard.pairId === secondCard.pairId) {
      this.markCardsAsMatched(firstId, secondId);
      this.addPointToActivePlayer();
      this.scheduleGameOverIfFinished();

      this.openedCardIds.set([]);
      return;
    }

    this.isBoardLocked.set(true);

    setTimeout(() => {
      this.gameCards.update((currentCards) =>
        currentCards.map((card) => {
          if (card.id !== firstId && card.id !== secondId) {
            return card;
          }

          return {
            ...card,
            isFlipped: false,
          };
        }),
      );

      this.openedCardIds.set([]);
      this.switchToNextPlayer();
      this.isBoardLocked.set(false);
    }, 800);
  }

  private markCardsAsMatched(firstId: string, secondId: string): void {
    this.gameCards.update((currentCards) =>
      currentCards.map((card) => {
        if (card.id !== firstId && card.id !== secondId) {
          return card;
        }

        return {
          ...card,
          isMatched: true,
        };
      }),
    );
  }

  private addPointToActivePlayer(): void {
    const active = this.activePlayerId();
    this.scoreByPlayer.update((scores) => ({
      ...scores,
      [active]: scores[active] + 1,
    }));
  }

  private switchToNextPlayer(): void {
    this.activePlayerIndex.update((index) => (index === 0 ? 1 : 0));
  }

  private scheduleGameOverIfFinished(): void {
    const allCardsMatched = this.gameCards().length > 0 && this.gameCards().every((card) => card.isMatched);
    if (!allCardsMatched || this.showGameOverScreen()) {
      return;
    }

    this.clearGameOverTimeout();
    this.gameOverTimeoutId = setTimeout(() => {
      this.showGameOverScreen.set(true);
      this.gameOverTimeoutId = null;
    }, this.gameOverDelayMs);
  }

  private clearGameOverTimeout(): void {
    if (this.gameOverTimeoutId === null) {
      return;
    }

    clearTimeout(this.gameOverTimeoutId);
    this.gameOverTimeoutId = null;
  }

  private pickRandomCards(cards: readonly string[], count: number): string[] {
    const shuffled = this.shuffleCards([...cards]);
    return shuffled.slice(0, count);
  }

  private shuffleCards<T>(items: T[]): T[] {
    const shuffled = [...items];

    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }

    return shuffled;
  }

  openExitOverlay(): void {
    this.isExitOverlayOpen.set(true);
  }

  closeExitOverlay(): void {
    this.isExitOverlayOpen.set(false);
  }

  confirmExitGame(): void {
    this.isExitOverlayOpen.set(false);
    void this.router.navigate(['/settings']);
  }

  showWinnerAfterGameOver(): void {
    this.showWinnerScreen.set(true);
  }
}
