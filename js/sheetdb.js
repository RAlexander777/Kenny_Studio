/* Acceso a SheetDB con timeout, para que una API lenta no deje
   la interfaz esperando indefinidamente. */

import { SHEETDB_BASE } from './config.js';

const TIMEOUT_MS = 6000;

export async function fetchSheet(sheet, { timeout = TIMEOUT_MS } = {}) {
    const url = new URL(SHEETDB_BASE);
    if (sheet) url.searchParams.set('sheet', sheet);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
            throw new Error(`SheetDB respondió ${response.status}`);
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } finally {
        clearTimeout(timer);
    }
}
