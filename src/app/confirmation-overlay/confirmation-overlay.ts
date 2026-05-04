import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ThemeId } from '../game-settings.service';

@Component({
  selector: 'app-confirmation-overlay',
  imports: [],
  templateUrl: './confirmation-overlay.html',
  styleUrl: './confirmation-overlay.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationOverlay {
  readonly themeId = input<ThemeId>('code-vibes-theme');
  readonly cancel = output<void>();
  readonly confirm = output<void>();

  closeOverlay(): void {
    this.cancel.emit();
  }

  confirmExit(): void {
    this.confirm.emit();
  }
}
