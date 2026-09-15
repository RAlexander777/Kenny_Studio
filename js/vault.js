/* La Bóveda.
   Código trasladado tal cual desde script.js: la lógica de render,
   paginación y permisos quedó idéntica. Pendiente de decisión sobre
   el contenido de la planilla y sobre el escapado de los campos. */

export async function initVault() {
    const vaultContainer = document.getElementById("vault-list");
    const paginationContainer = document.getElementById("vault-pagination");

    const API_URL = "https://sheetdb.io/api/v1/ue9trerg3z72z";

    let vaultData = [];
    let currentPage = 1;

    // DETERMINAR ÍTEMS POR PÁGINA SEGÚN DISPOSITIVO
    const itemsPerPage = window.innerWidth <= 768 ? 5 : 8;

    function generatePerms(tipo) {
        const t = (tipo || "").toUpperCase();
        if (
            t.includes("PYTHON") ||
            t.includes("SH") ||
            t.includes("EXE") ||
            t.includes("SCRIPT")
        ) {
            return "-rwxr-xr-x";
        } else if (t.includes("DIR") || t.includes("FOLDER")) {
            return "drwxr-xr-x";
        } else if (t.includes("CONF") || t.includes("ENV")) {
            return "-r--------";
        } else {
            return "-rw-r--r--";
        }
    }

    function renderTable() {
        vaultContainer.innerHTML = "";

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = vaultData.slice(start, end);

        paginatedItems.forEach((item) => {
            if (!item.nombre || item.nombre.trim() === "") return;

            const row = document.createElement("div");
            row.classList.add("ls-row");

            const autoPerms = generatePerms(item.tipo);
            let safeLink = (item.link || "").trim();
            if (safeLink !== "" && !safeLink.startsWith("http"))
                safeLink = "https://" + safeLink;

            row.innerHTML = `
        <div class="ls-meta-wrap">
            <span class="ls-perms">${autoPerms}</span>
            <span class="ls-type">${item.tipo}</span>
            <span class="ls-size">${item.size}</span>
        </div>
        <div class="ls-name">${item.nombre}</div>
        <a href="${safeLink}" target="_blank" class="ls-download" title="Descargar">
            <i class="fas fa-download"></i>
        </a>
    `;

            const nameElement = row.querySelector(".ls-name");
            nameElement.addEventListener("click", () => {
                nameElement.classList.toggle("expanded");
            });

            vaultContainer.appendChild(row);
        });

        renderPagination();
    }

    function renderPagination() {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = "";

        const totalPages = Math.ceil(vaultData.length / itemsPerPage);
        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.classList.add("ls-page-btn");
            if (i === currentPage) btn.classList.add("active");

            btn.textContent = i;

            btn.addEventListener("click", () => {
                currentPage = i;
                renderTable();
                const glitch = document.getElementById("global-glitch");
                if (glitch) {
                    glitch.classList.add("active");
                    setTimeout(() => glitch.classList.remove("active"), 300);
                }
                // Scroll suave hacia arriba de la bóveda al cambiar de página
                document
                    .getElementById("vault")
                    .scrollIntoView({ behavior: "smooth" });
            });

            paginationContainer.appendChild(btn);
        }
    }

    try {
        const response = await fetch(API_URL);
        vaultData = await response.json();
        if (vaultData.length > 0) {
            renderTable();
        } else {
            vaultContainer.innerHTML =
                '<div class="ls-error">> DIRECTORIO VACÍO</div>';
        }
    } catch (error) {
        vaultContainer.innerHTML =
            '<div class="ls-error" style="color: var(--neon-pink);">> ERROR: FALLO EN LA CONEXIÓN CON EL SATÉLITE</div>';
    }
}
