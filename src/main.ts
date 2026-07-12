import './style.css';
import { initPages } from './pages';
import { initAvatar } from './avatar';
import { initResume } from './resume';
import { initFilters } from './filters';
import { initEasterEggs } from './easter-eggs';
import { initRoamer } from './roamer';

document.addEventListener('DOMContentLoaded', () => {
  initPages();
  initAvatar();
  initResume();
  initFilters();
  initEasterEggs();
  initRoamer();
});
