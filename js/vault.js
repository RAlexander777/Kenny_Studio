/* La Bóveda.
   Recursos descargables cargados desde una planilla. Como el contenido lo
   edita una persona, el render publica solo lo que pasa validación:

   - enlaces http/https, con dominio permitido,
   - sin extensiones ejecutables en el nombre ni en el enlace,
   - y todos los textos como texto plano, nunca como HTML.

   Lo que no pasa validación se descarta para el visitante y se reporta por
   consola, para que quien administra la planilla se entere de qué quedó afuera. */

import { fetchSheet } from './sheetdb.js';

/* Dominios habilitados para publicar un recurso. Agregá los que necesites
   con el dominio exacto; los subdominios quedan incluidos automáticamente. */
const ALLOWED_HOSTS = [
    'kennystudioks.com',
    'github.com',
    'raw.githubusercontent.com',
    'gist.github.com',
];

/* Extensiones que la Bóveda nunca publica: ejecutables, instaladores,
   scripts que corren con doble clic y contenedores de disco. */
const BLOCKED_EXTENSIONS = [
    'exe', 'msi', 'msp', 'com', 'scr', 'pif', 'cpl', 'hta', 'reg',
    'bat', 'cmd', 'ps1', 'ps1xml', 'psm1', 'psd1',
    'vbs', 'vbe', 'js', 'jse', 'wsf', 'wsh',
    'jar', 'apk', 'dll', 'lnk', 'iso', 'img', 'vhd', 'vhdx',
];

const ITEMS_DESKTOP = 8;
const ITEMS_MOBILE = 5;

function hostIsAllowed(hostname) {
    const host = hostname.toLowerCase().replace(/^www\./, '');
    return ALLOWED_HOSTS.some(
        (allowed) => host === allowed || host.endsWith(`.${allowed}`),
    );
}

function extensionOf(value) {
    const clean = String(value ?? '').split(/[?#]/)[0].toLowerCase();
    const match = clean.match(/\.([a-z0-9]+)$/);
    return match ? match[1] : null;
}

function hasBlockedExtension(value) {
    return BLOCKED_EXTENSIONS.includes(extensionOf(value));
}

/* Devuelve el recurso listo para publicar, o el motivo del descarte. */
function validateItem(item) {
    if (!item || typeof item !== 'object') {
        return { reason: 'fila inválida' };
    }

    const nombre = String(item.nombre ?? '').trim();
    if (!nombre) return { reason: 'sin nombre' };
    if (hasBlockedExtension(nombre)) {
        return { reason: `extensión bloqueada en el nombre (${nombre})` };
    }

    const rawLink = String(item.link ?? '').trim();
    if (!rawLink) return { reason: `sin enlace (${nombre})` };

    const candidate = rawLink.includes('://') ? rawLink : `https://${rawLink}`;

    let url;
    try {
        url = new URL(candidate);
    } catch {
        return { reason: `enlace inválido (${nombre})` };
    }

    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
        return { reason: `protocolo no permitido (${nombre})` };
    }

    if (!hostIsAllowed(url.hostname)) {
        return { reason: `dominio no permitido (${url.hostname})` };
    }

    if (hasBlockedExtension(url.pathname)) {
        return { reason: `extensión ejecutable en el enlace (${nombre})` };
    }

    return {
        item: {
            nombre,
            tipo: String(item.tipo ?? '').trim(),
            size: String(item.size ?? '').trim(),
            url: url.href,
        },
    };
}

/* Permisos decorativos, según el tipo declarado en la planilla. */
function generatePerms(tipo) {
    const t = (tipo || '').toUpperCase();
    if (t.includes('PYTHON') || t.includes('SH') || t.includes('EXE') || t.includes('SCRIPT')) {
        return '-rwxr-xr-x';
    }
    if (t.includes('DIR') || t.includes('FOLDER')) return 'drwxr-xr-x';
    if (t.includes('CONF') || t.includes('ENV')) return '-r--------';
    return '-rw-r--r--';
}

export async function initVault() {
    const vaultContainer = document.getElementById('vault-list');
    const paginationContainer = document.getElementById('vault-pagination');

    if (!vaultContainer) return;

    const itemsPerPage = window.innerWidth <= 768 ? ITEMS_MOBILE : ITEMS_DESKTOP;

    let vaultData = [];
    let currentPage = 1;

    function showMessage(text, variant = 'ls-empty') {
        vaultContainer.textContent = '';
        const box = document.createElement('div');
        box.className = variant;
        box.textContent = text;
        vaultContainer.appendChild(box);
    }

    function renderPagination() {
        if (!paginationContainer) return;
        paginationContainer.textContent = '';

        const totalPages = Math.ceil(vaultData.length / itemsPerPage);
        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.classList.add('ls-page-btn');
            if (i === currentPage) btn.classList.add('active');

            btn.textContent = i;

            btn.addEventListener('click', () => {
                currentPage = i;
                renderTable();

                const glitch = document.getElementById('global-glitch');
                if (glitch) {
                    glitch.classList.add('active');
                    setTimeout(() => glitch.classList.remove('active'), 300);
                }

                document.getElementById('vault')?.scrollIntoView({ behavior: 'smooth' });
            });

            paginationContainer.appendChild(btn);
        }
    }

    function renderTable() {
        vaultContainer.textContent = '';

        const start = (currentPage - 1) * itemsPerPage;
        vaultData.slice(start, start + itemsPerPage).forEach((item) => {
            const row = document.createElement('div');
            row.classList.add('ls-row');

            const meta = document.createElement('div');
            meta.classList.add('ls-meta-wrap');

            const perms = document.createElement('span');
            perms.classList.add('ls-perms');
            perms.textContent = generatePerms(item.tipo);

            const type = document.createElement('span');
            type.classList.add('ls-type');
            type.textContent = item.tipo;

            const size = document.createElement('span');
            size.classList.add('ls-size');
            size.textContent = item.size;

            meta.append(perms, type, size);

            const name = document.createElement('div');
            name.classList.add('ls-name');
            name.textContent = item.nombre;
            name.addEventListener('click', () => name.classList.toggle('expanded'));

            const download = document.createElement('a');
            download.className = 'ls-download';
            download.href = item.url;
            download.target = '_blank';
            download.rel = 'noopener noreferrer';
            download.title = 'Descargar';
            download.setAttribute('aria-label', `Descargar ${item.nombre}`);

            const icon = document.createElement('i');
            icon.className = 'fas fa-download';
            icon.setAttribute('aria-hidden', 'true');
            download.appendChild(icon);

            row.append(meta, name, download);
            vaultContainer.appendChild(row);
        });

        renderPagination();
    }

    try {
        const rows = await fetchSheet();

        const accepted = [];
        const rejected = [];

        rows.forEach((row) => {
            const { item, reason } = validateItem(row);
            if (item) accepted.push(item);
            else rejected.push(reason);
        });

        if (rejected.length) {
            console.warn(
                `[vault] ${rejected.length} recurso(s) descartado(s) por validación:\n- ` +
                    rejected.join('\n- '),
            );
        }

        vaultData = accepted;
        currentPage = 1;

        if (vaultData.length) renderTable();
        else showMessage('> DIRECTORIO VACÍO');
    } catch (error) {
        console.warn('[vault] No se pudo leer SheetDB:', error.message);
        showMessage('> ERROR: FALLO EN LA CONEXIÓN CON EL SATÉLITE', 'ls-error');
    }
}
