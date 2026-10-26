/**
 * Laboratorio de la Elipse - Feria STEAM+
 * Módulo de Renderizado Gráfico en HTML5 Canvas
 * Dibuja plano cartesiano interactivo, cuadrícula, ejes numerados, elipses,
 * focos, vértices, extremos, lados rectos y ejes focales.
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
            rangoFijo: this.opciones.rangoFijo || 12, // de -12 a 12
            mostrarCentro: true,
            mostrarFocos: true,
            mostrarVertices: true,
            mostrarExtremosMenor: true,
            mostrarEjeFocal: true,
            mostrarLadoRecto: true,
            colorElipse: '#2563eb',
            colorFocos: '#ef4444',
            colorVertices: '#8b5cf6',
            colorExtremos: '#10b981',
            colorCentro: '#f59e0b',
            colorEjeFocal: 'rgba(239, 68, 68, 0.5)',
            colorLadoRecto: '#06b6d4'
        };

        // Ajustar resolución HiDPI
        this.ajustarDPI();
    }

    Graficador.prototype.ajustarDPI = function () {
        var dpr = window.devicePixelRatio || 1;
        var ancho = this.canvas.clientWidth || this.canvas.width || 500;
        var alto = this.canvas.clientHeight || this.canvas.height || 500;

        this.canvas.width = ancho * dpr;
        this.canvas.height = alto * dpr;
        this.ctx.scale(dpr, dpr);
        this.anchoCSS = ancho;
        this.altoCSS = alto;
    };

    /**
     * Calcula los límites del plano cartesiano (autoescala o fijo).
     */
    Graficador.prototype.calcularLimites = function (elipse) {
        if (this.config.fijaEscala || !elipse || !elipse.ok) {
            var rf = this.config.rangoFijo;
            return { minX: -rf, maxX: rf, minY: -rf, maxY: rf };
        }

        // Autoescala que incluye el origen (0,0), el centro, los vértices y extremos con margen
        var puntosX = [0, elipse.centro.x];
        var puntosY = [0, elipse.centro.y];

        elipse.vertices.forEach(function (v) { puntosX.push(v.x); puntosY.push(v.y); });
        elipse.extremosMenor.forEach(function (b) { puntosX.push(b.x); puntosY.push(b.y); });
        elipse.focos.forEach(function (f) { puntosX.push(f.x); puntosY.push(f.y); });

        var minX = Math.min.apply(null, puntosX);
        var maxX = Math.max.apply(null, puntosX);
        var minY = Math.min.apply(null, puntosY);
        var maxY = Math.max.apply(null, puntosY);

        // Añadir margen del 25% y mínimo de 4 unidades
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

        // Hacerlo simétrico y cuadrado para no deformar la elipse
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

        // Fondo
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, ancho, alto);

        // Calcular paso adecuado de la cuadrícula (1, 2 o 5 según el rango)
        var rango = lim.maxX - lim.minX;
        var paso = 1;
        if (rango > 30) paso = 5;
        else if (rango > 16) paso = 2;

        // Cuadrícula secundaria
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

        // Flechas en los ejes
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
            // Pequeña marca
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
            // Pequeña marca
            ctx.beginPath();
            ctx.moveTo(origen.x - 3, posMarcaY.y);
            ctx.lineTo(origen.x + 3, posMarcaY.y);
            ctx.stroke();
            ctx.fillText(String(ny), origen.x - 6, posMarcaY.y);
        }

        // Rotular nombres de los ejes
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#1e293b';
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

        // Punto exterior
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        // Etiqueta con fondo semitransparente para legibilidad
        var texto = etiqueta;
        ctx.font = 'bold 12px sans-serif';
        var anchoTexto = ctx.measureText(texto).width;

        var tx = p.x + desplazamiento.dx;
        var ty = p.y + desplazamiento.dy;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
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

        // Relleno suave con transparencia
        ctx.fillStyle = 'rgba(37, 99, 235, 0.06)';
        ctx.fill();
        ctx.restore();

        // 4. Extremos del eje menor B' y B
        if (config.mostrarExtremosMenor && !elipse.esCircunferencia) {
            this.dibujarPunto(elipse.extremosMenor[0].x, elipse.extremosMenor[0].y, "B'", config.colorExtremos, lim, { dx: -24, dy: -8 });
            this.dibujarPunto(elipse.extremosMenor[1].x, elipse.extremosMenor[1].y, 'B', config.colorExtremos, lim, { dx: 10, dy: -8 });
        }

        // 5. Vértices del eje mayor A' y A
        if (config.mostrarVertices) {
            this.dibujarPunto(elipse.vertices[0].x, elipse.vertices[0].y, "A'", config.colorVertices, lim, { dx: -24, dy: 10 });
            this.dibujarPunto(elipse.vertices[1].x, elipse.vertices[1].y, 'A', config.colorVertices, lim, { dx: 10, dy: 10 });
        }

        // 6. Focos F' y F (si no es circunferencia)
        if (config.mostrarFocos && !elipse.esCircunferencia) {
            this.dibujarPunto(elipse.focos[0].x, elipse.focos[0].y, "F'", config.colorFocos, lim, { dx: -24, dy: -12 });
            this.dibujarPunto(elipse.focos[1].x, elipse.focos[1].y, 'F', config.colorFocos, lim, { dx: 10, dy: -12 });
        }

        // 7. Centro C
        if (config.mostrarCentro) {
            this.dibujarPunto(elipse.centro.x, elipse.centro.y, 'C', config.colorCentro, lim, { dx: 10, dy: 10 });
        }
    };

    /**
     * Dibuja varias elipses concéntricas superpuestas con colores distintos para comparar excentricidades.
     */
    Graficador.prototype.dibujarComparacion = function (listaElipses, colores) {
        this.ajustarDPI();
        var lim = { minX: -6, maxX: 6, minY: -6, maxY: 6 };
        this.dibujarEjesYCuadricula(lim);

        var ctx = this.ctx;
        colores = colores || ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

        listaElipses.forEach(function (elipse, idx) {
            if (!elipse || !elipse.ok) return;
            var col = colores[idx % colores.length];

            ctx.save();
            ctx.lineWidth = 3;
            ctx.strokeStyle = col;
            ctx.beginPath();
            var nPuntos = 200;
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
            if (!elipse.esCircunferencia) {
                var f1 = this.aPixel(elipse.focos[0].x, elipse.focos[0].y, lim);
                var f2 = this.aPixel(elipse.focos[1].x, elipse.focos[1].y, lim);
                ctx.fillStyle = col;
                ctx.beginPath(); ctx.arc(f1.x, f1.y, 4, 0, 2 * Math.PI); ctx.fill();
                ctx.beginPath(); ctx.arc(f2.x, f2.y, 4, 0, 2 * Math.PI); ctx.fill();
            }
            ctx.restore();
        }.bind(this));
    };

    return Graficador;
}));
