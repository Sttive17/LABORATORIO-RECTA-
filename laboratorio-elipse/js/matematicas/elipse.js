/**
 * Laboratorio de la Elipse - Feria STEAM+
 * Lógica matemática pura para la Elipse (Ecuación Canónica con centro en (h, k))
 * Fuente: Libro de Matemáticas 10, pp. 195-196
 * Funciones puras (sin DOM), compatibles con Navegador y Node.js.
 */

(function (raiz, fabrica) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        const Formato = require('./formato');
        module.exports = fabrica(Formato);
    } else {
        raiz.Elipse = fabrica(raiz.Formato);
    }
}(typeof self !== 'undefined' ? self : this, function (Formato) {
    'use strict';

    const EPSILON = 1e-6;

    /**
     * Valida que un número sea finito y real.
     */
    function esNumeroValido(v) {
        return typeof v === 'number' && !Number.isNaN(v) && Number.isFinite(v);
    }

    /**
     * Construye y calcula todos los elementos geométricos y analíticos de una elipse.
     * @param {Object} params
     * @param {number} params.h Coordenada x del centro
     * @param {number} params.k Coordenada y del centro
     * @param {number} params.a Longitud del semieje mayor (a > 0)
     * @param {number} params.b Longitud del semieje menor (b > 0, b <= a)
     * @param {'horizontal'|'vertical'} params.orientacion Eje focal paralelo al eje X o al eje Y
     * @returns {Object} { ok: boolean, ...datos } o { ok: false, error: string }
     */
    function crearElipse(params) {
        if (!params || typeof params !== 'object') {
            return { ok: false, error: '¡Hola! Faltan los datos para construir la elipse.' };
        }

        const h = params.h;
        const k = params.k;
        const a = params.a;
        const b = params.b;
        const orientacion = params.orientacion;

        if (!esNumeroValido(h) || !esNumeroValido(k)) {
            return { ok: false, error: 'Las coordenadas del centro (h, k) deben ser números válidos.' };
        }
        if (!esNumeroValido(a) || a <= 0) {
            return { ok: false, error: 'El semieje mayor "a" debe ser un número positivo mayor que cero.' };
        }
        if (!esNumeroValido(b) || b <= 0) {
            return { ok: false, error: 'El semieje menor "b" debe ser un número positivo mayor que cero.' };
        }

        if (b > a + EPSILON) {
            return {
                ok: false,
                error: '¡Atención! "b" (' + b + ') no puede ser mayor que "a" (' + a + '). El semieje mayor siempre es "a".'
            };
        }

        if (orientacion !== 'horizontal' && orientacion !== 'vertical') {
            return {
                ok: false,
                error: 'La orientación debe ser "horizontal" o "vertical".'
            };
        }

        const esCircunferencia = Math.abs(a - b) < EPSILON;
        const a2 = Math.abs(a * a - Math.round(a * a)) < 1e-9 ? Math.round(a * a) : (a * a);
        const b2 = Math.abs(b * b - Math.round(b * b)) < 1e-9 ? Math.round(b * b) : (b * b);
        let c2 = Math.max(0, a2 - b2);
        c2 = Math.abs(c2 - Math.round(c2)) < 1e-9 ? Math.round(c2) : c2;
        const c = Math.sqrt(c2);

        const ejeMayor = 2 * a;
        const ejeMenor = 2 * b;
        const ladoRecto = (2 * b2) / a;
        const excentricidad = esCircunferencia ? 0 : (c / a);

        let denX, denY;
        let F1, F2, A1, A2, B1, B2;
        let ejeFocal;

        if (orientacion === 'horizontal') {
            denX = a2;
            denY = b2;
            // Eje focal paralelo a X: y = k
            ejeFocal = { tipo: 'horizontal', ecuacion: 'y = ' + (Formato ? Formato.formatearExacto(k, false) : k), valor: k };
            // Focos F'(h - c, k) y F(h + c, k)
            F1 = { x: h - c, y: k, etiqueta: "F'" };
            F2 = { x: h + c, y: k, etiqueta: 'F' };
            // Vértices A'(h - a, k) y A(h + a, k)
            A1 = { x: h - a, y: k, etiqueta: "A'" };
            A2 = { x: h + a, y: k, etiqueta: 'A' };
            // Extremos eje menor B'(h, k - b) y B(h, k + b)
            B1 = { x: h, y: k - b, etiqueta: "B'" };
            B2 = { x: h, y: k + b, etiqueta: 'B' };
        } else {
            denX = b2;
            denY = a2;
            // Eje focal paralelo a Y: x = h
            ejeFocal = { tipo: 'vertical', ecuacion: 'x = ' + (Formato ? Formato.formatearExacto(h, false) : h), valor: h };
            // Focos F'(h, k - c) y F(h, k + c)
            F1 = { x: h, y: k - c, etiqueta: "F'" };
            F2 = { x: h, y: k + c, etiqueta: 'F' };
            // Vértices A'(h, k - a) y A(h, k + a)
            A1 = { x: h, y: k - a, etiqueta: "A'" };
            A2 = { x: h, y: k + a, etiqueta: 'A' };
            // Extremos eje menor B'(h - b, k) y B(h + b, k)
            B1 = { x: h - b, y: k, etiqueta: "B'" };
            B2 = { x: h + b, y: k, etiqueta: 'B' };
        }

        const ecuacionTexto = Formato ? Formato.formatearEcuacion(h, k, denX, denY) :
            '((x - ' + h + ')^2)/' + denX + ' + ((y - ' + k + ')^2)/' + denY + ' = 1';

        // Lados rectos: segmentos que pasan perpendicularmente por cada foco con longitud ladoRecto
        const mitadLR = ladoRecto / 2;
        let lrFoco1, lrFoco2;
        if (orientacion === 'horizontal') {
            lrFoco1 = [{ x: F1.x, y: F1.y - mitadLR }, { x: F1.x, y: F1.y + mitadLR }];
            lrFoco2 = [{ x: F2.x, y: F2.y - mitadLR }, { x: F2.x, y: F2.y + mitadLR }];
        } else {
            lrFoco1 = [{ x: F1.x - mitadLR, y: F1.y }, { x: F1.x + mitadLR, y: F1.y }];
            lrFoco2 = [{ x: F2.x - mitadLR, y: F2.y }, { x: F2.x + mitadLR, y: F2.y }];
        }

        return {
            ok: true,
            centro: { x: h, y: k, etiqueta: 'C' },
            a: a,
            b: b,
            c: c,
            a2: a2,
            b2: b2,
            c2: c2,
            denX: denX,
            denY: denY,
            orientacion: orientacion,
            esCircunferencia: esCircunferencia,
            radio: esCircunferencia ? a : null,
            excentricidad: excentricidad,
            ejeMayor: ejeMayor,
            ejeMenor: ejeMenor,
            ladoRecto: ladoRecto,
            vertices: [A1, A2],
            extremosMenor: [B1, B2],
            focos: [F1, F2],
            ejeFocal: ejeFocal,
            ladosRectosSegmentos: [lrFoco1, lrFoco2],
            ecuacion: ecuacionTexto
        };
    }

    /**
     * Analiza una ecuación canónica a partir de sus denominadores denX y denY.
     * Identifica automáticamente la orientación y los semiejes a y b.
     * @param {Object} params { h, k, denX, denY }
     */
    function analizarEcuacion(params) {
        if (!params || typeof params !== 'object') {
            return { ok: false, error: 'Por favor proporciona los datos de la ecuación.' };
        }

        const h = params.h;
        const k = params.k;
        const denX = params.denX;
        const denY = params.denY;

        if (!esNumeroValido(h) || !esNumeroValido(k)) {
            return { ok: false, error: 'Las coordenadas del centro (h, k) deben ser números válidos.' };
        }
        if (!esNumeroValido(denX) || denX <= 0) {
            return { ok: false, error: 'El denominador debajo de (x−h)² debe ser mayor que cero 🙂' };
        }
        if (!esNumeroValido(denY) || denY <= 0) {
            return { ok: false, error: 'El denominador debajo de (y−k)² debe ser mayor que cero 🙂' };
        }

        let a, b, orientacion;
        if (Math.abs(denX - denY) < EPSILON) {
            a = Math.sqrt(denX);
            b = a;
            orientacion = 'horizontal';
        } else if (denX > denY) {
            a = Math.sqrt(denX);
            b = Math.sqrt(denY);
            orientacion = 'horizontal';
        } else {
            a = Math.sqrt(denY);
            b = Math.sqrt(denX);
            orientacion = 'vertical';
        }

        const resultado = crearElipse({
            h: h,
            k: k,
            a: a,
            b: b,
            orientacion: orientacion
        });

        if (resultado.ok && Math.abs(denX - denY) < EPSILON) {
            resultado.mensajeEspecial = '¡Es una circunferencia de radio ' + (Formato ? Formato.formatearExacto(a, false) : a) + '! Es el caso especial donde c = 0 y a = b.';
        }

        return resultado;
    }

    /**
     * Convierte una ecuación en forma general A·x² + B·y² = C (con centro en el origen) a canónica.
     * @param {Object} params { A, B, C }
     */
    function desdeFormaGeneral(params) {
        if (!params || typeof params !== 'object') {
            return { ok: false, error: 'Por favor ingresa los coeficientes A, B y C.' };
        }
        const A = params.A;
        const B = params.B;
        const C = params.C;

        if (!esNumeroValido(A) || A <= 0) {
            return { ok: false, error: 'El coeficiente A de x² debe ser un número positivo.' };
        }
        if (!esNumeroValido(B) || B <= 0) {
            return { ok: false, error: 'El coeficiente B de y² debe ser un número positivo.' };
        }
        if (!esNumeroValido(C) || C <= 0) {
            return { ok: false, error: 'El término independiente C debe ser un número positivo.' };
        }

        const denX = C / A;
        const denY = C / B;

        return analizarEcuacion({
            h: 0,
            k: 0,
            denX: denX,
            denY: denY
        });
    }

    /**
     * Construye una elipse a partir del centro, la longitud de los ejes y la orientación.
     */
    function desdeEjes(params) {
        if (!params || typeof params !== 'object') {
            return { ok: false, error: 'Faltan los datos de la elipse.' };
        }
        const h = params.h;
        const k = params.k;
        const ejeMayor = params.ejeMayor !== undefined ? params.ejeMayor : params.longitudEjeMayor;
        const ejeMenor = params.ejeMenor !== undefined ? params.ejeMenor : params.longitudEjeMenor;
        const orientacion = params.orientacion;

        if (!esNumeroValido(ejeMayor) || ejeMayor <= 0) {
            return { ok: false, error: 'La longitud del eje mayor (2a) debe ser un número positivo.' };
        }
        if (!esNumeroValido(ejeMenor) || ejeMenor <= 0) {
            return { ok: false, error: 'La longitud del eje menor (2b) debe ser un número positivo.' };
        }
        if (ejeMenor > ejeMayor) {
            return { ok: false, error: 'La longitud del eje menor no puede ser mayor que la del eje mayor.' };
        }

        const a = ejeMayor / 2;
        const b = ejeMenor / 2;

        const elipse = crearElipse({
            h: h,
            k: k,
            a: a,
            b: b,
            orientacion: orientacion
        });

        if (elipse.ok) {
            elipse.pasos = [
                '1. Semieje mayor a = (Eje Mayor) / 2 = ' + ejeMayor + ' / 2 = ' + (Formato ? Formato.formatearExacto(a) : a),
                '2. Semieje menor b = (Eje Menor) / 2 = ' + ejeMenor + ' / 2 = ' + (Formato ? Formato.formatearExacto(b) : b),
                '3. Distancia focal c = √(a² − b²) = √(' + (a * a) + ' − ' + (b * b) + ') = ' + (Formato ? Formato.formatearExacto(elipse.c) : elipse.c),
                '4. Ecuación canónica con centro en (' + h + ', ' + k + '): ' + elipse.ecuacion
            ];
        }
        return elipse;
    }

    /**
     * Construye una elipse a partir de los dos vértices del eje mayor y la longitud del lado recto.
     */
    function desdeVerticesYLadoRecto(params) {
        if (!params || typeof params !== 'object') {
            return { ok: false, error: 'Faltan los datos de vértices y lado recto.' };
        }
        const v1 = params.v1;
        const v2 = params.v2;
        const ladoRecto = params.ladoRecto;

        if (!v1 || !v2 || !esNumeroValido(v1.x) || !esNumeroValido(v1.y) || !esNumeroValido(v2.x) || !esNumeroValido(v2.y)) {
            return { ok: false, error: 'Las coordenadas de los dos vértices deben ser números válidos.' };
        }
        if (!esNumeroValido(ladoRecto) || ladoRecto <= 0) {
            return { ok: false, error: 'La longitud del lado recto debe ser mayor que cero.' };
        }

        const distPuntos = Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2));
        if (distPuntos < EPSILON) {
            return { ok: false, error: 'Los dos vértices no pueden ser el mismo punto.' };
        }

        let orientacion;
        if (Math.abs(v1.y - v2.y) < EPSILON) {
            orientacion = 'horizontal';
        } else if (Math.abs(v1.x - v2.x) < EPSILON) {
            orientacion = 'vertical';
        } else {
            return {
                ok: false,
                error: 'Los dos vértices del eje mayor deben estar alineados horizontalmente (misma Y) o verticalmente (misma X).'
            };
        }

        const centro = {
            x: (v1.x + v2.x) / 2,
            y: (v1.y + v2.y) / 2
        };

        const a = distPuntos / 2;
        if (ladoRecto > 2 * a + EPSILON) {
            return {
                ok: false,
                error: 'El lado recto LR (' + ladoRecto + ') no puede ser mayor que 2a (' + (2 * a) + ').'
            };
        }

        // LR = 2b^2 / a  =>  b^2 = (LR * a) / 2
        const b2 = (ladoRecto * a) / 2;
        const b = Math.sqrt(b2);

        const elipse = crearElipse({
            h: centro.x,
            k: centro.y,
            a: a,
            b: b,
            orientacion: orientacion
        });

        if (elipse.ok) {
            elipse.pasos = [
                '1. Centro = punto medio entre vértices: C = ((' + v1.x + '+' + v2.x + ')/2, (' + v1.y + '+' + v2.y + ')/2) = (' + centro.x + ', ' + centro.y + ')',
                '2. Longitud eje mayor 2a = distancia entre vértices = ' + distPuntos + '  ⟹  a = ' + a + ', a² = ' + (a * a),
                '3. Como LR = 2b²/a  ⟹  b² = (LR · a) / 2 = (' + ladoRecto + ' · ' + a + ') / 2 = ' + b2 + '  ⟹  b = ' + (Formato ? Formato.formatearExacto(b) : b),
                '4. c = √(a² − b²) = √(' + (a * a) + ' − ' + b2 + ') = ' + (Formato ? Formato.formatearExacto(elipse.c) : elipse.c),
                '5. Ecuación canónica (' + orientacion + '): ' + elipse.ecuacion
            ];
        }
        return elipse;
    }

    /**
     * Construye una elipse a partir de los dos vértices del eje mayor y un extremo del eje menor.
     */
    function desdeVerticesYExtremoMenor(params) {
        if (!params || typeof params !== 'object') {
            return { ok: false, error: 'Faltan los datos de los vértices y el extremo menor.' };
        }
        const v1 = params.v1;
        const v2 = params.v2;
        const B = params.extremoMenor;

        if (!v1 || !v2 || !B ||
            !esNumeroValido(v1.x) || !esNumeroValido(v1.y) ||
            !esNumeroValido(v2.x) || !esNumeroValido(v2.y) ||
            !esNumeroValido(B.x) || !esNumeroValido(B.y)) {
            return { ok: false, error: 'Todas las coordenadas deben ser números válidos.' };
        }

        const distVertices = Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2));
        if (distVertices < EPSILON) {
            return { ok: false, error: 'Los dos vértices del eje mayor no pueden coincidir.' };
        }

        let orientacion;
        const centro = {
            x: (v1.x + v2.x) / 2,
            y: (v1.y + v2.y) / 2
        };
        const a = distVertices / 2;
        let b;

        if (Math.abs(v1.y - v2.y) < EPSILON) {
            // Eje mayor horizontal: la perpendicular por el centro es x = centro.x
            orientacion = 'horizontal';
            if (Math.abs(B.x - centro.x) > EPSILON) {
                return {
                    ok: false,
                    error: 'El extremo del eje menor debe estar sobre la perpendicular que pasa por el centro (x = ' + centro.x + ').'
                };
            }
            b = Math.abs(B.y - centro.y);
        } else if (Math.abs(v1.x - v2.x) < EPSILON) {
            // Eje mayor vertical: la perpendicular por el centro es y = centro.y
            orientacion = 'vertical';
            if (Math.abs(B.y - centro.y) > EPSILON) {
                return {
                    ok: false,
                    error: 'El extremo del eje menor debe estar sobre la perpendicular que pasa por el centro (y = ' + centro.y + ').'
                };
            }
            b = Math.abs(B.x - centro.x);
        } else {
            return {
                ok: false,
                error: 'Los dos vértices del eje mayor deben estar alineados horizontal o verticalmente.'
            };
        }

        if (b < EPSILON) {
            return { ok: false, error: 'El extremo del eje menor no puede estar en el mismo centro.' };
        }
        if (b > a + EPSILON) {
            return {
                ok: false,
                error: 'La distancia del centro al extremo menor b (' + b + ') no puede ser mayor que a (' + a + ').'
            };
        }

        const elipse = crearElipse({
            h: centro.x,
            k: centro.y,
            a: a,
            b: b,
            orientacion: orientacion
        });

        if (elipse.ok) {
            elipse.pasos = [
                '1. Centro = punto medio entre vértices A y A\': C = (' + centro.x + ', ' + centro.y + ')',
                '2. Semieje mayor a = distancia(C, A) = ' + a + ', a² = ' + (a * a),
                '3. Semieje menor b = distancia(C, B) = ' + b + ', b² = ' + (b * b),
                '4. Distancia focal c = √(a² − b²) = √(' + (a * a) + ' − ' + (b * b) + ') = ' + (Formato ? Formato.formatearExacto(elipse.c) : elipse.c),
                '5. Ecuación canónica: ' + elipse.ecuacion
            ];
        }
        return elipse;
    }

    /**
     * Genera una lista de puntos (x, y) que describen la curva suave de la elipse.
     * @param {Object} elipse
     * @param {number} [n=200]
     * @returns {Array<{x: number, y: number}>}
     */
    function puntosParaDibujar(elipse, n) {
        if (!elipse || !elipse.ok) return [];
        n = n || 200;
        const puntos = [];
        const h = elipse.centro.x;
        const k = elipse.centro.y;
        const a = elipse.a;
        const b = elipse.b;
        const esHorizontal = elipse.orientacion === 'horizontal';

        const paso = (2 * Math.PI) / n;
        for (let i = 0; i <= n; i++) {
            const t = i * paso;
            let x, y;
            if (esHorizontal) {
                x = h + a * Math.cos(t);
                y = k + b * Math.sin(t);
            } else {
                x = h + b * Math.cos(t);
                y = k + a * Math.sin(t);
            }
            puntos.push({ x: x, y: y });
        }
        return puntos;
    }

    /**
     * Punto P(x, y) sobre la elipse para un ángulo paramétrico t (en grados).
     * Horizontal: x = h + a·cos t, y = k + b·sen t. Vertical: x = h + b·cos t, y = k + a·sen t.
     * @param {Object} elipse
     * @param {number} grados
     * @returns {{x: number, y: number}|null}
     */
    function puntoEnElipse(elipse, grados) {
        if (!elipse || !elipse.ok || !esNumeroValido(grados)) return null;
        const t = (grados * Math.PI) / 180;
        const esHorizontal = elipse.orientacion === 'horizontal';
        return {
            x: elipse.centro.x + (esHorizontal ? elipse.a : elipse.b) * Math.cos(t),
            y: elipse.centro.y + (esHorizontal ? elipse.b : elipse.a) * Math.sin(t)
        };
    }

    /**
     * Definición geométrica de la elipse: d(P, F') + d(P, F) = 2a.
     * Calcula las dos distancias focales de un punto P y su suma.
     * @param {Object} elipse
     * @param {{x: number, y: number}} punto
     * @returns {{ok: boolean, d1?: number, d2?: number, suma?: number, dosA?: number, error?: string}}
     */
    function distanciasFocales(elipse, punto) {
        if (!elipse || !elipse.ok) return { ok: false, error: 'Elipse no válida.' };
        if (!punto || !esNumeroValido(punto.x) || !esNumeroValido(punto.y)) {
            return { ok: false, error: 'El punto P debe tener coordenadas numéricas.' };
        }
        const F1 = elipse.focos[0];
        const F2 = elipse.focos[1];
        const d1 = Math.sqrt(Math.pow(punto.x - F1.x, 2) + Math.pow(punto.y - F1.y, 2));
        const d2 = Math.sqrt(Math.pow(punto.x - F2.x, 2) + Math.pow(punto.y - F2.y, 2));
        return { ok: true, d1: d1, d2: d2, suma: d1 + d2, dosA: 2 * elipse.a };
    }

    /**
     * Compara excentricidades fijando a² y variando b².
     * @param {number} a2
     * @param {number[]} listaB2
     */
    function compararExcentricidad(a2, listaB2) {
        if (!esNumeroValido(a2) || a2 <= 0 || !Array.isArray(listaB2)) {
            return { ok: false, error: 'Datos de comparación no válidos.' };
        }
        const a = Math.sqrt(a2);
        const resultados = [];

        for (let i = 0; i < listaB2.length; i++) {
            const b2 = listaB2[i];
            if (!esNumeroValido(b2) || b2 <= 0 || b2 > a2) continue;
            const b = Math.sqrt(b2);
            const c = Math.sqrt(a2 - b2);
            const e = c / a;
            let interpretacion = '';
            if (e < 0.3) {
                interpretacion = 'Casi redonda';
            } else if (e <= 0.7) {
                interpretacion = 'Ovalada';
            } else {
                interpretacion = 'Muy achatada';
            }
            resultados.push({
                a2: a2,
                b2: b2,
                a: a,
                b: b,
                c: c,
                e: e,
                achatamiento: interpretacion
            });
        }

        return { ok: true, a2: a2, a: a, comparaciones: resultados };
    }

    return {
        crearElipse: crearElipse,
        analizarEcuacion: analizarEcuacion,
        desdeFormaGeneral: desdeFormaGeneral,
        desdeEjes: desdeEjes,
        construirDesdeEjes: desdeEjes,
        desdeVerticesYLadoRecto: desdeVerticesYLadoRecto,
        construirDesdeVerticesYLadoRecto: desdeVerticesYLadoRecto,
        desdeVerticesYExtremoMenor: desdeVerticesYExtremoMenor,
        construirDesdeVerticesYExtremoMenor: desdeVerticesYExtremoMenor,
        puntosParaDibujar: puntosParaDibujar,
        puntoEnElipse: puntoEnElipse,
        distanciasFocales: distanciasFocales,
        compararExcentricidad: compararExcentricidad
    };
}));
