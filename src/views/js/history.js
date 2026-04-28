const api = window.lichen;

const historyList = document.getElementById('history-list');
const previewEmpty = document.getElementById('preview-empty');
const previewView = document.getElementById('preview-view');
const previewMedia = document.getElementById('preview-media');
const previewName = document.getElementById('preview-name');
const previewLink = document.getElementById('preview-link');
const previewCopy = document.getElementById('preview-copy');
const previewOpen = document.getElementById('preview-open');
const reloadHistoryButton = document.getElementById('reload-history');
const copySelectedButton = document.getElementById('copy-selected');

const state = {
  records: [],
  selectedRecord: null,
};

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function setPreview(record) {
  state.selectedRecord = record;

  if (!record) {
    previewEmpty.classList.remove('hidden');
    previewView.classList.add('hidden');
    previewMedia.innerHTML = '';
    return;
  }

  previewEmpty.classList.add('hidden');
  previewView.classList.remove('hidden');
  previewName.textContent = `${record.fileName} · ${record.serviceLabel}`;
  previewLink.textContent = record.directUrl;
  previewLink.href = record.directUrl;

  const isImage = /^image\//.test(record.mimeType ?? '') || /\.(png|jpg|jpeg|gif|webp|bmp)$/i.test(record.fileName ?? '');
  const isVideo = /^video\//.test(record.mimeType ?? '') || /\.(mp4|mov|webm)$/i.test(record.fileName ?? '');
  const isAudio = /^audio\//.test(record.mimeType ?? '') || /\.(mp3|wav|ogg)$/i.test(record.fileName ?? '');

  if (isImage) {
    previewMedia.innerHTML = `<img src="${escapeHtml(record.previewUrl ?? record.directUrl)}" alt="${escapeHtml(record.fileName)}">`;
  } else if (isVideo) {
    previewMedia.innerHTML = `<video controls src="${escapeHtml(record.previewUrl ?? record.directUrl)}"></video>`;
  } else if (isAudio) {
    previewMedia.innerHTML = `<audio controls src="${escapeHtml(record.previewUrl ?? record.directUrl)}"></audio>`;
  } else {
    previewMedia.innerHTML = `<div class="preview-placeholder">No embedded preview available for this file type.</div>`;
  }
}

function renderHistory() {
  if (state.records.length === 0) {
    historyList.classList.add('empty-state');
    historyList.textContent = 'No upload history yet.';
    setPreview(null);
    return;
  }

  historyList.classList.remove('empty-state');
  historyList.innerHTML = state.records.map((record, index) => `
    <button class="history-row ${state.selectedRecord?.id === record.id ? 'active' : ''}" data-index="${index}">
      <div>
        <strong>${escapeHtml(record.fileName)}</strong>
        <span>${escapeHtml(record.serviceLabel)}</span>
      </div>
      <small>${escapeHtml(record.uploadedAt ?? '')}</small>
    </button>
  `).join('');
}

async function loadHistory() {
  const history = await api.getHistory();
  state.records = history.records ?? [];
  if (!state.selectedRecord && state.records.length > 0) {
    setPreview(state.records[0]);
  }
  renderHistory();
}

historyList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-index]');
  if (!button) {
    return;
  }

  const record = state.records[Number(button.dataset.index)];
  setPreview(record);
  renderHistory();
});

previewCopy.addEventListener('click', async () => {
  if (!state.selectedRecord) {
    return;
  }

  await navigator.clipboard.writeText(state.selectedRecord.directUrl);
});

previewOpen.addEventListener('click', () => {
  if (!state.selectedRecord) {
    return;
  }

  window.open(state.selectedRecord.directUrl, '_blank', 'noreferrer');
});

reloadHistoryButton.addEventListener('click', () => loadHistory());
copySelectedButton.addEventListener('click', async () => {
  if (!state.selectedRecord) {
    return;
  }

  await navigator.clipboard.writeText(state.selectedRecord.directUrl);
});

loadHistory().catch(() => {
  historyList.textContent = 'Unable to load history.';
});