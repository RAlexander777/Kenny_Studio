/* Alternancia de tema claro/oscuro, con persistencia y video sincronizado. */

import { THEME_KEY, HERO_VIDEO } from '../config.js';

function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    const icon = document.querySelector('#theme-toggle .switch-thumb i');
    if (icon) {
        icon.classList.toggle('fa-moon', theme === 'dark');
        icon.classList.toggle('fa-sun', theme === 'light');
    }

    const toggle = document.getElementById('theme-toggle');
    if (toggle) toggle.setAttribute('aria-pressed', String(theme === 'light'));

    const video = document.getElementById('hero-video-bg');
    if (video && video.getAttribute('src') !== HERO_VIDEO[theme]) {
        video.src = HERO_VIDEO[theme];
    }
}

export function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    /* El tema inicial lo fija el script inline del <head>; acá solo se
       sincronizan el ícono y el video con ese estado. */
    applyTheme(currentTheme());

    toggle.addEventListener('click', () => {
        const next = currentTheme() === 'dark' ? 'light' : 'dark';

        try {
            localStorage.setItem(THEME_KEY, next);
        } catch {
            /* Sin persistencia disponible: el tema igual cambia en esta sesión. */
        }

        applyTheme(next);
    });
}
