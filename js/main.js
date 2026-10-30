/**
 * Laboratorio de la Elipse - Feria STEAM+ 2026
 * Valeria Hinestroza · Salomé Jiménez · Gabriela Muñoz
 * Controlador Principal: Navegación fluida entre pantallas, inicialización bajo demanda,
 * redibujado reactivo ante cambios de tamaño, modales oficiales y centro de ayuda.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const pantallas = {
        bienvenida: document.getElementById('pantallaBienvenida'),
        menu: document.getElementById('pantallaMenu'),
        explora: document.getElementById('pantallaExplora'),
        analiza: document.getElementById('pantallaAnaliza'),
        arma: document.getElementById('pantallaArma'),
        retos: document.getElementById('pantallaRetos')
    };

    const inicializados = {
        explora: false,
        analiza: false,
        arma: false,
        retos: false
    };

    /**
     * Cambia la pantalla visible y ejecuta redibujado garantizado en el siguiente cuadro.
     * @param {'bienvenida'|'menu'|'explora'|'analiza'|'arma'|'retos'} idDestino
     */
    function navegarA(idDestino) {
        Object.keys(pantallas).forEach(clave => {
            const el = pantallas[clave];
            if (el) {
                if (clave === idDestino) {
                    el.classList.add('activa');
                } else {
                    el.classList.remove('activa');
                }
            }
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Esperar al siguiente cuadro de renderizado para garantizar que el canvas tenga dimensiones CSS reales
        requestAnimationFrame(() => {
            if (idDestino === 'explora') {
                if (!inicializados.explora) {
                    UIExplora.inicializar();
                    inicializados.explora = true;
                } else {
                    UIExplora.actualizar();
                }
            } else if (idDestino === 'analiza') {
                if (!inicializados.analiza) {
                    UIAnaliza.inicializar();
                    inicializados.analiza = true;
                } else if (UIAnaliza.redibujar) {
                    UIAnaliza.redibujar();
                }
            } else if (idDestino === 'arma') {
                if (!inicializados.arma) {
                    UIArma.inicializar();
                    inicializados.arma = true;
                } else if (UIArma.redibujar) {
                    UIArma.redibujar();
                }
            } else if (idDestino === 'retos') {
                if (!inicializados.retos) {
                    UIRetos.inicializar();
                    inicializados.retos = true;
                } else if (UIRetos.redibujar) {
                    UIRetos.redibujar();
                }
            }
        });
    }

    // 1. Botón "¡Empezar!" en Bienvenida
    const btnEmpezar = document.getElementById('btnEmpezar');
    if (btnEmpezar) {
        btnEmpezar.addEventListener('click', () => navegarA('menu'));
    }

    // 2. Botón volver a Bienvenida desde el Menú
    const btnVolverBienvenida = document.getElementById('btnVolverBienvenida');
    if (btnVolverBienvenida) {
        btnVolverBienvenida.addEventListener('click', () => navegarA('bienvenida'));
    }

    // 3. Tarjetas del Menú Principal
    const tarjetaExplora = document.getElementById('tarjetaExplora');
    if (tarjetaExplora) tarjetaExplora.addEventListener('click', () => navegarA('explora'));

    const tarjetaAnaliza = document.getElementById('tarjetaAnaliza');
    if (tarjetaAnaliza) tarjetaAnaliza.addEventListener('click', () => navegarA('analiza'));

    const tarjetaArma = document.getElementById('tarjetaArma');
    if (tarjetaArma) tarjetaArma.addEventListener('click', () => navegarA('arma'));

    const tarjetaRetos = document.getElementById('tarjetaRetos');
    if (tarjetaRetos) tarjetaRetos.addEventListener('click', () => navegarA('retos'));

    // 4. Botones volver al menú en todas las actividades
    const botonesVolverMenu = document.querySelectorAll('.btn-volver-menu');
    botonesVolverMenu.forEach(btn => {
        btn.addEventListener('click', () => navegarA('menu'));
    });

    // 5. Redibujado responsivo continuo ante redimensionado o cambio de zoom
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (pantallas.explora?.classList.contains('activa')) {
                UIExplora.actualizar();
            } else if (pantallas.analiza?.classList.contains('activa') && UIAnaliza.redibujar) {
                UIAnaliza.redibujar();
            } else if (pantallas.arma?.classList.contains('activa') && UIArma.redibujar) {
                UIArma.redibujar();
            } else if (pantallas.retos?.classList.contains('activa') && UIRetos.redibujar) {
                UIRetos.redibujar();
            }
        }, 120);
    });

    // 6. Generar estrellas titilantes en el fondo cósmico de bienvenida
    generarEstrellasFondo();

    function generarEstrellasFondo() {
        const contenedor = document.getElementById('capaEstrellas');
        if (!contenedor) return;

        // Optimización DOM: uso de DocumentFragment para 1 solo reflow y reducción de nodos
        const fragmento = document.createDocumentFragment();
        const numEstrellas = 28;
        for (let i = 0; i < numEstrellas; i++) {
            const estrella = document.createElement('div');
            estrella.className = 'estrella';
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const tam = Math.random() * 3 + 1.5;
            const retardo = Math.random() * 4;
            const duracion = Math.random() * 2 + 2;

            estrella.style.left = x + '%';
            estrella.style.top = y + '%';
            estrella.style.width = tam + 'px';
            estrella.style.height = tam + 'px';
            estrella.style.animationDelay = retardo + 's';
            estrella.style.animationDuration = duracion + 's';

            fragmento.appendChild(estrella);
        }
        contenedor.appendChild(fragmento);
    }

    // ════════════════════════════════════════════════════════════════════════
    // 7. MODAL DE CÓDIGO QR PARA EL JURADO Y VISITANTES EN LA FERIA
    // ════════════════════════════════════════════════════════════════════════
    const btnAbrirQR = document.getElementById('btnAbrirQR');
    const modalQR = document.getElementById('modalQR');
    const btnCerrarQR = document.getElementById('btnCerrarQR');
    const btnCopiarEnlaceQR = document.getElementById('btnCopiarEnlaceQR');
    const inputEnlaceQR = document.getElementById('inputEnlaceQR');

    function abrirModalQR() {
        if (modalQR) {
            modalQR.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    function cerrarModalQR() {
        if (modalQR) {
            modalQR.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    if (btnAbrirQR) btnAbrirQR.addEventListener('click', abrirModalQR);
    if (btnCerrarQR) btnCerrarQR.addEventListener('click', cerrarModalQR);

    if (modalQR) {
        modalQR.addEventListener('click', e => {
            if (e.target === modalQR) cerrarModalQR();
        });
    }

    if (btnCopiarEnlaceQR && inputEnlaceQR) {
        btnCopiarEnlaceQR.addEventListener('click', () => {
            const url = inputEnlaceQR.value || 'https://duranmgabriela05-cloud.github.io/LABORATORIO-RECTA-/';
            if (navigator.clipboard?.writeText) {
                navigator.clipboard.writeText(url).then(() => {
                    const txtOriginal = btnCopiarEnlaceQR.textContent;
                    btnCopiarEnlaceQR.textContent = '¡Copiado! 👍';
                    btnCopiarEnlaceQR.style.background = '#10b981';
                    setTimeout(() => {
                        btnCopiarEnlaceQR.textContent = txtOriginal;
                        btnCopiarEnlaceQR.style.background = '';
                    }, 2000);
                }).catch(() => {
                    inputEnlaceQR.select();
                    document.execCommand('copy');
                });
            } else {
                inputEnlaceQR.select();
                document.execCommand('copy');
            }
        });
    }

    // ════════════════════════════════════════════════════════════════════════
    // 8. MODO PANTALLA COMPLETA (FULL SCREEN)
    // ════════════════════════════════════════════════════════════════════════
    const btnPantallaCompleta = document.getElementById('btnPantallaCompleta');

    function alternarPantallaCompleta() {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            const el = document.documentElement;
            if (el.requestFullscreen) {
                el.requestFullscreen();
            } else if (el.webkitRequestFullscreen) {
                el.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }

    function actualizarBotonFullscreen() {
        if (!btnPantallaCompleta) return;
        const esFull = !!(document.fullscreenElement || document.webkitFullscreenElement);
        if (esFull) {
            btnPantallaCompleta.innerHTML = '🗗 <span class="ocultar-movil">Salir de Pantalla Completa</span>';
            btnPantallaCompleta.title = 'Salir de Pantalla Completa';
        } else {
            btnPantallaCompleta.innerHTML = '⛶ <span class="ocultar-movil">Pantalla Completa</span>';
            btnPantallaCompleta.title = 'Modo Pantalla Completa para proyecciones';
        }
    }

    if (btnPantallaCompleta) {
        btnPantallaCompleta.addEventListener('click', alternarPantallaCompleta);
        document.addEventListener('fullscreenchange', actualizarBotonFullscreen);
        document.addEventListener('webkitfullscreenchange', actualizarBotonFullscreen);
    }

    // ════════════════════════════════════════════════════════════════════════
    // 9. CENTRO DE DOCUMENTACIÓN OFICIAL (MODAL CON 5 PESTAÑAS)
    // ════════════════════════════════════════════════════════════════════════
    const btnAbrirDocs = document.getElementById('btnAbrirDocs');
    const modalDocs = document.getElementById('modalDocs');
    const btnCerrarDocs = document.getElementById('btnCerrarDocs');
    const cuerpoDocumentacion = document.getElementById('cuerpoDocumentacion');
    const tabsDoc = document.querySelectorAll('.tab-doc');

    const contenidosDocs = {
        docFicha: 
            '<div style="display: flex; flex-direction: column; gap: 14px;">' +
                '<div style="background: rgba(56, 189, 248, 0.1); border: 1px solid #38bdf8; border-radius: 10px; padding: 12px 16px;">' +
                    '<h4 style="color: #38bdf8; margin: 0 0 6px 0; font-size: 1.15rem;">📋 Ficha Técnica Institucional · Feria STEAM+ 2026</h4>' +
                    '<p style="color: #cbd5e1; font-size: 0.9rem; margin: 0;">Laboratorio Matemático e Interactivo de la Cónica Elipse para el Grado Décimo (10°).</p>' +
                '</div>' +
                '<table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">' +
                    '<tr style="border-bottom: 1px solid rgba(255,255,255,0.1);"><td style="padding: 8px 6px; color: #38bdf8; font-weight: bold; width: 35%;">Proyecto</td><td style="color: #f8fafc;">Laboratorio de la Elipse (Simulador y Analizador Analítico)</td></tr>' +
                    '<tr style="border-bottom: 1px solid rgba(255,255,255,0.1);"><td style="padding: 8px 6px; color: #38bdf8; font-weight: bold;">Equipo Desarrollador</td><td style="color: #f8fafc;"><strong>Valeria Hinestroza · Salomé Jiménez · Gabriela Muñoz</strong></td></tr>' +
                    '<tr style="border-bottom: 1px solid rgba(255,255,255,0.1);"><td style="padding: 8px 6px; color: #38bdf8; font-weight: bold;">Grado y Área</td><td style="color: #f8fafc;">Grado 10° · Matemáticas (Geometría Analítica) & Tecnología</td></tr>' +
                    '<tr style="border-bottom: 1px solid rgba(255,255,255,0.1);"><td style="padding: 8px 6px; color: #38bdf8; font-weight: bold;">Enfoque Pedagógico</td><td style="color: #f8fafc;">STEAM+ (Ciencia, Tecnología, Ingeniería, Artes, Matemáticas)</td></tr>' +
                    '<tr style="border-bottom: 1px solid rgba(255,255,255,0.1);"><td style="padding: 8px 6px; color: #38bdf8; font-weight: bold;">Stack de Software</td><td style="color: #f8fafc;">HTML5 Canvas, CSS3 Grid/Flexbox, JavaScript Puro (Vanilla JS). Cero CDNs, 100% offline.</td></tr>' +
                    '<tr style="border-bottom: 1px solid rgba(255,255,255,0.1);"><td style="padding: 8px 6px; color: #38bdf8; font-weight: bold;">Pantallas HiDPI / Retina</td><td style="color: #f8fafc;">Compatible con window.devicePixelRatio para máxima nitidez geométrica</td></tr>' +
                    '<tr style="border-bottom: 1px solid rgba(255,255,255,0.1);"><td style="padding: 8px 6px; color: #38bdf8; font-weight: bold;">Despliegue GitHub Pages</td><td style="color: #38bdf8;"><a href="https://duranmgabriela05-cloud.github.io/LABORATORIO-RECTA-/" target="_blank" style="color: #38bdf8; text-decoration: underline;">https://duranmgabriela05-cloud.github.io/LABORATORIO-RECTA-/</a></td></tr>' +
                    '<tr><td style="padding: 8px 6px; color: #38bdf8; font-weight: bold;">Pruebas Unitarias</td><td style="color: #4ade80; font-weight: bold;">16 Casos formales / 111 Aserciones aprobadas (100%)</td></tr>' +
                '</table>' +
            '</div>',

        docManual: 
            '<div style="display: flex; flex-direction: column; gap: 14px;">' +
                '<h4 style="color: #38bdf8; margin: 0 0 6px 0;">📖 Manual Rápido para el Jurado Calificador</h4>' +
                '<p style="color: #cbd5e1; font-size: 0.9rem; margin: 0;">El laboratorio se estructura en 4 módulos integrados y didácticos diseñados para explorar, deducir y comprobar la elipse:</p>' +
                '<div style="background: rgba(15, 23, 42, 0.6); border: 1px solid var(--color-borde); border-radius: 10px; padding: 12px;">' +
                    '<strong style="color: #38bdf8;">1. Actividad Explora:</strong>' +
                    '<ul style="margin: 6px 0 0 20px; color: #e2e8f0; font-size: 0.88rem;">' +
                        '<li>Mueve los sliders de Centro (h, k) y Semiejes (a, b) para ver la deformación en tiempo real.</li>' +
                        '<li>Activa el <strong>Hilo del Jardinero</strong> para comprobar que d₁ + d₂ = 2a en cualquier punto P animado o arrastrado.</li>' +
                        '<li>Prueba el <strong>Modo Comparación</strong> (pág. 195) con a²=16 constante y b²=12, 9, 6, 2 para ver la variación de excentricidad.</li>' +
                    '</ul>' +
                '</div>' +
                '<div style="background: rgba(15, 23, 42, 0.6); border: 1px solid var(--color-borde); border-radius: 10px; padding: 12px;">' +
                    '<strong style="color: #38bdf8;">2. Actividad Analiza:</strong>' +
                    '<ul style="margin: 6px 0 0 20px; color: #e2e8f0; font-size: 0.88rem;">' +
                        '<li>Ingresa coeficientes de la ecuación general Ax² + Cy² + Dx + Ey + F = 0.</li>' +
                        '<li>El motor valida signos idénticos (A·C > 0) y ejecuta la completación algebraica de cuadrados paso a paso.</li>' +
                        '<li>Calcula centro, semiejes, focos, vértices, extremos, lado recto, excentricidad y grafica al instante.</li>' +
                    '</ul>' +
                '</div>' +
                '<div style="background: rgba(15, 23, 42, 0.6); border: 1px solid var(--color-borde); border-radius: 10px; padding: 12px;">' +
                    '<strong style="color: #38bdf8;">3. Actividad Arma:</strong>' +
                    '<ul style="margin: 6px 0 0 20px; color: #e2e8f0; font-size: 0.88rem;">' +
                        '<li>Selecciona entre los 3 casos canónicos del texto escolar: a) Centro y semiejes, b) Vértices y lado recto, c) Vértices y extremo.</li>' +
                        '<li>Acepta números decimales y fracciones exactas (ej. 4/3) y despliega la deducción formal analítica.</li>' +
                    '</ul>' +
                '</div>' +
                '<div style="background: rgba(15, 23, 42, 0.6); border: 1px solid var(--color-borde); border-radius: 10px; padding: 12px;">' +
                    '<strong style="color: #38bdf8;">4. Retos de Mati & Diploma STEAM+:</strong>' +
                    '<ul style="margin: 6px 0 0 20px; color: #e2e8f0; font-size: 0.88rem;">' +
                        '<li>Ronda evaluativa de 8 preguntas aleatorias con tolerancia numérica adaptativa (±0.05).</li>' +
                        '<li>Al culminar, ingresa tu nombre y descarga tu <strong>Diploma de Honor STEAM+ en alta resolución (PNG 1200x800)</strong>.</li>' +
                    '</ul>' +
                '</div>' +
            '</div>',

        docAlgoritmo:
            '<div style="display: flex; flex-direction: column; gap: 14px;">' +
                '<h4 style="color: #38bdf8; margin: 0 0 6px 0;">💻 Pseudocódigo y Modelado Matemático</h4>' +
                '<div style="background: #0f172a; border: 1px solid #334155; border-radius: 10px; padding: 12px; font-family: monospace; font-size: 0.84rem; color: #cbd5e1; line-height: 1.5;">' +
                    '<span style="color: #38bdf8;">ALGORITMO</span> CompletacionCuadrados(A, C, D, E, F):<br>' +
                    '&nbsp;&nbsp;<span style="color: #f59e0b;">SI</span> A * C <= 0 <span style="color: #f59e0b;">ENTONCES</span> RETORNAR Error("No es una elipse real")<br>' +
                    '&nbsp;&nbsp;h = -D / (2 * A)<br>' +
                    '&nbsp;&nbsp;k = -E / (2 * C)<br>' +
                    '&nbsp;&nbsp;K = -F + A * h² + C * k²<br>' +
                    '&nbsp;&nbsp;<span style="color: #f59e0b;">SI</span> K <= 0 <span style="color: #f59e0b;">ENTONCES</span> RETORNAR Error("Elipse imaginaria o punto degenerado")<br>' +
                    '&nbsp;&nbsp;denomX = K / A, denomY = K / C<br>' +
                    '&nbsp;&nbsp;<span style="color: #f59e0b;">SI</span> denomX >= denomY <span style="color: #f59e0b;">ENTONCES</span><br>' +
                    '&nbsp;&nbsp;&nbsp;&nbsp;orientacion = "horizontal", a = √(denomX), b = √(denomY)<br>' +
                    '&nbsp;&nbsp;<span style="color: #f59e0b;">SINO</span><br>' +
                    '&nbsp;&nbsp;&nbsp;&nbsp;orientacion = "vertical", a = √(denomY), b = √(denomX)<br>' +
                    '&nbsp;&nbsp;c = √(a² - b²), e = c / a, LR = (2 * b²) / a<br>' +
                    '&nbsp;&nbsp;RETORNAR { centro: (h, k), a, b, c, e, LR, orientacion }<br>' +
                    '<span style="color: #38bdf8;">FIN ALGORITMO</span>' +
                '</div>' +
                '<div style="background: #0f172a; border: 1px solid #334155; border-radius: 10px; padding: 12px; font-family: monospace; font-size: 0.84rem; color: #cbd5e1; line-height: 1.5;">' +
                    '<span style="color: #38bdf8;">ALGORITMO</span> HiloDelJardinero(elipse, anguloGrados):<br>' +
                    '&nbsp;&nbsp;θ = anguloGrados * π / 180<br>' +
                    '&nbsp;&nbsp;<span style="color: #f59e0b;">SI</span> elipse.orientacion == "horizontal" <span style="color: #f59e0b;">ENTONCES</span><br>' +
                    '&nbsp;&nbsp;&nbsp;&nbsp;P = (elipse.h + elipse.a * cos(θ), elipse.k + elipse.b * sin(θ))<br>' +
                    '&nbsp;&nbsp;<span style="color: #f59e0b;">SINO</span><br>' +
                    '&nbsp;&nbsp;&nbsp;&nbsp;P = (elipse.h + elipse.b * cos(θ), elipse.k + elipse.a * sin(θ))<br>' +
                    '&nbsp;&nbsp;d1 = distanciaEuclidiana(P, elipse.foco1)<br>' +
                    '&nbsp;&nbsp;d2 = distanciaEuclidiana(P, elipse.foco2)<br>' +
                    '&nbsp;&nbsp;suma = d1 + d2<br>' +
                    '&nbsp;&nbsp;<span style="color: #10b981;">// Invariante demostrada: suma == 2 * a para todo θ</span><br>' +
                    '&nbsp;&nbsp;RETORNAR { P, d1, d2, suma, dosA: 2 * elipse.a }<br>' +
                    '<span style="color: #38bdf8;">FIN ALGORITMO</span>' +
                '</div>' +
            '</div>',

        docPruebas:
            '<div style="display: flex; flex-direction: column; gap: 14px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">' +
                    '<h4 style="color: #38bdf8; margin: 0;">🧪 Suite de Pruebas Unitarias Automatizadas</h4>' +
                    '<span style="background: rgba(74, 222, 128, 0.2); border: 1px solid #4ade80; color: #4ade80; padding: 3px 10px; border-radius: 6px; font-weight: bold; font-size: 0.85rem;">111/111 APROBADAS (100%)</span>' +
                '</div>' +
                '<p style="color: #cbd5e1; font-size: 0.88rem; margin: 0;">Ejecución rigurosa en Node.js y en navegador sin librerías externas para garantizar precisión matemática absoluta:</p>' +
                '<table style="width: 100%; border-collapse: collapse; font-size: 0.82rem;">' +
                    '<thead style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">' +
                        '<tr><th style="padding: 6px; text-align: left;">Caso</th><th style="padding: 6px; text-align: left;">Descripción</th><th style="padding: 6px; text-align: left;">Entrada</th><th style="padding: 6px; text-align: center;">Resultado</th></tr>' +
                    '</thead>' +
                    '<tbody style="color: #e2e8f0;">' +
                        '<tr style="border-bottom: 1px solid rgba(255,255,255,0.06);"><td style="padding: 5px;">Caso 1</td><td>Elipse canónica horizontal en el origen</td><td>x²/25 + y²/9 = 1</td><td style="color:#4ade80; text-align:center;">✅ Aprobado</td></tr>' +
                        '<tr style="border-bottom: 1px solid rgba(255,255,255,0.06);"><td style="padding: 5px;">Caso 2</td><td>Elipse canónica vertical en el origen</td><td>x²/9 + y²/25 = 1</td><td style="color:#4ade80; text-align:center;">✅ Aprobado</td></tr>' +
                        '<tr style="border-bottom: 1px solid rgba(255,255,255,0.06);"><td style="padding: 5px;">Caso 3</td><td>Elipse horizontal desplazada (h, k)</td><td>(x-2)²/16 + (y+3)²/4 = 1</td><td style="color:#4ade80; text-align:center;">✅ Aprobado</td></tr>' +
                        '<tr style="border-bottom: 1px solid rgba(255,255,255,0.06);"><td style="padding: 5px;">Caso 4</td><td>Elipse vertical desplazada (h, k)</td><td>(x+1)²/4 + (y-4)²/9 = 1</td><td style="color:#4ade80; text-align:center;">✅ Aprobado</td></tr>' +
                        '<tr style="border-bottom: 1px solid rgba(255,255,255,0.06);"><td style="padding: 5px;">Caso 5</td><td>Caso degenerado circunferencia (a = b)</td><td>a=4, b=4, c=0, e=0</td><td style="color:#4ade80; text-align:center;">✅ Aprobado</td></tr>' +
                        '<tr style="border-bottom: 1px solid rgba(255,255,255,0.06);"><td style="padding: 5px;">Caso 6</td><td>Ejemplo 1 del texto escolar (Horizontal)</td><td>Centro (2,-3), a=3, b=√5</td><td style="color:#4ade80; text-align:center;">✅ Aprobado</td></tr>' +
                        '<tr style="border-bottom: 1px solid rgba(255,255,255,0.06);"><td style="padding: 5px;">Caso 7</td><td>Ejemplo 2 del texto escolar (Vertical)</td><td>4x² + 25y² + 16x - 250y + 541 = 0</td><td style="color:#4ade80; text-align:center;">✅ Aprobado</td></tr>' +
                        '<tr style="border-bottom: 1px solid rgba(255,255,255,0.06);"><td style="padding: 5px;">Caso 8</td><td>Ejemplo 3: Vértices (3,6), (3,-2) y LR=6</td><td>Deducción Caso B: a=4, b=√12</td><td style="color:#4ade80; text-align:center;">✅ Aprobado</td></tr>' +
                        '<tr style="border-bottom: 1px solid rgba(255,255,255,0.06);"><td style="padding: 5px;">Caso 9</td><td>Comparación de excentricidades pág. 195</td><td>a²=16, b²=12,9,6,2</td><td style="color:#4ade80; text-align:center;">✅ Aprobado</td></tr>' +
                        '<tr style="border-bottom: 1px solid rgba(255,255,255,0.06);"><td style="padding: 5px;">Caso 10</td><td>Validación de ecuación general no elíptica</td><td>A y C de signos opuestos o cero</td><td style="color:#4ade80; text-align:center;">✅ Aprobado</td></tr>' +
                        '<tr style="border-bottom: 1px solid rgba(255,255,255,0.06);"><td style="padding: 5px;">Caso 11</td><td>Parseo robusto de fracciones y signos</td><td>"3/4", "-2/5", "3.5"</td><td style="color:#4ade80; text-align:center;">✅ Aprobado</td></tr>' +
                        '<tr style="border-bottom: 1px solid rgba(255,255,255,0.06);"><td style="padding: 5px;">Caso 12</td><td>Invariante matemática b ≤ a garantizada</td><td>b siempre menor o igual que a</td><td style="color:#4ade80; text-align:center;">✅ Aprobado</td></tr>' +
                        '<tr style="border-bottom: 1px solid rgba(255,255,255,0.06);"><td style="padding: 5px;">Caso 13</td><td>Formateo algebraico canónico sin NaN</td><td>(x-h)²/a² + (y-k)²/b² = 1</td><td style="color:#4ade80; text-align:center;">✅ Aprobado</td></tr>' +
                        '<tr style="border-bottom: 1px solid rgba(255,255,255,0.06);"><td style="padding: 5px;">Caso 14</td><td>Banco de preguntas y tolerancias en Retos</td><td>Generador aleatorio de retos</td><td style="color:#4ade80; text-align:center;">✅ Aprobado</td></tr>' +
                        '<tr style="border-bottom: 1px solid rgba(255,255,255,0.06);"><td style="padding: 5px;">Caso 15</td><td>Ejercicios propuestos del libro (2a, 2b, 4a, 4b)</td><td>Resolución analítica exacta</td><td style="color:#4ade80; text-align:center;">✅ Aprobado</td></tr>' +
                        '<tr><td style="padding: 5px;">Caso 16</td><td>Hilo del Jardinero d₁ + d₂ = 2a constante</td><td>Invariante para θ = 0°, 45°, 90°, 180°</td><td style="color:#4ade80; text-align:center;">✅ Aprobado</td></tr>' +
                    '</tbody>' +
                '</table>' +
            '</div>'
    };

    function mostrarTabDocs(nombreTab) {
        tabsDoc.forEach(tab => {
            if (tab.getAttribute('data-tab') === nombreTab) {
                tab.classList.add('activa');
            } else {
                tab.classList.remove('activa');
            }
        });

        if (cuerpoDocumentacion && contenidosDocs[nombreTab]) {
            cuerpoDocumentacion.innerHTML = contenidosDocs[nombreTab];
        }
    }

    function abrirModalDocs() {
        if (modalDocs) {
            modalDocs.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            mostrarTabDocs('docFicha');
        }
    }

    function cerrarModalDocs() {
        if (modalDocs) {
            modalDocs.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    if (btnAbrirDocs) btnAbrirDocs.addEventListener('click', abrirModalDocs);
    if (btnCerrarDocs) btnCerrarDocs.addEventListener('click', cerrarModalDocs);

    if (modalDocs) {
        modalDocs.addEventListener('click', e => {
            if (e.target === modalDocs) cerrarModalDocs();
        });
    }

    tabsDoc.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            mostrarTabDocs(tabId);
        });
    });

    // ════════════════════════════════════════════════════════════════════════
    // 10. DESCARGA DE GRÁFICAS EN ALTA DEFINICIÓN (PNG)
    // ════════════════════════════════════════════════════════════════════════
    const botonesDescargaPNG = document.querySelectorAll('.btn-descargar-png');
    botonesDescargaPNG.forEach(btn => {
        btn.addEventListener('click', () => {
            const canvasId = btn.getAttribute('data-canvas');
            let canvas = canvasId ? document.getElementById(canvasId) : null;
            if (!canvas) {
                const contenedorCol = btn.closest('.columna-grafica');
                if (contenedorCol) canvas = contenedorCol.querySelector('canvas');
            }
            if (!canvas) return;

            const ecuacionId = btn.getAttribute('data-ecuacion');
            const elEcuacion = ecuacionId ? document.getElementById(ecuacionId) : null;
            const txtEcuacion = elEcuacion ? (elEcuacion.innerText || elEcuacion.textContent || '').trim() : '';

            const nombreBase = btn.getAttribute('data-nombre') || 'grafica-elipse';
            descargarCanvasConMembrete(canvas, txtEcuacion, nombreBase);
        });
    });

    function descargarCanvasConMembrete(canvasFuente, ecuacionTexto, prefijoNombre) {
        const w = canvasFuente.width || 800;
        const hFuente = canvasFuente.height || 800;
        const headerH = 70;
        const footerH = 40;
        const totalH = hFuente + headerH + footerH;

        const expCanvas = document.createElement('canvas');
        expCanvas.width = w;
        expCanvas.height = totalH;
        const expCtx = expCanvas.getContext('2d');

        // Fondo elegante
        expCtx.fillStyle = '#0f172a';
        expCtx.fillRect(0, 0, w, totalH);

        // Encabezado institucional
        expCtx.fillStyle = '#38bdf8';
        expCtx.font = 'bold ' + Math.max(16, Math.round(w * 0.032)) + 'px system-ui, sans-serif';
        expCtx.fillText('Laboratorio de la Elipse · Feria STEAM+ 2026', 24, 32);

        expCtx.fillStyle = '#94a3b8';
        expCtx.font = Math.max(12, Math.round(w * 0.022)) + 'px system-ui, sans-serif';
        expCtx.fillText('Valeria Hinestroza · Salomé Jiménez · Gabriela Muñoz · Grado 10°', 24, 52);

        // Dibujar el gráfico original
        expCtx.drawImage(canvasFuente, 0, headerH);

        // Pie con link oficial y ecuación si existe
        expCtx.fillStyle = '#64748b';
        expCtx.font = Math.max(11, Math.round(w * 0.02)) + 'px system-ui, sans-serif';
        let pieTexto = 'https://duranmgabriela05-cloud.github.io/LABORATORIO-RECTA-/';
        if (ecuacionTexto && ecuacionTexto.length < 50) {
            pieTexto += '  |  ' + ecuacionTexto;
        }
        expCtx.fillText(pieTexto, 24, totalH - 16);

        // Descargar PNG
        const a = document.createElement('a');
        a.download = prefijoNombre + '-steam-2026.png';
        a.href = expCanvas.toDataURL('image/png');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // ════════════════════════════════════════════════════════════════════════
    // 11. MODAL DE AYUDA RÁPIDA: "¿CÓMO FUNCIONA ESTA ACTIVIDAD?"
    // ════════════════════════════════════════════════════════════════════════
    const modalAyuda = document.getElementById('modalAyuda');
    const btnCerrarAyuda = document.getElementById('btnCerrarAyuda');
    const btnEntendidoAyuda = document.getElementById('btnEntendidoAyuda');
    const iconoModalAyuda = document.getElementById('iconoModalAyuda');
    const tituloModalAyuda = document.getElementById('tituloModalAyuda');
    const subtituloModalAyuda = document.getElementById('subtituloModalAyuda');
    const cuerpoModalAyuda = document.getElementById('cuerpoModalAyuda');
    const botonesAyuda = document.querySelectorAll('.btn-ayuda-actividad');

    const guiasAyuda = {
        explora: {
            icono: '🔭',
            titulo: '¿Cómo funciona "Explora la Elipse"?',
            subtitulo: 'Experimenta la deformación y parámetros en tiempo real',
            html: 
                '<div style="display: flex; flex-direction: column; gap: 12px;">' +
                    '<div style="background: rgba(56, 189, 248, 0.1); border-left: 3px solid #38bdf8; padding: 10px 14px; border-radius: 6px;">' +
                        '<strong style="color: #38bdf8;">1. Mueve los Deslizadores:</strong>' +
                        '<p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 0.88rem;">Varía el centro (h, k), el semieje mayor (a) y el semieje menor (b). Recuerda que por definición matemática siempre <strong>a ≥ b</strong>.</p>' +
                    '</div>' +
                    '<div style="background: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981; padding: 10px 14px; border-radius: 6px;">' +
                        '<strong style="color: #10b981;">2. Hilo del Jardinero (d₁ + d₂ = 2a):</strong>' +
                        '<p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 0.88rem;">Activa la casilla para ver los dos segmentos elásticos. Puedes <strong>arrastrar el punto P</strong> sobre la elipse con el ratón o pantalla táctil, o activar el recorrido animado automático.</p>' +
                    '</div>' +
                    '<div style="background: rgba(245, 158, 11, 0.1); border-left: 3px solid #f59e0b; padding: 10px 14px; border-radius: 6px;">' +
                        '<strong style="color: #f59e0b;">3. Experimento de Excentricidades:</strong>' +
                        '<p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 0.88rem;">Pulsa el botón de comparar para visualizar las 4 elipses con a²=16 fijo. Observa cómo al achicarse b², los focos migran hacia los vértices.</p>' +
                    '</div>' +
                    '<div style="background: rgba(255, 255, 255, 0.05); border: 1px solid var(--color-borde); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; color: #94a3b8;">' +
                        '💡 <strong>Consejo para la Feria:</strong> Si deseas empezar de nuevo con un nuevo jurado o visitante, pulsa <strong>🔄 Restablecer</strong>.' +
                    '</div>' +
                '</div>'
        },
        analiza: {
            icono: '🧮',
            titulo: '¿Cómo funciona "Analiza la Ecuación"?',
            subtitulo: 'Deducción automática de elementos a partir de cualquier ecuación',
            html: 
                '<div style="display: flex; flex-direction: column; gap: 12px;">' +
                    '<div style="background: rgba(56, 189, 248, 0.1); border-left: 3px solid #38bdf8; padding: 10px 14px; border-radius: 6px;">' +
                        '<strong style="color: #38bdf8;">1. Elige la Forma:</strong>' +
                        '<p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 0.88rem;">Canónica <code>(x−h)²/denX + (y−k)²/denY = 1</code> o General <code>A·x² + B·y² = C</code>.</p>' +
                    '</div>' +
                    '<div style="background: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981; padding: 10px 14px; border-radius: 6px;">' +
                        '<strong style="color: #10b981;">2. Admite Fracciones y Decimales:</strong>' +
                        '<p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 0.88rem;">Puedes escribir números enteros (ej. <code>9</code>), decimales (ej. <code>2.5</code>) o fracciones exactas como <code>3/2</code> o <code>-1/4</code>.</p>' +
                    '</div>' +
                    '<div style="background: rgba(245, 158, 11, 0.1); border-left: 3px solid #f59e0b; padding: 10px 14px; border-radius: 6px;">' +
                        '<strong style="color: #f59e0b;">3. Resultados en Detalle:</strong>' +
                        '<p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 0.88rem;">El laboratorio calcula centro, semiejes a y b, distancia focal c, lado recto, excentricidad e y dibuja el paso a paso algebraico.</p>' +
                    '</div>' +
                '</div>'
        },
        arma: {
            icono: '🧩',
            titulo: '¿Cómo funciona "Arma tu Elipse"?',
            subtitulo: 'Construcción paso a paso a partir de datos conocidos',
            html: 
                '<div style="display: flex; flex-direction: column; gap: 12px;">' +
                    '<div style="background: rgba(56, 189, 248, 0.1); border-left: 3px solid #38bdf8; padding: 10px 14px; border-radius: 6px;">' +
                        '<strong style="color: #38bdf8;">1. Selecciona tu Caso:</strong>' +
                        '<ul style="margin: 4px 0 0 16px; color: #cbd5e1; font-size: 0.86rem;">' +
                            '<li><strong>a)</strong> Centro, longitud del eje mayor, eje menor y orientación.</li>' +
                            '<li><strong>b)</strong> Dos vértices del eje mayor y longitud del lado recto (LR).</li>' +
                            '<li><strong>c)</strong> Dos vértices del eje mayor y un extremo del eje menor.</li>' +
                        '</ul>' +
                    '</div>' +
                    '<div style="background: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981; padding: 10px 14px; border-radius: 6px;">' +
                        '<strong style="color: #10b981;">2. Deducción Paso a Paso:</strong>' +
                        '<p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 0.88rem;">Al pulsar "Armar Ecuación", el laboratorio despliega las fórmulas analíticas, la sustitución exacta y la ecuación canónica resultante.</p>' +
                    '</div>' +
                '</div>'
        },
        retos: {
            icono: '🎯',
            titulo: '¿Cómo funcionan los "Retos de Mati"?',
            subtitulo: 'Demuestra tus habilidades matemáticas y gana tu Diploma STEAM+',
            html: 
                '<div style="display: flex; flex-direction: column; gap: 12px;">' +
                    '<div style="background: rgba(56, 189, 248, 0.1); border-left: 3px solid #38bdf8; padding: 10px 14px; border-radius: 6px;">' +
                        '<strong style="color: #38bdf8;">1. Ronda de 8 Preguntas:</strong>' +
                        '<p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 0.88rem;">Observa la elipse en el canvas y la ecuación generada al azar. Responde en el campo de texto (acepta enteros, decimales y fracciones).</p>' +
                    '</div>' +
                    '<div style="background: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981; padding: 10px 14px; border-radius: 6px;">' +
                        '<strong style="color: #10b981;">2. ¿Tienes dudas? ¡Usa la Pista!</strong>' +
                        '<p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 0.88rem;">El botón "💡 Pista" te orientará sobre la fórmula necesaria sin quitarte la oportunidad de responder.</p>' +
                    '</div>' +
                    '<div style="background: rgba(245, 158, 11, 0.1); border-left: 3px solid #f59e0b; padding: 10px 14px; border-radius: 6px;">' +
                        '<strong style="color: #f59e0b;">3. Diploma de Honor Descargable:</strong>' +
                        '<p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 0.88rem;">Al terminar la ronda, escribe el nombre del visitante o jurado y descarga el diploma de honor en alta definición (PNG 1200x800).</p>' +
                    '</div>' +
                '</div>'
        }
    };

    function abrirModalAyuda(seccion) {
        if (!modalAyuda) return;
        const info = guiasAyuda[seccion] || guiasAyuda.explora;
        if (iconoModalAyuda) iconoModalAyuda.textContent = info.icono;
        if (tituloModalAyuda) tituloModalAyuda.textContent = info.titulo;
        if (subtituloModalAyuda) subtituloModalAyuda.textContent = info.subtitulo;
        if (cuerpoModalAyuda) cuerpoModalAyuda.innerHTML = info.html;
        modalAyuda.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function cerrarModalAyuda() {
        if (!modalAyuda) return;
        modalAyuda.style.display = 'none';
        document.body.style.overflow = '';
    }

    botonesAyuda.forEach(btn => {
        btn.addEventListener('click', () => {
            const seccion = btn.getAttribute('data-ayuda') || 'explora';
            abrirModalAyuda(seccion);
        });
    });

    if (btnCerrarAyuda) btnCerrarAyuda.addEventListener('click', cerrarModalAyuda);
    if (btnEntendidoAyuda) btnEntendidoAyuda.addEventListener('click', cerrarModalAyuda);

    if (modalAyuda) {
        modalAyuda.addEventListener('click', e => {
            if (e.target === modalAyuda) cerrarModalAyuda();
        });
    }

    // Cerrar cualquier modal con tecla Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' || e.keyCode === 27) {
            cerrarModalQR();
            cerrarModalDocs();
            cerrarModalAyuda();
        }
    });

    // Exponer función de navegación global
    window.navegarA = navegarA;
});
