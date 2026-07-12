const pageIds = ['home', 'resume', 'projects', 'blog', 'photos'] as const;
export type PageId = (typeof pageIds)[number];

const protectedPages: PageId[] = ['blog', 'photos'];
const SECRET_PHRASE = 'rainbow unicorn';

let hasAccess = false;

export function grantAccess(): void {
  hasAccess = true;
}

export function showPage(pageId: PageId): void {
  if (protectedPages.includes(pageId) && !hasAccess) {
    showGate(pageId);
    return;
  }
  pageIds.forEach((id) => document.getElementById(id)?.classList.remove('active'));
  document.getElementById(pageId)?.classList.add('active');
  window.scrollTo({ top: 0 });
  if (pageId === 'resume') {
    document.dispatchEvent(new CustomEvent('resume-shown'));
  }
}

function gate(): HTMLElement {
  return document.getElementById('secret-gate')!;
}

function showGate(targetPage: PageId): void {
  gate().classList.remove('hidden');
  gate().dataset.target = targetPage;
}

function hideGate(): void {
  gate().classList.add('hidden');
  document.getElementById('gate-error')!.classList.remove('show');
  (document.getElementById('secret-phrase') as HTMLInputElement).value = '';
}

function checkSecretPhrase(): void {
  const input = (document.getElementById('secret-phrase') as HTMLInputElement).value
    .toLowerCase()
    .trim();
  const targetPage = gate().dataset.target as PageId | undefined;
  if (input === SECRET_PHRASE && targetPage) {
    hasAccess = true;
    hideGate();
    showPage(targetPage);
  } else {
    document.getElementById('gate-error')!.classList.add('show');
  }
}

function requestAccess(): void {
  const email = 'ammarbinirfan2003@gmail.com';
  const subject = encodeURIComponent('Access Request for Secret Pages');
  const body = encodeURIComponent(
    "Hi! I'd like to request access to your blog and photos pages.\n\nMy email: \nWhy I'm interested: \n\nThanks!",
  );
  window.open(
    `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`,
    '_blank',
  );
}

export function initPages(): void {
  document.querySelectorAll<HTMLElement>('[data-page]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(el.dataset.page as PageId);
    });
  });

  document.getElementById('gate-enter')!.addEventListener('click', checkSecretPhrase);
  document.getElementById('gate-request')!.addEventListener('click', requestAccess);
  document.getElementById('gate-back')!.addEventListener('click', hideGate);
  document.getElementById('secret-phrase')!.addEventListener('keypress', (e) => {
    if ((e as KeyboardEvent).key === 'Enter') checkSecretPhrase();
  });

  showPage('home');
}
