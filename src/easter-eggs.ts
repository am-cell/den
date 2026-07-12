import { grantAccess } from './pages';
import { sayBubble } from './avatar';

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA',
];

function createParticle(x: number, y: number): void {
  const p = document.createElement('div');
  p.className = 'click-particle';
  p.style.left = `${x}px`;
  p.style.top = `${y}px`;
  p.style.background = `linear-gradient(45deg, hsl(${Math.random() * 60 + 220},70%,65%), hsl(${Math.random() * 60 + 260},60%,60%))`;
  document.body.appendChild(p);
  window.setTimeout(() => p.remove(), 2000);
}

export function initEasterEggs(): void {
  let logoClicks = 0;
  document.getElementById('logo')!.addEventListener('click', function (this: HTMLElement) {
    logoClicks++;
    if (logoClicks === 5) {
      this.style.animation = 'floaty 0.5s ease-in-out';
      sayBubble('You found the logo easter egg! 🥚');
      window.setTimeout(() => (this.style.animation = ''), 500);
      logoClicks = 0;
    }
  });

  let sequence: string[] = [];
  document.addEventListener('keydown', (e) => {
    sequence.push(e.code);
    if (sequence.length > KONAMI.length) sequence.shift();
    if (sequence.join('') === KONAMI.join('')) {
      grantAccess();
      sayBubble('🎉 Konami code! Secret access granted, nya~');
      sequence = [];
    }
  });

  document.querySelectorAll<HTMLElement>('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      for (let i = 0; i < 5; i++) {
        window.setTimeout(
          () =>
            createParticle(
              (e as MouseEvent).clientX + (Math.random() - 0.5) * 30,
              (e as MouseEvent).clientY + (Math.random() - 0.5) * 30,
            ),
          i * 100,
        );
      }
    });
  });
}
