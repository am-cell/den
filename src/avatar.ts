import avatarUrl from './avatar.svg';

const INTRO_MESSAGES = ['Hello~ 😽', "How YOU doin'? 😏"];

const PET_MESSAGES = [
  'purrrrrr… 😌',
  'Oh, hi again. Missed me? 😏',
  "You've got gentle hands~",
  'Careful, I fall fast 💘',
  '*bats eyelashes*',
  "That's the spot 😽",
  "Keep that up and I'm yours.",
  'You come here often? 😼',
  'Smooth. Very smooth.',
  'meow~ 💕',
];

const IDLE_LINES = [
  'Still here? I like that 😏',
  '*ear twitch*',
  '*wink*',
  'You have nice taste in websites~',
  '*stares at cursor like it\'s a laser pointer*',
];

let bubbleTimer: number | undefined;
let petCount = 0;
let introPlayed = false;

const frame = (): HTMLElement => document.getElementById('avatar-frame')!;
const bubble = (): HTMLElement => document.getElementById('speech-bubble')!;
const stage = (): HTMLElement => document.getElementById('avatar-stage')!;

export function sayBubble(text: string, duration = 2200): void {
  window.clearTimeout(bubbleTimer);
  bubble().textContent = text;
  bubble().classList.add('show');
  bubbleTimer = window.setTimeout(() => bubble().classList.remove('show'), duration);
}

function wiggle(): void {
  frame().classList.remove('wiggle');
  void frame().offsetWidth;
  frame().classList.add('wiggle');
}

function playIntro(): void {
  if (introPlayed) return;
  introPlayed = true;
  INTRO_MESSAGES.forEach((msg, i) => {
    window.setTimeout(() => {
      sayBubble(msg, i === INTRO_MESSAGES.length - 1 ? 3000 : 2100);
      wiggle();
    }, 900 + i * 2400);
  });
}

function spawnHeart(): void {
  const heart = document.createElement('div');
  heart.className = 'heart-particle';
  heart.textContent = ['💛', '✨', '🐾', '💚'][Math.floor(Math.random() * 4)];
  heart.style.left = `${20 + Math.random() * 60}%`;
  heart.style.top = `${30 + Math.random() * 40}%`;
  frame().appendChild(heart);
  requestAnimationFrame(() => {
    heart.style.transform = `translateY(-90px) rotate(${(Math.random() - 0.5) * 60}deg)`;
    heart.style.opacity = '0';
  });
  window.setTimeout(() => heart.remove(), 1500);
}

function onPet(): void {
  petCount++;
  const msg =
    petCount === 10
      ? "TEN pets?! Buy me dinner first… okay fine, I'm yours 😻"
      : PET_MESSAGES[Math.floor(Math.random() * PET_MESSAGES.length)];
  sayBubble(msg, 2400);
  wiggle();
  const meter = document.getElementById('pet-meter')!;
  meter.textContent = `pets received: ${petCount} ${petCount >= 10 ? '· max affection reached 💛' : ''}`;
  meter.classList.add('show');
  spawnHeart();
}

function initTilt(): void {
  stage().addEventListener('mousemove', (e) => {
    const rect = frame().getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    frame().style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`;
    frame().style.animationPlayState = 'paused';
  });
  stage().addEventListener('mouseleave', () => {
    frame().style.transform = '';
    frame().style.animationPlayState = 'running';
  });
}

function initIdleChatter(): void {
  window.setInterval(() => {
    const homeActive = document.getElementById('home')!.classList.contains('active');
    if (homeActive && introPlayed && Math.random() < 0.6 && !bubble().classList.contains('show')) {
      sayBubble(IDLE_LINES[Math.floor(Math.random() * IDLE_LINES.length)], 2600);
    }
  }, 14000);
}

function makeSootSVG(): string {
  const lines = Array.from({ length: 14 }, () => {
    const a = Math.random() * Math.PI * 2;
    const r = 13 + Math.random() * 6;
    return `<line x1="20" y1="20" x2="${20 + Math.cos(a) * r}" y2="${20 + Math.sin(a) * r}" stroke="#2b2b2b" stroke-width="1.6" stroke-linecap="round"/>`;
  }).join('');
  return `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g>${lines}
    <circle cx="20" cy="20" r="12" fill="#2b2b2b"/>
    <circle cx="16" cy="18" r="3.4" fill="white"/>
    <circle cx="24" cy="18" r="3.4" fill="white"/>
    <circle cx="16.8" cy="18.6" r="1.5" fill="black"/>
    <circle cx="24.8" cy="18.6" r="1.5" fill="black"/></g></svg>`;
}

function spawnSootSprites(): void {
  const positions: Partial<CSSStyleDeclaration>[] = [
    { left: '-8%', top: '12%' },
    { right: '-9%', top: '38%' },
    { left: '-5%', bottom: '18%' },
    { right: '-4%', bottom: '6%' },
  ];
  positions.forEach((pos, i) => {
    const s = document.createElement('div');
    s.className = 'soot';
    s.innerHTML = makeSootSVG();
    Object.assign(s.style, pos);
    s.style.animationDelay = `${i * 1.7}s`;
    s.style.animationDuration = `${8 + i * 1.3}s`;
    stage().appendChild(s);
  });
}

function spawnClouds(): void {
  const bg = document.getElementById('home-bg')!;
  for (let i = 0; i < 4; i++) {
    const c = document.createElement('div');
    c.className = 'cloud';
    const w = 120 + Math.random() * 140;
    c.style.width = `${w}px`;
    c.style.height = `${w * 0.35}px`;
    c.style.top = `${5 + Math.random() * 55}%`;
    c.style.animationDuration = `${45 + Math.random() * 40}s`;
    c.style.animationDelay = `${-Math.random() * 45}s`;
    bg.appendChild(c);
  }
}

export function initAvatar(): void {
  (document.getElementById('avatar-img') as HTMLImageElement).src = avatarUrl;
  frame().addEventListener('click', onPet);
  initTilt();
  initIdleChatter();
  spawnSootSprites();
  spawnClouds();
  window.setTimeout(playIntro, 400);
}
