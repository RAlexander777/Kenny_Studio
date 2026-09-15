/* Globo terráqueo 3D en canvas: red de nodos con conexiones. */

export function initGlobe() {
    const globeCanvas = document.getElementById('cyber-globe');
    if (!globeCanvas) return;

    const ctx = globeCanvas.getContext('2d');
    const globeWidth = globeCanvas.width;
    const globeHeight = globeCanvas.height;
    const centerX = globeWidth / 2;
    const centerY = globeHeight / 2;
    const radius = 105;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const nodes = [];
    const connections = [];
    const numNodes = 120;

    /* Distribución uniforme de puntos con esfera de Fibonacci */
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < numNodes; i++) {
        const y = 1 - (i / (numNodes - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const theta = phi * i;

        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;

        nodes.push({ x, y, z, originalX: x, originalZ: z });
    }

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dz = nodes[i].z - nodes[j].z;

            if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 0.45) {
                connections.push({ a: nodes[i], b: nodes[j] });
            }
        }
    }

    let rotationY = 0;

    function drawGlobe() {
        ctx.clearRect(0, 0, globeWidth, globeHeight);

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const lineColor = isDark ? 'rgba(0, 255, 204, 0.25)' : 'rgba(0, 85, 255, 0.25)';
        const threatColor = isDark ? '#ff007f' : '#d9005c';

        rotationY += 0.003;

        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);

        /* Proyección 3D -> 2D. Z negativo es el frente. */
        const projected = nodes.map((node, index) => {
            const rx = node.originalX * cosY - node.originalZ * sinY;
            const rz = node.originalX * sinY + node.originalZ * cosY;
            node.x = rx;
            node.z = rz;

            const scale = 250 / (250 + node.z * radius);

            return {
                px: centerX + node.x * radius * scale,
                py: centerY + node.y * radius * scale,
                scale,
                alpha: Math.max(0.05, 1 - (node.z + 1) / 2),
                z: node.z,
                isThreat: index % 15 === 0,
            };
        });

        ctx.lineWidth = 1;
        connections.forEach((conn) => {
            const a = projected[nodes.indexOf(conn.a)];
            const b = projected[nodes.indexOf(conn.b)];

            if (a.z < 0.2 && b.z < 0.2) {
                ctx.beginPath();
                ctx.moveTo(a.px, a.py);
                ctx.lineTo(b.px, b.py);
                ctx.strokeStyle = lineColor;
                ctx.stroke();
            }
        });

        projected.forEach((node) => {
            if (node.z >= 0.2) return;

            ctx.beginPath();
            ctx.arc(node.px, node.py, 1.5 * node.scale, 0, Math.PI * 2);

            if (node.isThreat) {
                ctx.fillStyle = threatColor;
                ctx.shadowColor = threatColor;
                ctx.shadowBlur = 10 * node.scale;

                if (Math.random() > 0.96) {
                    ctx.arc(node.px, node.py, 3.5 * node.scale, 0, Math.PI * 2);
                }
            } else {
                ctx.fillStyle = `rgba(${isDark ? '0,255,204' : '0,85,255'}, ${node.alpha})`;
                ctx.shadowBlur = 0;
            }

            ctx.fill();
        });
    }

    function animate() {
        drawGlobe();
        requestAnimationFrame(animate);
    }

    if (reduceMotion) {
        drawGlobe();
    } else {
        animate();
    }
}
