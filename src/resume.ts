let countersDone = false;

function revealSection(container: HTMLElement): void {
  const items = container.querySelectorAll<HTMLElement>('.timeline-item, .award-card, .skill-chip');
  items.forEach((el, i) => {
    el.classList.remove('revealed');
    window.setTimeout(() => el.classList.add('revealed'), 80 + i * 90);
  });
}

function animateCounters(): void {
  if (countersDone) return;
  countersDone = true;
  document.querySelectorAll<HTMLElement>('.stat-chip .num').forEach((el) => {
    const target = parseInt(el.dataset.count ?? '0', 10);
    let current = 0;
    const step = (): void => {
      current++;
      el.textContent = String(current);
      if (current < target) window.setTimeout(step, 900 / target);
    };
    window.setTimeout(step, 300);
  });
}

function showResumeSection(section: string, tab: HTMLElement): void {
  document.querySelectorAll('.resume-section').forEach((s) => s.classList.remove('active'));
  document.querySelectorAll('.resume-tab').forEach((t) => t.classList.remove('active'));
  const el = document.getElementById(`resume-${section}`)!;
  el.classList.add('active');
  tab.classList.add('active');
  revealSection(el);
}

export function initResume(): void {
  document.querySelectorAll<HTMLElement>('.resume-tab').forEach((tab) => {
    tab.addEventListener('click', () => showResumeSection(tab.dataset.section!, tab));
  });

  document.querySelectorAll<HTMLElement>('.timeline-item').forEach((item) => {
    item.addEventListener('click', () => item.classList.toggle('open'));
  });

  document.addEventListener('resume-shown', () => {
    animateCounters();
    const active = document.querySelector<HTMLElement>('.resume-section.active');
    if (active) revealSection(active);
  });
}
