import { dialog, shell, BrowserWindow, app } from "electron";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import log from './app-color-log.js';
import {
	appendHistory,
	getDefaultSettings,
	loadHistory,
	loadSettings,
	saveSettings,
} from './app-settings.js';
import {
	getSupportedServices,
	uploadFiles,
	validateServiceCredentials,
} from './app-upload-manager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let historyWindow = null;
let activeUploadController = null;

function getHistoryWindow(preloadPath) {
	if (historyWindow && !historyWindow.isDestroyed()) {
		return historyWindow;
	}

	historyWindow = new BrowserWindow({
		width: 1180,
		height: 780,
		minWidth: 1000,
		minHeight: 680,
		title: 'Lichen Link Library',
		webPreferences: {
			preload: preloadPath,
			contextIsolation: true,
			nodeIntegration: false,
		},
	});

	historyWindow.loadFile(path.join(__dirname, '..', 'views', 'html', 'history.html'));
	historyWindow.on('closed', () => {
		historyWindow = null;
	});

	return historyWindow;
}

export function registerIpcHandlers(ipcMain, context) {
	const getMainWindow = context?.getMainWindow ?? (() => context?.mainWindow ?? null);
	const preloadPath = path.join(__dirname, '..', 'preload', 'preload.js');

	ipcMain.handle('app:load-bootstrap-data', async () => {
		const [settings, history] = await Promise.all([
			loadSettings(),
			loadHistory(),
		]);

		return {
			settings,
			history,
			services: getSupportedServices(),
			defaults: getDefaultSettings(),
		};
	});

	ipcMain.handle('app:save-settings', async (_event, settings) => {
		const savedSettings = await saveSettings(settings);
		log.settings('Settings saved.');
		return savedSettings;
	});

	ipcMain.handle('app:validate-service-credentials', async (_event, serviceId) => {
		const settings = await loadSettings();
		return validateServiceCredentials(serviceId, settings);
	});

	ipcMain.handle('app:get-history', async () => {
		return loadHistory();
	});

	ipcMain.handle('app:open-history-window', async () => {
		const window = getHistoryWindow(preloadPath);
		window.show();
		window.focus();
		return true;
	});

	ipcMain.handle('app:upload-files', async (_event, payload) => {
		const settings = await loadSettings();
		const files = Array.isArray(payload?.filePaths) ? payload.filePaths : [];
		const serviceIds = Array.isArray(payload?.serviceIds) ? payload.serviceIds : [];

		if (files.length === 0) {
			throw new Error('Please choose at least one file.');
		}

		if (serviceIds.length === 0) {
			throw new Error('Please choose at least one upload service.');
		}

		activeUploadController = new AbortController();
		const { signal } = activeUploadController;
		const progressWindow = getMainWindow();

		const results = await uploadFiles({
			filePaths: files,
			serviceIds,
			settings,
			signal,
			onProgress: async (payload) => {
				progressWindow?.webContents.send('app:upload-progress', payload);
			},
		});

		for (const result of results.filter((item) => item.status === 'success')) {
			await appendHistory(result);
		}

		progressWindow?.webContents.send('app:upload-progress', {
			stage: 'finished',
			progress: 100,
			totalTasks: results.length,
			completedTasks: results.length,
			results,
		});

		activeUploadController = null;

		return results;
	});

	ipcMain.handle('app:cancel-upload', async () => {
		if (activeUploadController) {
			activeUploadController.abort();
			activeUploadController = null;
		}

		return true;
	});

	ipcMain.handle('app:open-file-dialog', async () => {
		const mainWindow = getMainWindow();
		const result = await dialog.showOpenDialog(mainWindow, {
			title: 'Select files to upload',
			properties: ['openFile', 'multiSelections'],
		});

		return result.filePaths || [];
	});

	ipcMain.handle('app:open-external-url', async (_event, url) => {
		if (typeof url !== 'string' || !url.trim()) {
			return false;
		}

		await shell.openExternal(url);
		return true;
	});

}