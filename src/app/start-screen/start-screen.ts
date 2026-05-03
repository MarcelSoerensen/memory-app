import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-start-screen',
  imports: [RouterLink],
  templateUrl: './start-screen.html',
  styleUrl: './start-screen.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartScreen {}
