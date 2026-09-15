/* Punto de entrada. Orquesta la inicialización de cada módulo. */

import { initBootSequence } from './ui/boot.js';
import { initBackground } from './ui/background.js';
import { initTheme } from './ui/theme.js';
import { initNavigation } from './ui/navigation.js';
import { initServicesAccordion } from './ui/services.js';
import { initModals } from './ui/modals.js';
import { initClock } from './ui/clock.js';
import { initPlayer } from './ui/player.js';
import { initGlobe } from './ui/globe.js';
import { initSocials } from './socials.js';
import { initVault } from './vault.js';

function initCopyrightYear() {
    const yearSpan = document.getElementById('copy-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

function boot() {
    initBootSequence();
    initBackground();
    initTheme();
    initNavigation();
    initServicesAccordion();
    initModals();
    initClock();
    initPlayer();
    initGlobe();
    initSocials();
    initVault();
    initCopyrightYear();
}

/* Los módulos se ejecutan después de parsear el documento, así que
   el DOM ya está disponible en ambos casos. */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
