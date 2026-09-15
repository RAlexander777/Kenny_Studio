/* Configuración compartida del sitio. */

export const SHEETDB_API_ID = 'ue9trerg3z72z';
export const SHEETDB_BASE = `https://sheetdb.io/api/v1/${SHEETDB_API_ID}`;

/* Pestaña de la planilla con las redes sociales del footer. */
export const SOCIALS_SHEET = 'Redes';

/* Caché local: evita gastar una request por visita (el plan free son 500 al mes). */
export const SOCIALS_CACHE_KEY = 'ks:socials:v1';
export const SOCIALS_CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

/* Tema claro/oscuro. */
export const THEME_KEY = 'ks:theme';

/* Rutas de los videos del hero por tema. */
export const HERO_VIDEO = {
    dark: 'assets/video/hero_video.mp4',
    light: 'assets/video/hero_video_light.mp4',
};
