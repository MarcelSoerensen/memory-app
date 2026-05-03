import { Routes } from '@angular/router';
import { StartScreen } from './start-screen/start-screen';

export const routes: Routes = [
  { path: '', component: StartScreen },
  { path: 'settings', loadComponent: () => import('./settings-screen/settings-screen').then(m => m.SettingsScreen) },
];
