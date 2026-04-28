import { app } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_SETTINGS = {
  theme: 'system',
  services: {
    imgbb: {
      apiKey: '',
    },
    internetArchive: {
      accessKey: '',
      secretKey: '',
      identifier: 'lichen-upload',
      collection: 'opensource',
    },
  },
  activeServices: ['imgbb', 'internetArchive'],
};

const DEFAULT_HISTORY = {
  records: [],
};

function getAppDataDir() {
  return app.getPath('userData');
}

export function getSettingsPath() {
  return path.join(getAppDataDir(), 'key.json');
}

export function getHistoryPath() {
  return path.join(getAppDataDir(), 'uploads.json');
}

async function readJsonFile(filePath, fallbackValue) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return fallbackValue;
    }

    throw error;
  }
}

async function writeJsonFile(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function normalizeSettings(value = {}) {
  const theme = ['system', 'light', 'dark'].includes(value.theme) ? value.theme : DEFAULT_SETTINGS.theme;

  return {
    ...DEFAULT_SETTINGS,
    ...value,
    theme,
    services: {
      ...DEFAULT_SETTINGS.services,
      ...(value.services ?? {}),
      imgbb: {
        ...DEFAULT_SETTINGS.services.imgbb,
        ...(value.services?.imgbb ?? {}),
      },
      internetArchive: {
        ...DEFAULT_SETTINGS.services.internetArchive,
        ...(value.services?.internetArchive ?? {}),
      },
    },
    activeServices: Array.isArray(value.activeServices) && value.activeServices.length > 0
      ? value.activeServices
      : DEFAULT_SETTINGS.activeServices,
  };
}

function normalizeHistory(value = {}) {
  if (Array.isArray(value)) {
    return { records: value };
  }

  return {
    ...DEFAULT_HISTORY,
    ...value,
    records: Array.isArray(value.records) ? value.records : DEFAULT_HISTORY.records,
  };
}

export async function loadSettings() {
  const rawSettings = await readJsonFile(getSettingsPath(), DEFAULT_SETTINGS);
  return normalizeSettings(rawSettings);
}

export async function saveSettings(settings) {
  const normalizedSettings = normalizeSettings(settings);
  await writeJsonFile(getSettingsPath(), normalizedSettings);
  return normalizedSettings;
}

export async function loadHistory() {
  const rawHistory = await readJsonFile(getHistoryPath(), DEFAULT_HISTORY);
  return normalizeHistory(rawHistory);
}

export async function saveHistory(history) {
  const normalizedHistory = normalizeHistory(history);
  await writeJsonFile(getHistoryPath(), normalizedHistory);
  return normalizedHistory;
}

export async function appendHistory(record) {
  const history = await loadHistory();
  history.records.unshift(record);
  await saveHistory(history);
  return history;
}

export function getDefaultSettings() {
  return normalizeSettings();
}