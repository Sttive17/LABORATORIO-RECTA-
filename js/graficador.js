/**
 * Laboratorio de la Elipse - Feria STEAM+ 2026
 * Valeria Hinestroza · Salomé Jiménez · Gabriela Muñoz
 * Módulo de Renderizado Gráfico en HTML5 Canvas
 * Dibuja plano cartesiano interactivo, cuadrícula, ejes numerados, elipses,
 * focos, vértices, extremos, lados rectos y ejes focales.
 * Alta fidelidad HiDPI, autoescala simétrica y actualización robusta.
 */

(function (raiz, fabrica) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = fabrica();
    } else {
        raiz.Graficador = fabrica();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    /**
     * Constructor del Graficador
     * @param {HTMLCanvasElement|string} canvas
     * @param {Object} [opciones]
     */
    function Graficador(canvas, opciones) {
        if (typeof canvas === 'string') {
            this.canvas = document.getElementById(canvas);
        } else {
            this.canvas = canvas;
        }

        if (!this.canvas) {
            console.error('Canvas no encontrado');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.opciones = opciones || {};

        // Configuración visual por defecto
        this.config = {
            fijaEscala: this.opciones.fijaEscala || false,
            rangoFijo: this.opciones.rangoFijo || 12,
            mostrarCentro: true,
            mostrarFocos: true,
            mostrarVertices: true,
            mostrarExtremosMenor: true,
            mostrarEjeFocal: true,
            mostrarLadoRecto: true,
            colorElipse: '#0284c7',
            colorFocos: '#ef4444',
            colorVertices: '#8b5cf6',
            colorExtremos: '#10b981',
            colorCentro: '#f59e0b',
            colorEjeFocal: 'rgba(239, 68, 68, 0.65)',
            colorLadoRecto: '#06b6d4'
        };

        // Ajustar resolución HiDPI inicial
        this.ajustarDPI();
    }

    /**
     * Ajusta la resolución del canvas según devicePixelRatio de forma idempotente y robusta.
     * Evita multiplicaciones sucesivas de escala y previene fallos cuando el canvas está oculto.
     */
    Graficador.prototype.ajustarDPI = function () {
        var dpr = window.devicePixelRatio || 1;
        var rect = this.canvas.getBoundingClientRect();
        var ancho = Math.round(rect.width) || this.canvas.clientWidth || 480;
        var alto = Math.round(rect.height) || this.canvas.clientHeight || ancho || 480;

        // Si el elemento está en display: none temporalmente, mantener dimensiones base seguras
        if (ancho <= 0) ancho = 480;
        if (alto <= 0) alto = ancho;

        var targetWidth = Math.round(ancho * dpr);
        var targetHeight = Math.round(alto * dpr);

        if (this.canvas.width !== targetWidth || this.canvas.height !== targetHeight) {
            this.canvas.width = targetWidth;
            this.canvas.height = targetHeight;
        }

        // Restablecer la matriz de transformación limpia y aplicar DPR
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);
        this.anchoCSS = ancho;
        this.altoCSS = alto;
    };

    /**
     * Calcula los límites del plano cartesiano (autoescala simétrica o escala fija inteligente).
     */
    Graficador.prototype.calcularLimites = function (elipse) {
        if (!elipse || !elipse.ok) {
            var rfDefault = this.config.rangoFijo || 12;
            return { minX: -rfDefault, maxX: rfDefault, minY: -rfDefault, maxY: rfDefault };
        }

        if (this.config.fijaEscala) {
            // Escala fija inteligente: mantiene la escala fija (12) a menos que la elipse la sobrepase
            var maxCoord = Math.max(
                Math.abs(elipse.centro.x) + elipse.a + 2,
                Math.abs(elipse.centro.y) + elipse.a + 2,
                this.config.rangoFijo || 12
            );
            var rf = Math.ceil(maxCoord);
            return { minX: -rf, maxX: rf, minY: -rf, maxY: rf };
        }

        // Autoescala que incluye el origen (0,0), el centro, los vértices, extremos y focos con margen
        var puntosX = [0, elipse.centro.x];
        var puntosY = [0, elipse.centro.y];

        if (elipse.vertices) {
            elipse.vertices.forEach(function (v) { puntosX.push(v.x); puntosY.push(v.y); });
        }
        if (elipse.extremosMenor) {
            elipse.extremosMenor.forEach(function (b) { puntosX.push(b.x); puntosY.push(b.y); });
        }
        if (elipse.focos) {
            elipse.focos.forEach(function (f) { puntosX.push(f.x); puntosY.push(f.y); });
        }

        var minX = Math.min.apply(null, puntosX);
        var maxX = Math.max.apply(null, puntosX);
        var minY = Math.min.apply(null, puntosY);
        var maxY = Math.max.apply(null, puntosY);

        var spanX = Math.max(maxX - minX, 4);
        var spanY = Math.max(maxY - minY, 4);
        var margenX = Math.max(spanX * 0.25, 2);
        var margenY = Math.max(spanY * 0.25, 2);

        var radioMax = Math.max(
            Math.abs(minX - margenX),
            Math.abs(maxX + margenX),
            Math.abs(minY - margenY),
            Math.abs(maxY + margenY),
            6
        );

        radioMax = Math.ceil(radioMax);

        return {
            minX: -radioMax,
            maxX: radioMax,
            minY: -radioMax,
            maxY: radioMax
        };
    };

    /**
     * Convierte coordenadas cartesianas a píxeles en canvas.
     */
    Graficador.prototype.aPixel = function (x, y, lim) {
        var px = ((x - lim.minX) / (lim.maxX - lim.minX)) * this.anchoCSS;
        var py = ((lim.maxY - y) / (lim.maxY - lim.minY)) * this.altoCSS;
        return { x: px, y: py };
    };

    /**
     * Dibuja la cuadrícula y los ejes cartesianos graduados.
     */
    Graficador.prototype.dibujarEjesYCuadricula = function (lim) {
        var ctx = this.ctx;
        var ancho = this.anchoCSS;
        var alto = this.altoCSS;

        // Fondo blanco nítido tipo papel milimetrado
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, ancho, alto);

        // Calcular paso adecuado de la cuadrícula (1, 2 o 5 según el rango)
        var rango = lim.maxX - lim.minX;
        var paso = 1;
        if (rango > 30) paso = 5;
        else if (rango > 16) paso = 2;

        // Cuadrícula secundaria suave
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#e2e8f0';

        var inicioX = Math.ceil(lim.minX / paso) * paso;
        var finX = Math.floor(lim.maxX / paso) * paso;
        for (var x = inicioX; x <= finX; x += paso) {
            var p1 = this.aPixel(x, lim.minY, lim);
            var p2 = this.aPixel(x, lim.maxY, lim);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }

        var inicioY = Math.ceil(lim.minY / paso) * paso;
        var finY = Math.floor(lim.maxY / paso) * paso;
        for (var y = inicioY; y <= finY; y += paso) {
            var q1 = this.aPixel(lim.minX, y, lim);
            var q2 = this.aPixel(lim.maxX, y, lim);
            ctx.beginPath();
            ctx.moveTo(q1.x, q1.y);
            ctx.lineTo(q2.x, q2.y);
            ctx.stroke();
        }

        // Ejes X e Y principales
        var origen = this.aPixel(0, 0, lim);

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#334155';

        // Eje X
        ctx.beginPath();
        ctx.moveTo(0, origen.y);
        ctx.lineTo(ancho, origen.y);
        ctx.stroke();

        // Eje Y
        ctx.beginPath();
        ctx.moveTo(origen.x, 0);
        ctx.lineTo(origen.x, alto);
        ctx.stroke();

        // Flechas en los extremos de los ejes
        ctx.fillStyle = '#334155';
        // Flecha X
        ctx.beginPath();
        ctx.moveTo(ancho, origen.y);
        ctx.lineTo(ancho - 8, origen.y - 5);
        ctx.lineTo(ancho - 8, origen.y + 5);
        ctx.fill();
        // Flecha Y
        ctx.beginPath();
        ctx.moveTo(origen.x, 0);
        ctx.lineTo(origen.x - 5, 8);
        ctx.lineTo(origen.x + 5, 8);
        ctx.fill();

        // Números y marcas en los ejes
        ctx.font = '11px sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        for (var nx = inicioX; nx <= finX; nx += paso) {
            if (nx === 0) continue;
            var posMarcaX = this.aPixel(nx, 0, lim);
            ctx.beginPath();
            ctx.moveTo(posMarcaX.x, origen.y - 3);
            ctx.lineTo(posMarcaX.x, origen.y + 3);
            ctx.stroke();
            ctx.fillText(String(nx), posMarcaX.x, origen.y + 6);
        }

        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        for (var ny = inicioY; ny <= finY; ny += paso) {
            if (ny === 0) continue;
            var posMarcaY = this.aPixel(0, ny, lim);
            ctx.beginPath();
            ctx.moveTo(origen.x - 3, posMarcaY.y);
            ctx.lineTo(origen.x + 3, posMarcaY.y);
            ctx.stroke();
            ctx.fillText(String(ny), origen.x - 6, posMarcaY.y);
        }

        // Rotular nombres de los ejes
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.fillText('X', ancho - 12, origen.y - 14);
        ctx.fillText('Y', origen.x + 16, 12);
        ctx.fillText('O', origen.x - 8, origen.y + 12);
    };

    /**
     * Dibuja un punto con borde, color de relleno y etiqueta rotulada.
     */
    Graficador.prototype.dibujarPunto = function (x, y, etiqueta, color, lim, desplazamiento) {
        var ctx = this.ctx;
        var p = this.aPixel(x, y, lim);
        desplazamiento = desplazamiento || { dx: 10, dy: -10 };

        // Punto exterior con anillo blanco
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        // Etiqueta con fondo semitransparente para máxima legibilidad
        var texto = etiqueta;
        ctx.font = 'bold 12px sans-serif';
        var anchoTexto = ctx.measureText(texto).width;

        var tx = p.x + desplazamiento.dx;
        var ty = p.y + desplazamiento.dy;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(tx - 3, ty - 10, anchoTexto + 6, 16);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.strokeRect(tx - 3, ty - 10, anchoTexto + 6, 16);

        ctx.fillStyle = '#0f172a';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(texto, tx, ty - 2);
    };

    /**
     * Dibuja una elipse completa con todos sus elementos configurados.
     * @param {Object} elipse Objeto retornado por Elipse.crearElipse(...)
     * @param {Object} [toggles] Anulación de opciones de visualización
     */
    Graficador.prototype.dibujar = function (elipse, toggles) {
        this.ajustarDPI();
        var ctx = this.ctx;
        var config = Object.assign({}, this.config, toggles || {});

        if (!elipse || !elipse.ok) {
            var limVacio = { minX: -10, maxX: 10, minY: -10, maxY: 10 };
            this.dibujarEjesYCuadricula(limVacio);
            return;
        }

        var lim = this.calcularLimites(elipse);
        this.dibujarEjesYCuadricula(lim);

        // 1. Eje focal (línea punteada)
        if (config.mostrarEjeFocal && elipse.ejeFocal) {
            ctx.save();
            ctx.setLineDash([6, 6]);
            ctx.lineWidth = 2;
            ctx.strokeStyle = config.colorEjeFocal;
            ctx.beginPath();
            if (elipse.ejeFocal.tipo === 'horizontal') {
                var efP1 = this.aPixel(lim.minX, elipse.ejeFocal.valor, lim);
                var efP2 = this.aPixel(lim.maxX, elipse.ejeFocal.valor, lim);
                ctx.moveTo(efP1.x, efP1.y);
                ctx.lineTo(efP2.x, efP2.y);
            } else {
                var efQ1 = this.aPixel(elipse.ejeFocal.valor, lim.minY, lim);
                var efQ2 = this.aPixel(elipse.ejeFocal.valor, lim.maxY, lim);
                ctx.moveTo(efQ1.x, efQ1.y);
                ctx.lineTo(efQ2.x, efQ2.y);
            }
            ctx.stroke();
            ctx.restore();
        }

        // 2. Lados rectos en los focos (segmentos de longitud LR)
        if (config.mostrarLadoRecto && !elipse.esCircunferencia && elipse.ladosRectosSegmentos) {
            ctx.save();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = config.colorLadoRecto;
            elipse.ladosRectosSegmentos.forEach(function (seg) {
                var s1 = this.aPixel(seg[0].x, seg[0].y, lim);
                var s2 = this.aPixel(seg[1].x, seg[1].y, lim);
                ctx.beginPath();
                ctx.moveTo(s1.x, s1.y);
                ctx.lineTo(s2.x, s2.y);
                ctx.stroke();
            }.bind(this));
            ctx.restore();
        }

        // 3. Trazo de la curva de la elipse
        var h = elipse.centro.x;
        var k = elipse.centro.y;
        var a = elipse.a;
        var b = elipse.b;
        var esHorizontal = elipse.orientacion === 'horizontal';

        ctx.save();
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = config.colorElipse;
        ctx.beginPath();

        var nPuntos = 240;
        for (var i = 0; i <= nPuntos; i++) {
            var t = (i * 2 * Math.PI) / nPuntos;
            var ex = esHorizontal ? (h + a * Math.cos(t)) : (h + b * Math.cos(t));
            var ey = esHorizontal ? (k + b * Math.sin(t)) : (k + a * Math.sin(t));
            var pix = this.aPixel(ex, ey, lim);
            if (i === 0) ctx.moveTo(pix.x, pix.y);
            else ctx.lineTo(pix.x, pix.y);
        }
        ctx.closePath();
        ctx.stroke();

        // Relleno suave con transparencia celeste
        ctx.fillStyle = 'rgba(2, 132, 199, 0.08)';
        ctx.fill();
        ctx.restore();

        // 4. Extremos del eje menor B' y B
        if (config.mostrarExtremosMenor && !elipse.esCircunferencia && elipse.extremosMenor) {
            this.dibujarPunto(elipse.extremosMenor[0].x, elipse.extremosMenor[0].y, "B'", config.colorExtremos, lim, { dx: -24, dy: -8 });
            this.dibujarPunto(elipse.extremosMenor[1].x, elipse.extremosMenor[1].y, 'B', config.colorExtremos, lim, { dx: 10, dy: -8 });
        }

        // 5. Vértices del eje mayor A' y A
        if (config.mostrarVertices && elipse.vertices) {
            this.dibujarPunto(elipse.vertices[0].x, elipse.vertices[0].y, "A'", config.colorVertices, lim, { dx: -24, dy: 10 });
            this.dibujarPunto(elipse.vertices[1].x, elipse.vertices[1].y, 'A', config.colorVertices, lim, { dx: 10, dy: 10 });
        }

        // 6. Focos F' y F (si no es circunferencia)
        if (config.mostrarFocos && !elipse.esCircunferencia && elipse.focos) {
            this.dibujarPunto(elipse.focos[0].x, elipse.focos[0].y, "F'", config.colorFocos, lim, { dx: -24, dy: -12 });
            this.dibujarPunto(elipse.focos[1].x, elipse.focos[1].y, 'F', config.colorFocos, lim, { dx: 10, dy: -12 });
        }

        // 7. Centro C
        if (config.mostrarCentro && elipse.centro) {
            this.dibujarPunto(elipse.centro.x, elipse.centro.y, 'C', config.colorCentro, lim, { dx: 10, dy: 10 });
        }

        // 8. Hilo del jardinero: segmentos F'P y FP (definición d1 + d2 = 2a)
        if (config.puntoP && elipse.focos) {
            this.dibujarHiloJardinero(elipse, config.puntoP, lim);
        }

        this.ultimoLim = lim;
    };

    /**
     * Dibuja los segmentos elásticos desde cada foco hasta el punto P de la curva,
     * rotulando sus longitudes d1 y d2.
     */
    Graficador.prototype.dibujarHiloJardinero = function (elipse, P, lim) {
        var ctx = this.ctx;
        var pp = this.aPixel(P.x, P.y, lim);
        var focos = elipse.focos;
        var colores = ['#db2777', '#7c3aed'];
        var etiquetas = ['d₁', 'd₂'];

        for (var i = 0; i < 2; i++) {
            var pf = this.aPixel(focos[i].x, focos[i].y, lim);
            ctx.save();
            ctx.lineWidth = 3;
            ctx.strokeStyle = colores[i];
            ctx.beginPath();
            ctx.moveTo(pf.x, pf.y);
            ctx.lineTo(pp.x, pp.y);
            ctx.stroke();

            // Rótulo en el punto medio del segmento
            var mx = (pf.x + pp.x) / 2;
            var my = (pf.y + pp.y) / 2;
            ctx.font = 'bold 13px sans-serif';
            var w = ctx.measureText(etiquetas[i]).width;
            ctx.fillStyle = colores[i];
            ctx.fillRect(mx - w / 2 - 4, my - 10, w + 8, 18);
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(etiquetas[i], mx, my - 1);
            ctx.restore();
        }

        this.dibujarPunto(P.x, P.y, 'P', '#111827', lim, { dx: 10, dy: -12 });
    };

    /**
     * Convierte un evento de puntero a coordenadas cartesianas usando la última escala dibujada.
     * @returns {{x: number, y: number}|null}
     */
    Graficador.prototype.pixelACartesiano = function (evento) {
        if (!this.ultimoLim) return null;
        var rect = this.canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return null;
        var lim = this.ultimoLim;
        var px = (evento.clientX - rect.left) / rect.width;
        var py = (evento.clientY - rect.top) / rect.height;
        return {
            x: lim.minX + px * (lim.maxX - lim.minX),
            y: lim.maxY - py * (lim.maxY - lim.minY)
        };
    };

    /**
     * Dibuja varias elipses concéntricas superpuestas con colores distintos para comparar excentricidades.
     */
    Graficador.prototype.dibujarComparacion = function (listaElipses, colores, toggles) {
        this.ajustarDPI();
        var lim = { minX: -6, maxX: 6, minY: -6, maxY: 6 };
        this.dibujarEjesYCuadricula(lim);

        var ctx = this.ctx;
        colores = colores || ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];
        var config = Object.assign({}, this.config, toggles || {});

        listaElipses.forEach(function (elipse, idx) {
            if (!elipse || !elipse.ok) return;
            var col = colores[idx % colores.length];

            ctx.save();
            ctx.lineWidth = 3;
            ctx.strokeStyle = col;
            ctx.beginPath();
            var nPuntos = 240;
            for (var i = 0; i <= nPuntos; i++) {
                var t = (i * 2 * Math.PI) / nPuntos;
                var ex = elipse.a * Math.cos(t);
                var ey = elipse.b * Math.sin(t);
                var pix = this.aPixel(ex, ey, lim);
                if (i === 0) ctx.moveTo(pix.x, pix.y);
                else ctx.lineTo(pix.x, pix.y);
            }
            ctx.closePath();
            ctx.stroke();

            // Dibujar focos de cada elipse en su color
            if (config.mostrarFocos && !elipse.esCircunferencia && elipse.focos) {
                var f1 = this.aPixel(elipse.focos[0].x, elipse.focos[0].y, lim);
                var f2 = this.aPixel(elipse.focos[1].x, elipse.focos[1].y, lim);
                ctx.fillStyle = col;
                ctx.beginPath(); ctx.arc(f1.x, f1.y, 4, 0, 2 * Math.PI); ctx.fill();
                ctx.beginPath(); ctx.arc(f2.x, f2.y, 4, 0, 2 * Math.PI); ctx.fill();
            }
            ctx.restore();
        }.bind(this));

        // Dibujar Vértices comunes fijos en (+-4, 0)
        if (config.mostrarVertices) {
            this.dibujarPunto(4, 0, 'A(4,0)', '#a855f7', lim, { dx: 8, dy: -8 });
            this.dibujarPunto(-4, 0, "A'(-4,0)", '#a855f7', lim, { dx: -48, dy: -8 });
        }

        // Dibujar Centro común en (0, 0)
        if (config.mostrarCentro) {
            this.dibujarPunto(0, 0, 'C(0,0)', '#f59e0b', lim, { dx: 8, dy: 14 });
        }

        // Cartela de Leyenda interactiva en la esquina superior del canvas
        ctx.save();
        var legW = 185;
        var legH = 104;
        var legX = this.ancho - legW - 14;
        var legY = 14;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(legX, legY, legW, legH, 8);
        } else {
            ctx.rect(legX, legY, legW, legH);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.fillText('Experimento: a² = 16 fijo', legX + 10, legY + 18);

        var textosLeyenda = [
            { txt: 'b²=12 → e=0.50 (Ovalada)', col: colores[0] },
            { txt: 'b²=9  → e=0.66 (Achatada)', col: colores[1] },
            { txt: 'b²=6  → e=0.79 (Alargada)', col: colores[2] },
            { txt: 'b²=2  → e=0.94 (Casi plana)', col: colores[3] }
        ];

        ctx.font = '10.5px system-ui, sans-serif';
        textosLeyenda.forEach(function (item, i) {
            ctx.fillStyle = item.col;
            ctx.beginPath();
            ctx.arc(legX + 16, legY + 36 + i * 16, 4.5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillText(item.txt, legX + 26, legY + 40 + i * 16);
        });
        ctx.restore();

        this.ultimoLim = lim;
    };

    return Graficador;
}));
