function bindFilter(buttonSelector: string, itemSelector: string): void {
  const buttons = document.querySelectorAll<HTMLElement>(buttonSelector);
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.dataset.filter!;
      document.querySelectorAll<HTMLElement>(itemSelector).forEach((item) => {
        item.style.display =
          category === 'all' || item.dataset.category === category ? 'block' : 'none';
      });
    });
  });
}

export function initFilters(): void {
  bindFilter('.category-btn', '.project-card');
  bindFilter('.filter-btn', '.blog-post');

  document.querySelectorAll<HTMLElement>('.blog-post').forEach((post) => {
    post.addEventListener('click', () => {
      const title = post.querySelector('h3')?.textContent ?? '';
      alert(`Full post viewer coming soon! 📝\n\n"${title}" would open in a dedicated reader view.`);
    });
  });
}
