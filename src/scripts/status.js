import { formatTime, getOpenState } from '../lib/hours.js';

const target = document.querySelector('[data-open-status]');
const data = document.getElementById('hours-data');

if (target && data) {
  const update = () => {
    try {
      const hours = JSON.parse(data.textContent || '{}');
      const status = getOpenState(hours);

      if (status.state === 'open') {
        target.textContent = `Heute geöffnet bis ${formatTime(status.closesAt)}`;
      } else if (status.state === 'closed') {
        target.textContent = status.opensAt
          ? `Heute geschlossen. Öffnet um ${formatTime(status.opensAt)}.`
          : 'Heute geschlossen.';
      } else {
        target.textContent = 'Öffnungszeiten folgen.';
      }
    } catch {
      target.textContent = 'Öffnungszeiten';
    }
  };

  update();
  window.setInterval(update, 60_000);
}
