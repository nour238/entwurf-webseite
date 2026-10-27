const menu = document.querySelector('.mobile-menu');

if (menu) {
  const summary = menu.querySelector('summary');
  const firstLink = menu.querySelector('.mobile-menu__nav a');
  const focusableSelector = 'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

  const closeMenu = () => {
    menu.open = false;
    document.body.classList.remove('menu-open');
    summary?.focus();
  };

  menu.addEventListener('toggle', () => {
    document.body.classList.toggle('menu-open', menu.open);
    if (menu.open) {
      requestAnimationFrame(() => firstLink?.focus());
    }
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.open = false;
      document.body.classList.remove('menu-open');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (!menu.open) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = [...menu.querySelectorAll(focusableSelector)].filter((element) => element.offsetParent !== null);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

const revealItems = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (revealItems.length > 0 && !reduceMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  );

  revealItems.forEach((item) => observer.observe(item));
}
