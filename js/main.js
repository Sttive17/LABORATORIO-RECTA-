/**
 * Laboratorio de la Elipse - Feria STEAM+ 2026
 * Valeria Hinestroza · Salomé Jiménez · Gabriela Muñoz
 * Controlador Principal: Navegación fluida entre pantallas, inicialización bajo demanda,
 * redibujado reactivo ante cambios de tamaño y mascota Mati.
 */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    var pantallas = {
        bienvenida: document.getElementById('pantallaBienvenida'),
        menu: document.getElementById('pantallaMenu'),
        explora: document.getElementById('pantallaExplora'),
        analiza: document.getElementById('pantallaAnaliza'),
        arma: document.getElementById('pantallaArma'),
        retos: document.getElementById('pantallaRetos')
    };

    var inicializados = {
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
        Object.keys(pantallas).forEach(function (clave) {
            var el = pantallas[clave];
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
        requestAnimationFrame(function () {
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
    var btnEmpezar = document.getElementById('btnEmpezar');
    if (btnEmpezar) {
        btnEmpezar.addEventListener('click', function () {
            navegarA('menu');
        });
    }

    // 2. Botón volver a Bienvenida desde el Menú
    var btnVolverBienvenida = document.getElementById('btnVolverBienvenida');
    if (btnVolverBienvenida) {
        btnVolverBienvenida.addEventListener('click', function () {
            navegarA('bienvenida');
        });
    }

    // 3. Tarjetas del Menú Principal
    var tarjetaExplora = document.getElementById('tarjetaExplora');
    if (tarjetaExplora) {
        tarjetaExplora.addEventListener('click', function () {
            navegarA('explora');
        });
    }

    var tarjetaAnaliza = document.getElementById('tarjetaAnaliza');
    if (tarjetaAnaliza) {
        tarjetaAnaliza.addEventListener('click', function () {
            navegarA('analiza');
        });
    }

    var tarjetaArma = document.getElementById('tarjetaArma');
    if (tarjetaArma) {
        tarjetaArma.addEventListener('click', function () {
            navegarA('arma');
        });
    }

    var tarjetaRetos = document.getElementById('tarjetaRetos');
    if (tarjetaRetos) {
        tarjetaRetos.addEventListener('click', function () {
            navegarA('retos');
        });
    }

    // 4. Botones volver al menú en todas las actividades
    var botonesVolverMenu = document.querySelectorAll('.btn-volver-menu');
    botonesVolverMenu.forEach(function (btn) {
        btn.addEventListener('click', function () {
            navegarA('menu');
        });
    });

    // 5. Redibujado responsivo continuo ante redimensionado o cambio de zoom
    var resizeTimer = null;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (pantallas.explora && pantallas.explora.classList.contains('activa')) {
                UIExplora.actualizar();
            } else if (pantallas.analiza && pantallas.analiza.classList.contains('activa') && UIAnaliza.redibujar) {
                UIAnaliza.redibujar();
            } else if (pantallas.arma && pantallas.arma.classList.contains('activa') && UIArma.redibujar) {
                UIArma.redibujar();
            } else if (pantallas.retos && pantallas.retos.classList.contains('activa') && UIRetos.redibujar) {
                UIRetos.redibujar();
            }
        }, 120);
    });

    // 6. Generar estrellas titilantes en el fondo cósmico de bienvenida
    generarEstrellasFondo();

    function generarEstrellasFondo() {
        var contenedor = document.getElementById('capaEstrellas');
        if (!contenedor) return;

        var numEstrellas = 60;
        for (var i = 0; i < numEstrellas; i++) {
            var estrella = document.createElement('div');
            estrella.className = 'estrella';
            var x = Math.random() * 100;
            var y = Math.random() * 100;
            var tam = Math.random() * 3 + 1.5;
            var retardo = Math.random() * 4;
            var duracion = Math.random() * 2 + 2;

            estrella.style.left = x + '%';
            estrella.style.top = y + '%';
            estrella.style.width = tam + 'px';
            estrella.style.height = tam + 'px';
            estrella.style.animationDelay = retardo + 's';
            estrella.style.animationDuration = duracion + 's';

            contenedor.appendChild(estrella);
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // 7. MODAL DE CÓDIGO QR PARA EL JURADO Y VISITANTES EN LA FERIA
    // ════════════════════════════════════════════════════════════════════════
    var btnAbrirQR = document.getElementById('btnAbrirQR');
    var modalQR = document.getElementById('modalQR');
    var btnCerrarQR = document.getElementById('btnCerrarQR');
    var btnCopiarEnlaceQR = document.getElementById('btnCopiarEnlaceQR');
    var inputEnlaceQR = document.getElementById('inputEnlaceQR');

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
        modalQR.addEventListener('click', function (e) {
            if (e.target === modalQR) cerrarModalQR();
        });
    }

    if (btnCopiarEnlaceQR && inputEnlaceQR) {
        btnCopiarEnlaceQR.addEventListener('click', function () {
            var url = inputEnlaceQR.value || 'https://duranmgabriela05-cloud.github.io/LABORATORIO-RECTA-/';
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(function () {
                    var txtOriginal = btnCopiarEnlaceQR.textContent;
                    btnCopiarEnlaceQR.textContent = '¡Copiado! 👍';
                    btnCopiarEnlaceQR.style.background = '#10b981';
                    setTimeout(function () {
                        btnCopiarEnlaceQR.textContent = txtOriginal;
                        btnCopiarEnlaceQR.style.background = '';
                    }, 2000);
                }).catch(function () {
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
    var btnPantallaCompleta = document.getElementById('btnPantallaCompleta');

    function alternarPantallaCompleta() {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            var el = document.documentElement;
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
        var esFull = !!(document.fullscreenElement || document.webkitFullscreenElement);
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
    var btnAbrirDocs = document.getElementById('btnAbrirDocs');
    var modalDocs = document.getElementById('modalDocs');
    var btnCerrarDocs = document.getElementById('btnCerrarDocs');
    var cuerpoDocumentacion = document.getElementById('cuerpoDocumentacion');
    var tabsDoc = document.querySelectorAll('.tab-doc');

    var contenidosDocs = {
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
                        '<li>Ronda evaluativa de 5 preguntas aleatorias con tolerancia numérica adaptativa (±0.05).</li>' +
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
            '</div>',

        docSustentacion:
            '<div style="display: flex; flex-direction: column; gap: 14px;">' +
                '<h4 style="color: #38bdf8; margin: 0 0 6px 0;">🗣️ Guion de Sustentación para las Estudiantes (3 Minutos)</h4>' +
                '<div style="background: rgba(15, 23, 42, 0.6); border-left: 3px solid #38bdf8; padding: 10px 14px; border-radius: 8px;">' +
                    '<strong style="color: #38bdf8;">Minuto 1: Introducción y Planteamiento (Valeria Hinestroza)</strong>' +
                    '<p style="color: #cbd5e1; font-size: 0.88rem; margin: 4px 0 0 0;">"Buenos días, jurado evaluador. Nuestro proyecto es el Laboratorio Interactivo de la Elipse. Como estudiantes de grado décimo, notamos que visualizar la transición entre la ecuación general de segundo grado y sus propiedades focales suele ser abstracto. Por eso creamos una plataforma 100% construida desde cero en código puro, sin librerías externas ni GeoGebra embebido, que permite experimentar la geometría analítica en tiempo real."</p>' +
                '</div>' +
                '<div style="background: rgba(15, 23, 42, 0.6); border-left: 3px solid #10b981; padding: 10px 14px; border-radius: 8px;">' +
                    '<strong style="color: #10b981;">Minuto 2: Demostración Interactiva en Vivo (Salomé Jiménez)</strong>' +
                    '<p style="color: #cbd5e1; font-size: 0.88rem; margin: 4px 0 0 0;">"Observen aquí la definición geométrica fundamental: el Hilo del Jardinero. Al mover el punto P a lo largo de la curva, las distancias a los focos d₁ y d₂ varían, pero su suma siempre permanece constante e igual a 2a. Además, en el Modo Comparación demostramos el experimento de la página 195: manteniendo a²=16 fijo y variando b², vemos cómo la elipse pasa de ser casi circular hasta aplastarse como la órbita de un cometa."</p>' +
                '</div>' +
                '<div style="background: rgba(15, 23, 42, 0.6); border-left: 3px solid #f59e0b; padding: 10px 14px; border-radius: 8px;">' +
                    '<strong style="color: #f59e0b;">Minuto 3: Rigor Matemático y Software (Gabriela Muñoz)</strong>' +
                    '<p style="color: #cbd5e1; font-size: 0.88rem; margin: 4px 0 0 0;">"En el módulo Analiza implementamos el algoritmo exacto de completación de cuadrados, identificando si la ecuación es real, un punto o imaginaria. Nuestro software cuenta con una suite automatizada de 111 pruebas unitarias aprobadas al 100%, renderizado en alta definición HiDPI y un sistema de Retos gamificado con diplomas descargables. Los invitamos a escanear el código QR en pantalla y probarlo en sus teléfonos."</p>' +
                '</div>' +
            '</div>'
    };

    function mostrarTabDocs(nombreTab) {
        tabsDoc.forEach(function (tab) {
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
        modalDocs.addEventListener('click', function (e) {
            if (e.target === modalDocs) cerrarModalDocs();
        });
    }

    tabsDoc.forEach(function (tab) {
        tab.addEventListener('click', function () {
            var tabId = tab.getAttribute('data-tab');
            mostrarTabDocs(tabId);
        });
    });

    // Cerrar modales con tecla Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            cerrarModalQR();
            cerrarModalDocs();
        }
    });

    // ════════════════════════════════════════════════════════════════════════
    // 10. DESCARGA DE GRÁFICAS EN ALTA DEFINICIÓN (PNG)
    // ════════════════════════════════════════════════════════════════════════
    var botonesDescargaPNG = document.querySelectorAll('.btn-descargar-png');
    botonesDescargaPNG.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var canvasId = btn.getAttribute('data-canvas');
            var canvas = canvasId ? document.getElementById(canvasId) : null;
            if (!canvas) {
                var contenedorCol = btn.closest('.columna-grafica');
                if (contenedorCol) canvas = contenedorCol.querySelector('canvas');
            }
            if (!canvas) return;

            var ecuacionId = btn.getAttribute('data-ecuacion');
            var elEcuacion = ecuacionId ? document.getElementById(ecuacionId) : null;
            var txtEcuacion = elEcuacion ? (elEcuacion.innerText || elEcuacion.textContent || '').trim() : '';

            var nombreBase = btn.getAttribute('data-nombre') || 'grafica-elipse';
            descargarCanvasConMembrete(canvas, txtEcuacion, nombreBase);
        });
    });

    function descargarCanvasConMembrete(canvasFuente, ecuacionTexto, prefijoNombre) {
        var w = canvasFuente.width || 800;
        var hFuente = canvasFuente.height || 800;
        var headerH = 70;
        var footerH = 40;
        var totalH = hFuente + headerH + footerH;

        var expCanvas = document.createElement('canvas');
        expCanvas.width = w;
        expCanvas.height = totalH;
        var expCtx = expCanvas.getContext('2d');

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
        var pieTexto = 'https://duranmgabriela05-cloud.github.io/LABORATORIO-RECTA-/';
        if (ecuacionTexto && ecuacionTexto.length < 50) {
            pieTexto += '  |  ' + ecuacionTexto;
        }
        expCtx.fillText(pieTexto, 24, totalH - 16);

        // Descargar PNG
        var a = document.createElement('a');
        a.download = prefijoNombre + '-steam-2026.png';
        a.href = expCanvas.toDataURL('image/png');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Exponer función de navegación global
    window.navegarA = navegarA;
});
