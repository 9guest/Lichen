/**
 * Multi-page uploader with step-by-step upload flow and navigation.
 */
console.log('Renderer script loading...');
const api = window.lichen;
console.log('API bridge:', api);

const state = {
  supportedServices: [],
  settings: null,
  selectedFiles: [],
  selectedService: null,  // Single service only
  currentPage: 'upload',
  uploadQueue: [],  // Array of { id, serviceId, filePaths, status, progress, results }
  historyRecords: [],
  selectedHistoryRecord: null,
  selectedHistoryIds: [],
  historySearchQuery: '',
  historyServiceFilter: 'all',
  historyDateFrom: '',
  historyDateTo: '',
};

const THEME_OPTIONS = [
  { value: 'system', label: 'System default' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');

// Upload page
const serviceList = document.getElementById('service-list');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const selectedFilesEl = document.getElementById('selected-files');

// Tasks page
const tasksQueue = document.getElementById('tasks-queue');

// History page
const historySearchInput = document.getElementById('history-search');
const historyServiceFilter = document.getElementById('history-service-filter');
const historyDateFrom = document.getElementById('history-date-from');
const historyDateTo = document.getElementById('history-date-to');
const historySelectVisibleBtn = document.getElementById('history-select-visible');
const historyClearSelectionBtn = document.getElementById('history-clear-selection');
const historyList = document.getElementById('history-list');
const historyExportBtn = document.getElementById('history-export');

// Settings page
const settingsForm = document.getElementById('settings-form');

// Modals
const previewModal = document.getElementById('preview-modal');
const modalClose = document.getElementById('modal-close');
const modalPreviewMedia = document.getElementById('modal-preview-media');

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function showToast(message, duration = 3000) {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast success';
  toast.textContent = message;
  
  toastContainer.appendChild(toast);
  
  // Auto-dismiss after duration
  setTimeout(() => {
    toast.classList.add('fade-out');
    // Remove after fade animation completes
    setTimeout(() => {
      if (toast.parentNode) {
        toastContainer.removeChild(toast);
      }
    }, 300);
  }, duration);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function resolveTheme(theme) {
  if (theme === 'system') {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  return ['light', 'dark'].includes(theme) ? theme : 'light';
}

function applyTheme(theme) {
  const resolvedTheme = resolveTheme(theme);
  document.body.dataset.theme = resolvedTheme;
  document.documentElement.dataset.theme = resolvedTheme;
}

function showPage(pageName) {
  state.currentPage = pageName;
  pages.forEach((page) => {
    page.classList.remove('active');
    page.classList.add('hidden');
  });
  const targetPage = document.getElementById(`page-${pageName}`);
  targetPage.classList.add('active');
  targetPage.classList.remove('hidden');
  
  navItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.page === pageName);
  });

  if (pageName === 'upload') {
    renderServiceList();
  }

  if (pageName === 'tasks') {
    renderTasksList();
  }

  if (pageName === 'history') {
    loadHistory();
  }

  if (pageName === 'settings') {
    renderSettingsForm();
  }
}

// ============================================================================
// RENDER FUNCTIONS
// ============================================================================

function renderServiceList() {
  serviceList.innerHTML = state.supportedServices.map((service) => {
    const hasCredentials = state.settings?.services?.[service.id] && 
      (service.id === 'imgbb' 
        ? state.settings.services.imgbb.apiKey?.trim()
        : (state.settings.services.internetArchive.accessKey?.trim() && 
           state.settings.services.internetArchive.secretKey?.trim()));
    
    const restrictions = service.id === 'imgbb' 
      ? 'Images only, max 32 MB per file'
      : 'No file size limit';
    
    return `
      <label class="service-card ${!hasCredentials ? 'no-credentials' : ''}">
        <input type="radio" name="service" data-service-id="${escapeHtml(service.id)}" ${state.selectedService === service.id ? 'checked' : ''} ${!hasCredentials ? 'disabled' : ''}>
        <div>
          <strong>${escapeHtml(service.label)}</strong>
          <span>${hasCredentials ? 'Credentials configured' : 'Missing credentials'} · ${restrictions}</span>
        </div>
      </label>
    `;
  }).join('');
}

function renderTasksList() {
  if (state.uploadQueue.length === 0) {
    tasksQueue.classList.add('empty-state');
    tasksQueue.textContent = 'No uploads queued yet. Add files on the Upload page.';
    return;
  }

  tasksQueue.classList.remove('empty-state');
  tasksQueue.innerHTML = state.uploadQueue.map((task) => {
    const service = state.supportedServices.find((s) => s.id === task.serviceId);
    const progressPercent = Math.min(100, Math.max(0, task.progress || 0));
    const statusClass = task.status === 'completed' ? 'completed' : task.status === 'failed' ? 'failed' : 'in-progress';
    const statusLabel = task.status === 'completed' ? 'Completed' : task.status === 'failed' ? 'Failed' : 'Uploading';
    
    return `
      <article class="task-card ${statusClass}">
        <div class="task-info">
          <div>
            <strong>${escapeHtml(service?.label ?? task.serviceId)}</strong>
            <span>${task.filePaths.length} file(s)</span>
          </div>
          <div class="task-status">${statusLabel}</div>
        </div>
        <div class="progress-shell"><div class="progress-bar" style="width: ${progressPercent}%"></div></div>
        <div class="task-progress">${progressPercent}%</div>
        ${task.results && task.results.length > 0 ? `
          <div class="task-results">
            ${task.results.map((result) => `
              <div class="result-row ${result.status === 'failed' ? 'failed' : 'success'}">
                <span>${escapeHtml(result.fileName)}</span>
                ${result.status === 'failed' ? `<small>${escapeHtml(result.error ?? 'Failed')}</small>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
      </article>
    `;
  }).join('');
}

function getHistoryServiceNames(record) {
  if (Array.isArray(record?.services) && record.services.length > 0) {
    return record.services;
  }

  return [record?.serviceLabel ?? record?.uploadedBy ?? record?.serviceId ?? 'Unknown'];
}

function getFilteredHistoryRecords() {
  const query = state.historySearchQuery.trim().toLowerCase();
  const dateFrom = state.historyDateFrom ? new Date(state.historyDateFrom) : null;
  const dateTo = state.historyDateTo ? new Date(state.historyDateTo) : null;

  return state.historyRecords.filter((record) => {
    const serviceNames = getHistoryServiceNames(record);
    const matchesSearch = !query
      || [record.fileName, record.directUrl, record.serviceLabel, ...serviceNames]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));

    const matchesService = state.historyServiceFilter === 'all'
      || serviceNames.some((serviceName) => serviceName === state.historyServiceFilter);

    // Parse uploadedAt date for comparison
    let recordDate = null;
    if (record.uploadedAt) {
      // Extract date part from uploadedAt (format: YYYY-MM-DD or YYYY-MM-DD HH:MM:SS)
      const datePart = record.uploadedAt.split(' ')[0];
      recordDate = new Date(datePart);
    }

    // Adjust dateTo to end of day for inclusive comparison
    const dateToEndOfDay = dateTo ? new Date(dateTo.getTime() + 86400000) : null;

    const matchesDate = (!dateFrom || !recordDate || recordDate >= dateFrom)
      && (!dateToEndOfDay || !recordDate || recordDate <= dateToEndOfDay);

    return matchesSearch && matchesService && matchesDate;
  });
}

function syncHistorySelection() {
  const visibleIds = new Set(getFilteredHistoryRecords().map((record) => record.id));
  state.selectedHistoryIds = state.selectedHistoryIds.filter((id) => visibleIds.has(id) || state.historyRecords.some((record) => record.id === id));
}

function updateHistorySummary() {
  const count = state.selectedHistoryIds.length;
  const summary = document.getElementById('history-summary');
  if (summary) {
    summary.textContent = `${count} selected`;
  }
}

function populateHistoryServiceFilter() {
  if (!historyServiceFilter) {
    return;
  }

  const serviceNames = Array.from(new Set(state.historyRecords.flatMap((record) => getHistoryServiceNames(record)))).sort((a, b) => a.localeCompare(b));
  const currentValue = state.historyServiceFilter || 'all';

  historyServiceFilter.innerHTML = [`<option value="all">All services</option>`, ...serviceNames.map((serviceName) => `<option value="${escapeHtml(serviceName)}">${escapeHtml(serviceName)}</option>`)].join('');
  historyServiceFilter.value = serviceNames.includes(currentValue) || currentValue === 'all' ? currentValue : 'all';
}

function renderSelectedFiles() {
  if (state.selectedFiles.length === 0) {
    selectedFilesEl.classList.add('empty-state');
    selectedFilesEl.textContent = 'No files selected yet.';
    return;
  }

  selectedFilesEl.classList.remove('empty-state');
  selectedFilesEl.innerHTML = state.selectedFiles.map((filePath) => {
    const fileName = filePath.split(/[/\\]/).pop();
    return `<div class="list-row"><span>${escapeHtml(fileName)}</span><small>${escapeHtml(filePath)}</small></div>`;
  }).join('');
}

function renderSettingsForm() {
  const imgbb = state.settings?.services?.imgbb ?? {};
  const internetArchive = state.settings?.services?.internetArchive ?? {};
  const currentTheme = state.settings?.theme ?? 'system';

  settingsForm.innerHTML = `
    <div class="settings-group">
      <h3>Appearance</h3>
      <label>Theme
        <select data-setting="theme">
          ${THEME_OPTIONS.map((option) => `<option value="${escapeHtml(option.value)}" ${option.value === currentTheme ? 'selected' : ''}>${escapeHtml(option.label)}</option>`).join('')}
        </select>
      </label>
    </div>
    <div class="settings-group">
      <h3>imgbb <small>(Images only, max 32 MB)</small></h3>
      <label>API key<input data-setting="imgbb.apiKey" type="password" value="${escapeHtml(imgbb.apiKey ?? '')}" placeholder="Get your API key from imgbb.com"></label>
    </div>
    <div class="settings-group">
      <h3>Internet Archive <small>(No file size limit)</small></h3>
      <label>Access key<input data-setting="internetArchive.accessKey" type="text" value="${escapeHtml(internetArchive.accessKey ?? '')}" placeholder="Access key from archive.org"></label>
      <label>Secret key<input data-setting="internetArchive.secretKey" type="password" value="${escapeHtml(internetArchive.secretKey ?? '')}" placeholder="Secret key from archive.org"></label>
      <label>Identifier<input data-setting="internetArchive.identifier" type="text" value="${escapeHtml(internetArchive.identifier ?? '')}" placeholder="lichen-upload"></label>
      <label>Collection<input data-setting="internetArchive.collection" type="text" value="${escapeHtml(internetArchive.collection ?? '')}" placeholder="opensource"></label>
    </div>
  `;

  // Attach theme change listener for instant application
  const themeSelect = settingsForm.querySelector('[data-setting="theme"]');
  if (themeSelect) {
    themeSelect.addEventListener('change', async (event) => {
      const newTheme = event.target.value;
      state.settings.theme = newTheme;
      await api.saveSettings(state.settings);
      applyTheme(newTheme);
    });
  }
}

function collectSettings() {
  const nextSettings = {
    ...(state.settings ?? {}),
    theme: state.settings?.theme ?? 'system',
    services: {
      ...(state.settings?.services ?? {}),
      imgbb: {
        ...(state.settings?.services?.imgbb ?? {}),
      },
      internetArchive: {
        ...(state.settings?.services?.internetArchive ?? {}),
      },
    },
  };

  document.querySelectorAll('[data-setting]').forEach((input) => {
    const [serviceId, key] = input.dataset.setting.split('.');
    if (serviceId === 'theme') {
      nextSettings.theme = input.value;
      return;
    }

    nextSettings.services[serviceId][key] = input.value;
  });

  return nextSettings;
}

function renderHistory() {
  populateHistoryServiceFilter();
  syncHistorySelection();

  const visibleRecords = getFilteredHistoryRecords();

  if (visibleRecords.length === 0) {
    historyList.classList.add('empty-state');
    historyList.textContent = state.historyRecords.length === 0
      ? 'No upload history yet.'
      : 'No history items match the current filter.';
    updateHistorySummary();
    return;
  }

  historyList.classList.remove('empty-state');
  historyList.innerHTML = visibleRecords.map((record) => {
    const isSelected = state.selectedHistoryIds.includes(record.id);
    const serviceNames = getHistoryServiceNames(record);

    return `
      <article class="history-row ${isSelected ? 'active' : ''}" data-history-id="${escapeHtml(record.id)}">
        <label class="history-row-select" aria-label="Select ${escapeHtml(record.fileName)}">
          <input type="checkbox" data-history-select="${escapeHtml(record.id)}" ${isSelected ? 'checked' : ''}>
        </label>
        <div class="history-row-main">
          <strong>${escapeHtml(record.fileName)}</strong>
          <div class="history-row-meta">
            <span class="history-service-pill">${escapeHtml(serviceNames.join(', '))}</span>
            <small>${escapeHtml(record.uploadedAt ?? '')}</small>
          </div>
        </div>
        <div class="history-row-actions">
          <button class="ghost-button small icon-button" data-history-action="copy" data-history-id="${escapeHtml(record.id)}" title="Copy link" aria-label="Copy link">⧉</button>
          <button class="ghost-button small icon-button" data-history-action="preview" data-history-id="${escapeHtml(record.id)}" title="Open preview" aria-label="Open preview">◫</button>
          <button class="ghost-button small icon-button" data-history-action="browser" data-history-id="${escapeHtml(record.id)}" title="Open in browser" aria-label="Open in browser">↗</button>
        </div>
      </article>
    `;
  }).join('');

  updateHistorySummary();
}

// ============================================================================
// EVENT HANDLERS - NAVIGATION
// ============================================================================

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    const page = item.dataset.page;
    showPage(page);
  });
});

// ============================================================================
// EVENT HANDLERS - UPLOAD PAGE
// ============================================================================

document.getElementById('upload-start').addEventListener('click', async () => {
  if (!state.selectedService) {
    alert('Please select a service to upload to.');
    return;
  }

  if (state.selectedFiles.length === 0) {
    alert('Please select at least one file to upload.');
    return;
  }

  // Create a new task in the queue
  const taskId = `task-${Date.now()}`;
  const task = {
    id: taskId,
    serviceId: state.selectedService,
    filePaths: [...state.selectedFiles],
    status: 'in-progress',
    progress: 0,
    results: [],
  };

  state.uploadQueue.push(task);
  
  // Show toast notification
  showToast('Task added to queue!');
  
  // Reset the upload form
  state.selectedFiles = [];
  state.selectedService = null;
  renderServiceList();
  renderSelectedFiles();
  
  // Navigate to tasks page to show the queue
  showPage('tasks');

  // Start the upload in the background
  try {
    const uploadResults = await api.uploadFiles({
      filePaths: task.filePaths,
      serviceIds: [task.serviceId],
    });

    task.results = uploadResults;
    task.status = 'completed';
    task.progress = 100;
    renderTasksList();
    loadHistory();  // Refresh history to show new uploads
    showToast('Task completed!');
  } catch (error) {
    task.status = 'failed';
    renderTasksList();
  }
});

document.getElementById('upload-clear').addEventListener('click', () => {
  state.selectedFiles = [];
  renderSelectedFiles();
});

dropZone.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropZone.classList.remove('drag-over');
  addFiles(event.dataTransfer?.files ?? []);
});

dropZone.addEventListener('click', async () => {
  const filePaths = await api.openFileDialog();
  if (filePaths && filePaths.length > 0) {
    state.selectedFiles = Array.from(new Set([...state.selectedFiles, ...filePaths]));
    renderSelectedFiles();
  }
});
fileInput.addEventListener('change', () => addFiles(fileInput.files));

function addFiles(fileList) {
  const paths = Array.from(fileList ?? [])
    .map((file) => {
      // If it's already a string (from native dialog), use it directly
      if (typeof file === 'string') {
        return file;
      }
      // If it's a File object, extract the path
      return file.path || file.webkitRelativePath || file.name;
    })
    .filter(Boolean);
  state.selectedFiles = Array.from(new Set([...state.selectedFiles, ...paths]));
  renderSelectedFiles();
}

// Service selection
document.addEventListener('change', (event) => {
  if (event.target.name === 'service') {
    const serviceId = event.target.dataset.serviceId;

    // Check if selected service has credentials
    const hasCredentials = state.settings?.services?.[serviceId] && 
      (serviceId === 'imgbb' 
        ? state.settings.services.imgbb.apiKey?.trim()
        : (state.settings.services.internetArchive.accessKey?.trim() && 
           state.settings.services.internetArchive.secretKey?.trim()));

    if (!hasCredentials) {
      alert(`Missing credentials for ${serviceId}. Please go to Settings and add your credentials.`);
      event.target.checked = false;
      state.selectedService = null;
      showPage('settings');
      return;
    }

    state.selectedService = serviceId;
  }
});

// ============================================================================
// EVENT HANDLERS - RESULTS/UPLOAD
// ============================================================================

document.addEventListener('click', async (event) => {
  const copyButton = event.target.closest('[data-copy-link]');
  if (!copyButton) {
    return;
  }

  const text = copyButton.dataset.copyLink;
  await navigator.clipboard.writeText(text);
  alert('Link copied to clipboard!');
});

api.onUploadProgress((payload) => {
  // Update the current task in the queue with progress
  if (state.uploadQueue.length > 0) {
    const currentTask = state.uploadQueue[state.uploadQueue.length - 1];
    
    if (typeof payload?.progress === 'number') {
      currentTask.progress = payload.progress;
      renderTasksList();
    }

    if (payload?.stage === 'completed' && payload.result) {
      currentTask.results.push(payload.result);
      renderTasksList();
    }
  }
});

// ============================================================================
// EVENT HANDLERS - HISTORY PAGE
// ============================================================================

async function loadHistory() {
  const history = await api.getHistory();
  state.historyRecords = history.records ?? [];
  state.selectedHistoryIds = state.selectedHistoryIds.filter((id) => state.historyRecords.some((record) => record.id === id));
  renderHistory();
}

function getHistoryRecordById(recordId) {
  return state.historyRecords.find((record) => record.id === recordId);
}

function openHistoryPreview(record) {
  if (!record) {
    return;
  }

  window.open(record.directUrl, '_blank', 'noreferrer');
}

function openHistoryModal(record) {
  if (!record) {
    return;
  }

  const isImage = /^image\//.test(record.mimeType ?? '') || /\.(png|jpg|jpeg|gif|webp|bmp)$/i.test(record.fileName ?? '');
  const isVideo = /^video\//.test(record.mimeType ?? '') || /\.(mp4|mov|webm)$/i.test(record.fileName ?? '');
  const isAudio = /^audio\//.test(record.mimeType ?? '') || /\.(mp3|wav|ogg)$/i.test(record.fileName ?? '');

  if (isImage) {
    modalPreviewMedia.innerHTML = `<img src="${escapeHtml(record.previewUrl ?? record.directUrl)}" alt="${escapeHtml(record.fileName)}">`;
  } else if (isVideo) {
    modalPreviewMedia.innerHTML = `<video controls src="${escapeHtml(record.previewUrl ?? record.directUrl)}"></video>`;
  } else if (isAudio) {
    modalPreviewMedia.innerHTML = `<audio controls src="${escapeHtml(record.previewUrl ?? record.directUrl)}"></audio>`;
  } else {
    modalPreviewMedia.innerHTML = `
      <div class="preview-placeholder">
        <strong>${escapeHtml(record.fileName)}</strong>
        <span>No embedded preview available for this file type.</span>
      </div>
    `;
  }

  previewModal.classList.remove('hidden');
}

historyList.addEventListener('change', (event) => {
  const checkbox = event.target.closest('[data-history-select]');
  if (!checkbox) {
    return;
  }

  const recordId = checkbox.dataset.historySelect;
  if (checkbox.checked) {
    state.selectedHistoryIds = Array.from(new Set([...state.selectedHistoryIds, recordId]));
  } else {
    state.selectedHistoryIds = state.selectedHistoryIds.filter((id) => id !== recordId);
  }

  renderHistory();
});

historyList.addEventListener('click', (event) => {
  const actionButton = event.target.closest('[data-history-action]');
  if (!actionButton) {
    return;
  }

  const record = getHistoryRecordById(actionButton.dataset.historyId);
  if (!record) {
    return;
  }

  const action = actionButton.dataset.historyAction;
  if (action === 'copy') {
    navigator.clipboard.writeText(record.directUrl);
    showToast('Copied to clipboard!');
    return;
  }

  if (action === 'preview') {
    openHistoryPreview(record);
    return;
  }

  if (action === 'browser') {
    api.openExternalUrl(record.directUrl);
  }
});

document.getElementById('history-reload').addEventListener('click', () => loadHistory());

historySearchInput?.addEventListener('input', (event) => {
  state.historySearchQuery = event.target.value ?? '';
  renderHistory();
});

historyServiceFilter?.addEventListener('change', (event) => {
  state.historyServiceFilter = event.target.value || 'all';
  renderHistory();
});

historyDateFrom?.addEventListener('change', (event) => {
  state.historyDateFrom = event.target.value || '';
  renderHistory();
});

historyDateTo?.addEventListener('change', (event) => {
  state.historyDateTo = event.target.value || '';
  renderHistory();
});

historySelectVisibleBtn?.addEventListener('click', () => {
  const visibleIds = getFilteredHistoryRecords().map((record) => record.id);
  state.selectedHistoryIds = Array.from(new Set([...state.selectedHistoryIds, ...visibleIds]));
  renderHistory();
});

historyClearSelectionBtn?.addEventListener('click', () => {
  state.selectedHistoryIds = [];
  renderHistory();
});

historyExportBtn.addEventListener('click', () => {
  const exportRecords = state.historyRecords.filter((record) => state.selectedHistoryIds.includes(record.id) && record.directUrl);

  if (exportRecords.length === 0) {
    alert('Select at least one item to export.');
    return;
  }

  const exportData = exportRecords
    .map((record) => ({
      item: record.fileName,
      url: record.directUrl,
      services: getHistoryServiceNames(record),
    }));

  const jsonStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lichen-uploads-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Export completed!');
});

// ============================================================================
// EVENT HANDLERS - SETTINGS PAGE
// ============================================================================

document.getElementById('settings-save').addEventListener('click', async () => {
  // Collect only credentials, skip theme (which is now instant)
  const nextSettings = { ...state.settings };
  
  document.querySelectorAll('[data-setting]').forEach((input) => {
    const [serviceId, key] = input.dataset.setting.split('.');
    if (serviceId === 'theme') {
      // Skip theme - it's handled by instant change listener
      return;
    }

    if (!nextSettings.services[serviceId]) {
      nextSettings.services[serviceId] = {};
    }
    nextSettings.services[serviceId][key] = input.value;
  });
  
  state.settings = await api.saveSettings(nextSettings);
  renderServiceList();
  renderSettingsForm();
  alert('Credentials saved successfully!');
});

// ============================================================================
// EVENT HANDLERS - MODAL
// ============================================================================

modalClose.addEventListener('click', () => {
  previewModal.classList.add('hidden');
});

previewModal.addEventListener('click', (event) => {
  if (event.target === previewModal) {
    previewModal.classList.add('hidden');
  }
});

// ============================================================================
// INITIALIZATION
// ============================================================================

async function bootstrap() {
  console.log('Bootstrap starting...');
  try {
    const bootstrapData = await api.loadBootstrapData();
    console.log('Bootstrap data loaded:', bootstrapData);
    state.supportedServices = bootstrapData.services ?? [];
    state.settings = bootstrapData.settings ?? bootstrapData.defaults;
    state.historyRecords = bootstrapData.history?.records ?? [];

    console.log('Rendering UI...');
    applyTheme(state.settings.theme);
    renderServiceList();
    renderSettingsForm();
    renderSelectedFiles();
    renderTasksList();
    console.log('Bootstrap complete');
  } catch (error) {
    console.error('Bootstrap failed:', error);
    throw error;
  }
}

const colorSchemeMediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
colorSchemeMediaQuery?.addEventListener('change', () => {
  if (state.settings?.theme === 'system') {
    applyTheme('system');
  }
});

bootstrap().catch((error) => {
  console.error('Failed to bootstrap app:', error);
});

