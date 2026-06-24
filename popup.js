async function renderHosts() {
  const { SAVED_URL_KEY, SAVED_URL_KEY_LIST = [] } = await chrome.storage.sync.get([
    'SAVED_URL_KEY',
    'SAVED_URL_KEY_LIST',
  ]);

  const hosts = new Set(SAVED_URL_KEY_LIST);
  if (SAVED_URL_KEY) hosts.add(SAVED_URL_KEY);

  // Persist merged list
  await chrome.storage.sync.set({ SAVED_URL_KEY_LIST: Array.from(hosts) });

  const hostSection = document.getElementById('host-section');
  const emptySection = document.getElementById('empty-section');
  const hostList = document.getElementById('host-list');

  const validHosts = Array.from(hosts).filter(Boolean);

  if (validHosts.length === 0) return;

  emptySection.style.display = 'none';
  hostSection.style.display = 'block';

  for (const host of validHosts) {
    const li = document.createElement('li');
    li.className = 'host-item';
    li.title = host;

    const dot = document.createElement('span');
    dot.className = 'host-dot';

    const label = document.createElement('span');
    label.textContent = host;

    li.appendChild(dot);
    li.appendChild(label);
    hostList.appendChild(li);
  }
}

renderHosts().catch(console.error);
