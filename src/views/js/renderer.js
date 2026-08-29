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
      : 'Not be over 100GB, not contain more than 10,000 files';
    
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

function getFileIconClass(fileName = '', mimeType = '') {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext) || mimeType.startsWith('image/')) {
    return 'fa-regular fa-file-image';
  }
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext) || mimeType.startsWith('video/')) {
    return 'fa-regular fa-file-video';
  }
  if (['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(ext) || mimeType.startsWith('audio/')) {
    return 'fa-regular fa-file-audio';
  }
  if (['pdf'].includes(ext) || mimeType === 'application/pdf') {
    return 'fa-regular fa-file-pdf';
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
    return 'fa-regular fa-file-zipper';
  }
  if (['txt', 'md', 'json', 'js', 'html', 'css'].includes(ext)) {
    return 'fa-regular fa-file-lines';
  }
  return 'fa-regular fa-file';
}

function formatDuration(ms) {
  if (!ms || ms < 0) return '';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
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
    const isCompleted = task.status === 'completed';
    const isFailed = task.status === 'failed';
    const isCancelled = task.status === 'cancelled';
    const isInProgress = task.status === 'in-progress';

    let statusBadgeText = 'Uploading';
    let statusBadgeIcon = '<i class="fa-solid fa-spinner fa-spin"></i>';
    let statusClass = 'in-progress';

    if (isCompleted) {
      statusBadgeText = task.failedCount > 0 ? 'Completed with errors' : 'Completed';
      statusBadgeIcon = task.failedCount > 0 ? '<i class="fa-solid fa-triangle-exclamation"></i>' : '<i class="fa-solid fa-check"></i>';
      statusClass = task.failedCount > 0 ? 'completed-warning' : 'completed';
    } else if (isFailed) {
      statusBadgeText = 'Failed';
      statusBadgeIcon = '<i class="fa-solid fa-xmark"></i>';
      statusClass = 'failed';
    } else if (isCancelled) {
      statusBadgeText = 'Cancelled';
      statusBadgeIcon = '<i class="fa-solid fa-ban"></i>';
      statusClass = 'cancelled';
    }

    const files = task.files || [];
    const completedCount = task.completedCount || files.filter(f => f.status === 'completed').length;
    const failedCount = task.failedCount || files.filter(f => f.status === 'failed').length;
    const totalFiles = files.length || task.filePaths?.length || 0;

    return `
      <article class="task-card ${statusClass}" data-task-id="${escapeHtml(task.id)}">
        <div class="task-card-header">
          <div class="task-title-group">
            <span class="task-service-badge"><i class="fa-solid fa-cloud"></i> ${escapeHtml(service?.label ?? task.serviceId)}</span>
            <span class="task-stats-summary">${completedCount}/${totalFiles} completed${failedCount > 0 ? ` · <span class="text-danger">${failedCount} failed</span>` : ''}</span>
          </div>
          <div class="task-header-actions">
            <span class="task-status-pill ${statusClass}">${statusBadgeIcon} ${statusBadgeText}</span>
            ${isInProgress ? `<button class="ghost-button small danger-button" data-task-action="cancel" data-task-id="${escapeHtml(task.id)}" title="Cancel upload">Cancel</button>` : ''}
          </div>
        </div>

        <div class="task-progress-section">
          <div class="progress-shell"><div class="progress-bar ${isInProgress ? 'animated-striped' : ''}" style="width: ${progressPercent}%"></div></div>
          <span class="task-progress-percent">${progressPercent}%</span>
        </div>

        ${isInProgress && task.currentFile ? `
          <div class="active-file-indicator">
            <span class="active-file-pulse"><i class="fa-solid fa-cloud-arrow-up fa-bounce"></i></span>
            <div class="active-file-details">
              <span class="active-file-name">Uploading [${task.currentFile.index}/${task.currentFile.total}]: <strong>${escapeHtml(task.currentFile.fileName)}</strong></span>
              ${task.currentFile.fileSize ? `<span class="active-file-size">${escapeHtml(task.currentFile.fileSize)}</span>` : ''}
            </div>
          </div>
        ` : ''}

        <div class="task-files-container">
          <div class="task-files-list">
            ${files.map((file) => {
              const fileIcon = getFileIconClass(file.fileName, file.mimeType);
              let stateIcon = '<i class="fa-regular fa-clock text-muted"></i>';
              let stateText = 'Queued';
              let rowStatusClass = 'file-pending';

              if (file.status === 'uploading') {
                stateIcon = '<i class="fa-solid fa-spinner fa-spin text-accent"></i>';
                stateText = 'Uploading...';
                rowStatusClass = 'file-uploading';
              } else if (file.status === 'completed') {
                stateIcon = '<i class="fa-solid fa-circle-check text-success"></i>';
                stateText = file.uploadedInMs ? `Done in ${formatDuration(file.uploadedInMs)}` : 'Done';
                rowStatusClass = 'file-completed';
              } else if (file.status === 'failed') {
                stateIcon = '<i class="fa-solid fa-circle-exclamation text-danger"></i>';
                stateText = file.error || 'Failed';
                rowStatusClass = 'file-failed';
              } else if (file.status === 'cancelled') {
                stateIcon = '<i class="fa-solid fa-ban text-muted"></i>';
                stateText = 'Cancelled';
                rowStatusClass = 'file-cancelled';
              }

              return `
                <div class="task-file-row ${rowStatusClass}">
                  <div class="task-file-type-icon"><i class="${fileIcon}"></i></div>
                  <div class="task-file-main">
                    <div class="task-file-title-row">
                      <strong class="task-file-name" title="${escapeHtml(file.fileName)}">${escapeHtml(file.fileName)}</strong>
                      ${file.formattedSize ? `<span class="task-file-size-tag">${escapeHtml(file.formattedSize)}</span>` : ''}
                    </div>
                    <div class="task-file-sub-row">
                      <span class="task-file-state-icon">${stateIcon}</span>
                      <span class="task-file-state-text" title="${escapeHtml(stateText)}">${escapeHtml(stateText)}</span>
                    </div>
                  </div>
                  ${file.status === 'completed' && file.directUrl ? `
                    <div class="task-file-actions">
                      <button class="ghost-button small icon-button" data-copy-link="${escapeHtml(file.directUrl)}" title="Copy link" aria-label="Copy link">⧉</button>
                      <button class="ghost-button small icon-button" data-open-link="${escapeHtml(file.directUrl)}" title="Open in browser" aria-label="Open in browser">↗</button>
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
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
  const services = Array.isArray(state.supportedServices) ? state.supportedServices : [];
  const currentTheme = state.settings?.theme ?? 'system';

  const serviceSections = services.map((service) => {
    const serviceSettings = state.settings?.services?.[service.id] ?? {};
    const apiLink = service.apiLink
      ? `<a class="settings-help-link" href="${escapeHtml(service.apiLink)}" data-api-link="${escapeHtml(service.apiLink)}">Get the API key</a>`
      : '';

    if (service.id === 'imgbb') {
      return `
        <div class="settings-group">
          <h3>${escapeHtml(service.label)} <small>(${escapeHtml(service.restrictions ?? '')})</small></h3>
          <label>API key
            <input data-setting="imgbb.apiKey" type="password" value="${escapeHtml(serviceSettings.apiKey ?? '')}" placeholder="Enter your imgbb API key">
            <span class="settings-help">${apiLink}</span>
          </label>
        </div>
      `;
    }

    if (service.id === 'internetArchive') {
      return `
        <div class="settings-group">
          <h3>${escapeHtml(service.label)} <small>(${escapeHtml(service.restrictions ?? '')})</small></h3>
          <label>Secret key<input data-setting="internetArchive.secretKey" type="password" value="${escapeHtml(serviceSettings.secretKey ?? '')}" placeholder="Secret key from archive.org"></label>
          <label>Identifier<input data-setting="internetArchive.identifier" type="text" value="${escapeHtml(serviceSettings.identifier ?? '')}" placeholder="lichen-upload"></label>
          <label>Collection<input data-setting="internetArchive.collection" type="text" value="${escapeHtml(serviceSettings.collection ?? '')}" placeholder="opensource"></label>
          <label>Access key
            <input data-setting="internetArchive.accessKey" type="text" value="${escapeHtml(serviceSettings.accessKey ?? '')}" placeholder="Access key from archive.org">
            <span class="settings-help">${apiLink}</span>
          </label>
        </div>
      `;
    }

    return '';
  }).join('');

  settingsForm.innerHTML = `
    <div class="settings-group">
      <h3>Appearance</h3>
      <label>Theme
        <select data-setting="theme">
          ${THEME_OPTIONS.map((option) => `<option value="${escapeHtml(option.value)}" ${option.value === currentTheme ? 'selected' : ''}>${escapeHtml(option.label)}</option>`).join('')}
        </select>
      </label>
    </div>
    ${serviceSections}
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

settingsForm.addEventListener('click', (event) => {
  const apiLink = event.target.closest('[data-api-link]');
  if (!apiLink) {
    return;
  }

  event.preventDefault();
  api.openExternalUrl(apiLink.dataset.apiLink);
});

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
  const totalCountEl = document.getElementById('history-total-count');
  const servicesCountEl = document.getElementById('history-services-count');
  const selectedCountEl = document.getElementById('history-selected-count');

  if (totalCountEl) totalCountEl.textContent = state.historyRecords.length;
  if (servicesCountEl) {
    const uniqueServices = new Set(state.historyRecords.flatMap(getHistoryServiceNames));
    servicesCountEl.textContent = uniqueServices.size;
  }
  if (selectedCountEl) selectedCountEl.textContent = state.selectedHistoryIds.length;

  if (visibleRecords.length === 0) {
    historyList.classList.add('empty-state');
    historyList.innerHTML = `
      <div class="history-empty-container">
        <i class="fa-regular fa-folder-open empty-icon"></i>
        <strong>${state.historyRecords.length === 0 ? 'No upload history yet' : 'No matching files found'}</strong>
        <p>${state.historyRecords.length === 0 ? 'Uploaded files will appear here automatically.' : 'Try adjusting your search query or filters.'}</p>
      </div>
    `;
    updateHistorySummary();
    return;
  }

  historyList.classList.remove('empty-state');
  historyList.innerHTML = visibleRecords.map((record) => {
    const isSelected = state.selectedHistoryIds.includes(record.id);
    const serviceNames = getHistoryServiceNames(record);
    const fileIcon = getFileIconClass(record.fileName, record.mimeType);
    const isImage = /^image\//.test(record.mimeType ?? '') || /\.(png|jpg|jpeg|gif|webp|bmp|svg)$/i.test(record.fileName ?? '');
    
    // Format timestamp nicely
    let formattedDate = record.uploadedAt || '';
    try {
      if (record.uploadedAt) {
        const d = new Date(record.uploadedAt);
        if (!isNaN(d.getTime())) {
          formattedDate = d.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        }
      }
    } catch {}

    const sizeDisplay = record.formattedSize || (record.fileSize ? formatBytes(record.fileSize) : '');

    return `
      <article class="history-card ${isSelected ? 'selected' : ''}" data-history-id="${escapeHtml(record.id)}">
        <div class="history-card-left">
          <label class="history-checkbox-wrap" aria-label="Select ${escapeHtml(record.fileName)}">
            <input type="checkbox" data-history-select="${escapeHtml(record.id)}" ${isSelected ? 'checked' : ''}>
            <span class="custom-checkbox"></span>
          </label>
          
          <div class="history-thumbnail-box" data-history-action="preview" data-history-id="${escapeHtml(record.id)}" title="Click to preview">
            ${isImage && (record.previewUrl || record.directUrl) ? `
              <img class="history-thumb-img" src="${escapeHtml(record.previewUrl || record.directUrl)}" alt="${escapeHtml(record.fileName)}" loading="lazy" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex'">
              <div class="history-thumb-fallback" style="display:none;"><i class="${fileIcon}"></i></div>
            ` : `
              <div class="history-thumb-fallback"><i class="${fileIcon}"></i></div>
            `}
          </div>
        </div>

        <div class="history-card-body">
          <div class="history-card-title-row">
            <strong class="history-file-name" title="${escapeHtml(record.fileName)}" data-history-action="preview" data-history-id="${escapeHtml(record.id)}">${escapeHtml(record.fileName)}</strong>
          </div>

          <div class="history-badges-row">
            <span class="history-pill service-pill"><i class="fa-solid fa-cloud"></i> ${escapeHtml(serviceNames.join(', '))}</span>
            ${sizeDisplay ? `<span class="history-pill size-pill"><i class="fa-solid fa-hard-drive"></i> ${escapeHtml(sizeDisplay)}</span>` : ''}
            <span class="history-pill date-pill"><i class="fa-regular fa-clock"></i> ${escapeHtml(formattedDate)}</span>
          </div>

          <div class="history-link-box" title="Click to copy direct URL" data-copy-link="${escapeHtml(record.directUrl)}">
            <i class="fa-solid fa-link link-icon"></i>
            <span class="history-link-text">${escapeHtml(record.directUrl)}</span>
          </div>
        </div>

        <div class="history-card-actions">
          <button class="ghost-button icon-button" data-history-action="copy" data-history-id="${escapeHtml(record.id)}" title="Copy link" aria-label="Copy link">
            <i class="fa-regular fa-copy"></i>
          </button>
          <button class="ghost-button icon-button" data-history-action="preview" data-history-id="${escapeHtml(record.id)}" title="Preview media" aria-label="Preview media">
            <i class="fa-regular fa-eye"></i>
          </button>
          <button class="ghost-button icon-button" data-history-action="browser" data-history-id="${escapeHtml(record.id)}" title="Open in browser" aria-label="Open in browser">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </button>
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

  // Create detailed file items
  const taskId = `task-${Date.now()}`;
  const fileItems = state.selectedFiles.map((filePath, index) => {
    const fileName = filePath.split(/[/\\]/).pop();
    return {
      id: `${taskId}-file-${index}`,
      filePath,
      fileName,
      status: 'pending',
      fileSize: 0,
      formattedSize: '',
      progress: 0,
      uploadedInMs: null,
      directUrl: '',
      previewUrl: '',
      error: null,
    };
  });

  const task = {
    id: taskId,
    serviceId: state.selectedService,
    filePaths: [...state.selectedFiles],
    files: fileItems,
    status: 'in-progress',
    progress: 0,
    completedCount: 0,
    failedCount: 0,
    totalFiles: fileItems.length,
    currentFile: null,
    createdAt: new Date().toISOString(),
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
    task.status = task.failedCount > 0 && task.completedCount === 0 ? 'failed' : 'completed';
    task.progress = 100;
    task.currentFile = null;
    renderTasksList();
    loadHistory();  // Refresh history to show new uploads
    showToast(task.status === 'completed' ? 'Task completed!' : 'Task completed with errors.');
  } catch (error) {
    if (task.status !== 'cancelled') {
      task.status = 'failed';
    }
    task.currentFile = null;
    renderTasksList();
  }
});

document.getElementById('upload-clear').addEventListener('click', () => {
  state.selectedFiles = [];
  renderSelectedFiles();
});

window.addEventListener('dragover', (event) => event.preventDefault(), false);
window.addEventListener('drop', (event) => event.preventDefault(), false);

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
      // Use webUtils exposed via preload API to resolve absolute filesystem path
      if (api && typeof api.getFilePath === 'function') {
        try {
          const fullPath = api.getFilePath(file);
          if (fullPath) return fullPath;
        } catch (e) {
          console.error('Error getting file path via webUtils:', e);
        }
      }
      // Fallback for direct file object path property
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
  const cancelBtn = event.target.closest('[data-task-action="cancel"]');
  if (cancelBtn) {
    event.preventDefault();
    await api.cancelUpload();
    showToast('Cancelling upload...');
    return;
  }

  const openBtn = event.target.closest('[data-open-link]');
  if (openBtn) {
    event.preventDefault();
    const url = openBtn.dataset.openLink;
    if (url) {
      api.openExternalUrl(url);
    }
    return;
  }

  const copyButton = event.target.closest('[data-copy-link]');
  if (copyButton) {
    event.preventDefault();
    const text = copyButton.dataset.copyLink;
    if (text) {
      await navigator.clipboard.writeText(text);
      showToast('Link copied to clipboard!');
    }
    return;
  }
});

api.onUploadProgress((payload) => {
  if (state.uploadQueue.length === 0) return;
  const currentTask = state.uploadQueue[state.uploadQueue.length - 1];
  if (!currentTask) return;

  if (payload?.stage === 'starting') {
    const targetFile = currentTask.files?.find((f) => f.filePath === payload.filePath) 
      || currentTask.files?.[(payload.fileIndex || 1) - 1];
    
    if (targetFile) {
      targetFile.status = 'uploading';
      if (payload.fileSize) targetFile.fileSize = payload.fileSize;
      if (payload.formattedSize) targetFile.formattedSize = payload.formattedSize;
    }

    currentTask.currentFile = {
      fileName: payload.fileName,
      fileSize: payload.formattedSize,
      index: payload.fileIndex || 1,
      total: payload.totalFiles || currentTask.files?.length || 1,
    };
    if (typeof payload?.progress === 'number') {
      currentTask.progress = payload.progress;
    }
    renderTasksList();
  } else if (payload?.stage === 'completed') {
    const targetFile = currentTask.files?.find((f) => f.filePath === payload.filePath)
      || currentTask.files?.[(payload.fileIndex || 1) - 1];
    
    if (targetFile) {
      targetFile.status = 'completed';
      if (payload.result) {
        targetFile.directUrl = payload.result.directUrl;
        targetFile.previewUrl = payload.result.previewUrl;
        targetFile.uploadedInMs = payload.result.uploadedInMs;
        if (payload.result.fileSize) targetFile.fileSize = payload.result.fileSize;
        if (payload.result.formattedSize) targetFile.formattedSize = payload.result.formattedSize;
      }
    }

    currentTask.completedCount = (currentTask.completedCount || 0) + 1;
    if (typeof payload?.progress === 'number') {
      currentTask.progress = payload.progress;
    }
    if (payload.result) {
      currentTask.results.push(payload.result);
      // Auto-reload history so completed items immediately show up even mid-upload
      loadHistory();
    }
    renderTasksList();
  } else if (payload?.stage === 'failed') {
    const targetFile = currentTask.files?.find((f) => f.filePath === payload.filePath)
      || currentTask.files?.[(payload.fileIndex || 1) - 1];
    
    if (targetFile) {
      targetFile.status = 'failed';
      targetFile.error = payload.error || payload.result?.error || 'Upload failed';
    }

    currentTask.failedCount = (currentTask.failedCount || 0) + 1;
    if (typeof payload?.progress === 'number') {
      currentTask.progress = payload.progress;
    }
    if (payload.result) {
      currentTask.results.push(payload.result);
    }
    renderTasksList();
  } else if (payload?.stage === 'finished') {
    currentTask.status = currentTask.failedCount > 0 && currentTask.completedCount === 0 ? 'failed' : 'completed';
    currentTask.progress = 100;
    currentTask.currentFile = null;
    renderTasksList();
    loadHistory();
  } else if (payload?.stage === 'cancelled') {
    currentTask.status = 'cancelled';
    currentTask.currentFile = null;
    if (currentTask.files) {
      for (const f of currentTask.files) {
        if (f.status === 'pending' || f.status === 'uploading') {
          f.status = 'cancelled';
        }
      }
    }
    renderTasksList();
    loadHistory();
    showToast('Upload was cancelled.');
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
  openHistoryModal(record);
}

function openHistoryModal(record) {
  if (!record) {
    return;
  }

  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalDirectUrl = document.getElementById('modal-direct-url');
  const copyBtn = document.getElementById('modal-copy-link');
  const browserBtn = document.getElementById('modal-open-browser');

  if (modalTitle) modalTitle.textContent = record.fileName;
  if (modalSubtitle) modalSubtitle.textContent = `${record.serviceLabel || record.uploadedBy || 'Cloud'} · ${record.formattedSize || ''}`;
  if (modalDirectUrl) modalDirectUrl.value = record.directUrl || '';

  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(record.directUrl);
      showToast('Link copied to clipboard!');
    };
  }

  if (browserBtn) {
    browserBtn.onclick = () => {
      api.openExternalUrl(record.directUrl);
    };
  }

  const isImage = /^image\//.test(record.mimeType ?? '') || /\.(png|jpg|jpeg|gif|webp|bmp|svg)$/i.test(record.fileName ?? '');
  const isVideo = /^video\//.test(record.mimeType ?? '') || /\.(mp4|mov|webm)$/i.test(record.fileName ?? '');
  const isAudio = /^audio\//.test(record.mimeType ?? '') || /\.(mp3|wav|ogg)$/i.test(record.fileName ?? '');

  if (isImage) {
    modalPreviewMedia.innerHTML = `<img class="modal-media-element" src="${escapeHtml(record.previewUrl ?? record.directUrl)}" alt="${escapeHtml(record.fileName)}">`;
  } else if (isVideo) {
    modalPreviewMedia.innerHTML = `<video class="modal-media-element" controls autoplay src="${escapeHtml(record.previewUrl ?? record.directUrl)}"></video>`;
  } else if (isAudio) {
    modalPreviewMedia.innerHTML = `<div class="audio-modal-container"><i class="fa-solid fa-music fa-3x"></i><audio controls autoplay src="${escapeHtml(record.previewUrl ?? record.directUrl)}"></audio></div>`;
  } else {
    modalPreviewMedia.innerHTML = `
      <div class="preview-placeholder">
        <i class="fa-regular fa-file fa-3x"></i>
        <strong>${escapeHtml(record.fileName)}</strong>
        <span>Preview is not supported for this file type. Use "Open in Browser" to view.</span>
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
    showToast('Link copied to clipboard!');
    return;
  }

  if (action === 'preview') {
    openHistoryModal(record);
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

document.getElementById('history-delete').addEventListener('click', async () => {
  if (state.selectedHistoryIds.length === 0) {
    alert('Select at least one item to delete.');
    return;
  }

  const confirmDelete = confirm(`Are you sure you want to delete ${state.selectedHistoryIds.length} record(s)? This action cannot be undone.`);
  if (!confirmDelete) {
    return;
  }

  try {
    const updatedHistory = await api.deleteHistoryRecords(state.selectedHistoryIds);
    state.historyRecords = updatedHistory.records ?? [];
    state.selectedHistoryIds = [];
    renderHistory();
    showToast('Records deleted successfully!');
  } catch (error) {
    console.error('Failed to delete history records:', error);
    alert(`Failed to delete records: ${error.message}`);
  }
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

