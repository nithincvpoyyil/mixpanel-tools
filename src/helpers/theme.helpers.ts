import { Theme } from '../components/Toolbar';

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
}
