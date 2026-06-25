async function renderEventCount() {
  const { EVENT_COUNT = 0 } = await chrome.storage.local.get('EVENT_COUNT');
  document.getElementById('event-count').textContent = String(EVENT_COUNT);
}

async function renderSavedHost() {
  const { SAVED_URL_KEY = '' } = await chrome.storage.sync.get('SAVED_URL_KEY');
  const host = typeof SAVED_URL_KEY === 'string' ? SAVED_URL_KEY.trim() : '';

  const hostSection = document.getElementById('host-section');
  const emptySection = document.getElementById('empty-section');
  const hostValue = document.getElementById('host-value');
  const deleteBtn = document.getElementById('host-delete');

  if (!host) {
    hostSection.style.display = 'none';
    emptySection.style.display = 'block';
    return;
  }

  hostValue.textContent = host;
  hostValue.title = host;
  emptySection.style.display = 'none';
  hostSection.style.display = 'block';

  deleteBtn.addEventListener('click', async () => {
    await chrome.storage.sync.remove('SAVED_URL_KEY');
    hostSection.style.display = 'none';
    emptySection.style.display = 'block';
  });
}

renderEventCount().catch(console.error);
renderSavedHost().catch(console.error);
