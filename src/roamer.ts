import avatarUrl from './avatar.svg';

const PEEK_LINES = ['👀', 'boo!', 'psst… hi', 'you saw nothing', '*spying*'];
const WALK_LINES = ['just passing by~', 'la la la 🎶', "don't mind me", '*important cat business*'];
const CLICK_LINES = ['meep!', "ok ok, I'm going!", 'caught me! 😳'];

let root: HTMLDivElement;
let waddleBox: HTMLDivElement;
let img: HTMLImageElement;
let bubbleEl: HTMLDivElement;
let bubbleTimer: number | undefined;
let busy = false;
let speedBoost = 1;
let mode: 'idle' | 'walking' | 'peeking' = 'idle';
let retreatFn: (() => void) | null = null;

function build(): void {
  root = document.createElement('div');
  root.id = 'roamer';
  root.className = 'roamer';

  bubbleEl = document.createElement('div');
  bubbleEl.className = 'roamer-bubble';

  waddleBox = document.createElement('div');
  waddleBox.className = 'roamer-waddle';

  img = document.createElement('img');
  img.src = avatarUrl;
  img.alt = '';
  img.draggable = false;

  waddleBox.appendChild(img);
  root.appendChild(bubbleEl);
  root.appendChild(waddleBox);
  document.body.appendChild(root);

  root.addEventListener('click', onCatch);
}

function say(text: string, ms = 1800): void {
  window.clearTimeout(bubbleTimer);
  bubbleEl.textContent = text;
  bubbleEl.classList.add('show');
  bubbleTimer = window.setTimeout(() => bubbleEl.classList.remove('show'), ms);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function hide(): void {
  root.style.display = 'none';
  root.classList.remove('walking');
  root.style.transition = '';
  mode = 'idle';
  busy = false;
  speedBoost = 1;
  retreatFn = null;
}

function scheduleNext(first = false): void {
  const delay = first ? 9000 : 14000 + Math.random() * 18000;
  window.setTimeout(() => {
    if (document.hidden || busy) {
      scheduleNext();
      return;
    }
    Math.random() < 0.5 ? walkAcross() : peek();
  }, delay);
}

/* ---- walk across the bottom of the viewport ---- */
function walkAcross(): void {
  busy = true;
  mode = 'walking';
  const w = 130;
  const vw = window.innerWidth;
  const dir = Math.random() < 0.5 ? 1 : -1;
  let x = dir === 1 ? -w - 30 : vw + 30;
  const endX = dir === 1 ? vw + 30 : -w - 30;
  const speed = 85; // px/s

  root.style.cssText = `display:block; left:0; top:auto; bottom:-8px; width:${w}px;`;
  img.style.transform = dir === 1 ? 'scaleX(1)' : 'scaleX(-1)';
  root.classList.add('walking');

  let paused = false;
  if (Math.random() < 0.4) {
    // pause mid-walk for a one-liner
    window.setTimeout(() => {
      paused = true;
      root.classList.remove('walking');
      say(pick(WALK_LINES), 1900);
      window.setTimeout(() => {
        paused = false;
        root.classList.add('walking');
      }, 2000);
    }, 3000 + Math.random() * 3000);
  }

  let last = performance.now();
  function step(now: number): void {
    if (mode !== 'walking') return;
    const dt = (now - last) / 1000;
    last = now;
    if (!paused) x += dir * speed * speedBoost * dt;
    root.style.transform = `translateX(${x}px)`;
    if ((dir === 1 && x >= endX) || (dir === -1 && x <= endX)) {
      hide();
      scheduleNext();
      return;
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ---- peek from an edge ---- */
function peek(): void {
  busy = true;
  mode = 'peeking';
  const side = pick(['left', 'right', 'bottom']);
  const w = 150;

  root.style.cssText = `display:block; width:${w}px; transition:none;`;
  img.style.transform = 'scaleX(1)';

  let from = '';
  let to = '';
  if (side === 'left') {
    root.style.left = '0';
    root.style.top = `${25 + Math.random() * 40}%`;
    from = 'translate(-105%, -50%) rotate(8deg)';
    to = 'translate(-52%, -50%) rotate(8deg)';
  } else if (side === 'right') {
    root.style.left = 'auto';
    root.style.right = '0';
    root.style.top = `${25 + Math.random() * 40}%`;
    img.style.transform = 'scaleX(-1)';
    from = 'translate(105%, -50%) rotate(-8deg)';
    to = 'translate(52%, -50%) rotate(-8deg)';
  } else {
    root.style.left = `${15 + Math.random() * 60}%`;
    root.style.top = 'auto';
    root.style.bottom = '-8px';
    from = 'translateY(108%)';
    to = 'translateY(52%)';
  }

  root.style.transform = from;
  void root.offsetWidth; // reflow
  root.style.transition = 'transform 0.9s cubic-bezier(0.34, 1.4, 0.64, 1)';
  root.style.transform = to;

  window.setTimeout(() => say(pick(PEEK_LINES), 1900), 900);

  const retreat = (): void => {
    retreatFn = null;
    root.style.transition = 'transform 0.6s ease-in';
    root.style.transform = from;
    window.setTimeout(() => {
      hide();
      scheduleNext();
    }, 650);
  };
  retreatFn = retreat;
  window.setTimeout(() => {
    if (retreatFn) retreat();
  }, 3400);
}

/* ---- clicking the roamer ---- */
function onCatch(): void {
  say(pick(CLICK_LINES), 1400);
  if (mode === 'walking') {
    speedBoost = 4.5;
  } else if (mode === 'peeking' && retreatFn) {
    window.setTimeout(() => retreatFn && retreatFn(), 500);
  }
}

export function initRoamer(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  build();
  hide();
  scheduleNext(true);
}
