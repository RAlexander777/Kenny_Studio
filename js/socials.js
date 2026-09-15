/* Redes sociales del footer, editables desde la pestaña "Redes" de SheetDB.
   Los contactos escritos en el HTML son el fallback: solo se reemplazan si
   la planilla responde con al menos una fila válida. */

import { SOCIALS_SHEET, SOCIALS_CACHE_KEY, SOCIALS_CACHE_TTL } from './config.js';
import { fetchSheet } from './sheetdb.js';

/* Whitelist: la planilla solo puede elegir entre estos íconos.
   Nunca se inyecta una clase de Font Awesome tal cual viene del Sheet. */
const ICONS = {
    whatsapp: 'fab fa-whatsapp',
    telegram: 'fab fa-telegram',
    facebook: 'fab fa-facebook',
    instagram: 'fab fa-instagram',
    linkedin: 'fab fa-linkedin',
    tiktok: 'fab fa-tiktok',
    youtube: 'fab fa-youtube',
    github: 'fab fa-github',
    x: 'fab fa-x-twitter',
    twitter: 'fab fa-x-twitter',
    email: 'fas fa-envelope',
    correo: 'fas fa-envelope',
    web: 'fas fa-globe',
    sitio: 'fas fa-globe',
};

const DEFAULT_ICON = 'fas fa-link';
const MAX_LINKS = 8;

function normalizeKey(value) {
    return String(value ?? '').trim().toLowerCase();
}

/* Solo http/https. Si la planilla omite el protocolo, se asume https. */
function toSafeUrl(value) {
    const raw = String(value ?? '').trim();
    if (!raw) return null;

    const candidate = raw.includes('://') ? raw : `https://${raw}`;

    try {
        const url = new URL(candidate);
        return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
    } catch {
        return null;
    }
}

function isDisabled(value) {
    return /^(no|false|0|n|off)$/i.test(String(value ?? '').trim());
}

function normalizeRows(rows) {
    return rows
        .filter((row) => !isDisabled(row.activo))
        .map((row, index) => {
            const url = toSafeUrl(row.url);
            if (!url) return null;

            const iconKey = normalizeKey(row.icono) || normalizeKey(row.red);

            return {
                url,
                icon: ICONS[iconKey] || DEFAULT_ICON,
                label: String(row.usuario ?? row.red ?? '').trim() || row.red || 'Enlace',
                order: Number.parseInt(row.orden, 10) || index + 1,
            };
        })
        .filter(Boolean)
        .sort((a, b) => a.order - b.order)
        .slice(0, MAX_LINKS);
}

function render(list, items) {
    list.textContent = '';

    items.forEach((item) => {
        const li = document.createElement('li');

        const icon = document.createElement('i');
        icon.className = item.icon;
        icon.setAttribute('aria-hidden', 'true');

        const link = document.createElement('a');
        link.href = item.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = item.label;

        li.append(icon, link);
        list.appendChild(li);
    });
}

function readCache() {
    try {
        const raw = localStorage.getItem(SOCIALS_CACHE_KEY);
        if (!raw) return null;

        const { timestamp, items } = JSON.parse(raw);
        if (!Array.isArray(items) || !items.length) return null;
        if (Date.now() - timestamp > SOCIALS_CACHE_TTL) return null;

        return items;
    } catch {
        return null;
    }
}

function writeCache(items) {
    try {
        localStorage.setItem(
            SOCIALS_CACHE_KEY,
            JSON.stringify({ timestamp: Date.now(), items }),
        );
    } catch {
        /* Modo privado o cuota llena: no es crítico, se sigue mostrando el HTML. */
    }
}

export async function initSocials() {
    const list = document.querySelector('[data-socials]');
    if (!list) return;

    const cached = readCache();
    if (cached) {
        render(list, cached);
        return;
    }

    try {
        const items = normalizeRows(await fetchSheet(SOCIALS_SHEET));
        if (!items.length) return;

        render(list, items);
        writeCache(items);
    } catch (error) {
        /* Si SheetDB falla o está limitado, quedan los contactos del HTML. */
        console.warn('[socials] No se pudo leer SheetDB:', error.message);
    }
}
