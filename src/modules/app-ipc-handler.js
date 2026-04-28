import { dialog, shell, BrowserWindow, app } from "electron";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function registerIpcHandlers(ipcMain, context) {

}