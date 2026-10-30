/**
 * Laboratorio de la Elipse - Feria STEAM+
 * Módulo de validación y formateo numérico / algebraico
 * Funciones puras (no tocan el DOM) compatibles con Navegador y Node.js.
 */

(function (raiz, fabrica) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = fabrica();
    } else {
        raiz.Formato = fabrica();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    /**
     * Interpreta una cadena de texto como número.
     * Acepta enteros, decimales (con punto o coma) y fracciones simples como "3/2" o "-1/2".
     * Rechaza campos vacíos, cadenas no numéricas, división por cero, NaN e Infinity.
     * @param {string|number} entrada
     * @returns {{ok: boolean, valor?: number, error?: string}}
     */
    function leerNumero(entrada) {
        if (entrada === null || entrada === undefined) {
            return { ok: false, error: 'Por favor ingresa un número.' };
        }

        if (typeof entrada === 'number') {
            if (Number.isNaN(entrada) || !Number.isFinite(entrada)) {
                return { ok: false, error: 'El valor no es un número válido.' };
            }
            return { ok: true, valor: entrada };
        }

        let texto = String(entrada).trim();
        if (texto.length === 0) {
            return { ok: false, error: 'Este campo no puede estar vacío.' };
        }

        // Reemplazar coma decimal por punto
        texto = texto.replace(',', '.');

        // Verificar si es una fracción simple de la forma "a/b" o "-a/b"
        if (texto.indexOf('/') !== -1) {
            const partes = texto.split('/');
            if (partes.length !== 2) {
                return { ok: false, error: 'La fracción debe tener solo un numerador y un denominador (ej: 3/2).' };
            }

            const numTexto = partes[0].trim();
            const denTexto = partes[1].trim();

            if (numTexto.length === 0 || denTexto.length === 0) {
                return { ok: false, error: 'La fracción está incompleta. Escribe por ejemplo 3/2.' };
            }

            const num = Number(numTexto);
            const den = Number(denTexto);

            if (Number.isNaN(num) || Number.isNaN(den)) {
                return { ok: false, error: 'Los valores de la fracción deben ser números válidos.' };
            }
            if (den === 0) {
                return { ok: false, error: '¡Cuidado! No se puede dividir entre cero.' };
            }

            const resultadoFrac = num / den;
            if (!Number.isFinite(resultadoFrac)) {
                return { ok: false, error: 'El resultado de la fracción no es un número válido.' };
            }

            return { ok: true, valor: resultadoFrac };
        }

        // Número decimal o entero normal
        const valor = Number(texto);
        if (Number.isNaN(valor)) {
            return { ok: false, error: '¡Ups! "' + entrada + '" no es un número válido. Escribe algo como 4, 2.5 o 3/2 🙂' };
        }
        if (!Number.isFinite(valor)) {
            return { ok: false, error: 'El número ingresado es demasiado grande.' };
        }

        return { ok: true, valor: valor };
    }

    /**
     * Máximo común divisor entre dos enteros.
     */
    function mcd(a, b) {
        let x = Math.abs(Math.round(a));
        let y = Math.abs(Math.round(b));
        while (y) {
            const temp = y;
            y = x % y;
            x = temp;
        }
        return x;
    }

    /**
     * Simplifica una raíz cuadrada entera √N extrayendo factores cuadrados perfectos.
     * Ejemplo: simplificarRaiz(20) -> "2√5", simplificarRaiz(4) -> "2", simplificarRaiz(5) -> "√5"
     * @param {number} radicando Entero no negativo
     * @returns {string}
     */
    function simplificarRaiz(radicando) {
        const n = Math.round(radicando);
        if (n < 0) return 'indefinido';
        if (n === 0) return '0';
        if (n === 1) return '1';

        let factorFuera = 1;
        let residuo = n;

        const raizExacta = Math.round(Math.sqrt(n));
        if (raizExacta * raizExacta === n) {
            return String(raizExacta);
        }

        for (let i = 2; i * i <= residuo; i++) {
            while (residuo % (i * i) === 0) {
                factorFuera *= i;
                residuo /= (i * i);
            }
        }

        if (residuo === 1) {
            return String(factorFuera);
        }
        if (factorFuera === 1) {
            return '√' + residuo;
        }
        return factorFuera + '√' + residuo;
    }

    /**
     * Convierte un número decimal a fracción simple reducida si existe una con denominador <= 120.
     * @param {number} valor
     * @returns {{numerador: number, denominador: number}|null}
     */
    function aFraccion(valor) {
        const signo = valor < 0 ? -1 : 1;
        const v = Math.abs(valor);

        // Si ya es casi entero
        if (Math.abs(v - Math.round(v)) < 1e-7) {
            return { numerador: signo * Math.round(v), denominador: 1 };
        }

        for (let q = 2; q <= 120; q++) {
            const p = Math.round(v * q);
            if (Math.abs(v - p / q) < 1e-6) {
                const d = mcd(p, q);
                return {
                    numerador: signo * (p / d),
                    denominador: q / d
                };
            }
        }
        return null;
    }

    /**
     * Formatea un valor numérico para presentación exacta y amigable.
     * Si es entero: "4"
     * Si es fracción simple: "10/3 (≈ 3.3333)"
     * Si es raíz de un entero: "2√5 (≈ 4.4721)"
     * En otro caso decimal: "3.1416"
     * @param {number|object} valor
     * @param {boolean} [incluirAprox=true]
     * @returns {string}
     */
    function formatearExacto(valor, incluirAprox = true) {
        if (typeof valor === 'object' && valor !== null && valor.radicando !== undefined) {
            const r = simplificarRaiz(valor.radicando);
            const aprox = Math.sqrt(valor.radicando);
            if (r.indexOf('√') !== -1 && incluirAprox) {
                return r + ' (≈ ' + aprox.toFixed(4) + ')';
            }
            return r;
        }

        if (typeof valor !== 'number' || !Number.isFinite(valor)) {
            return String(valor);
        }

        // Verificar si es un entero exacto
        if (Math.abs(valor - Math.round(valor)) < 1e-7) {
            return String(Math.round(valor));
        }

        // Verificar si el cuadrado es un entero exacto (es raíz de un entero)
        const cuadrado = Math.round(valor * valor);
        if (cuadrado > 0 && Math.abs(valor - Math.sqrt(cuadrado)) < 1e-6) {
            const textoRaiz = simplificarRaiz(cuadrado);
            if (textoRaiz.indexOf('√') !== -1) {
                return incluirAprox ? (textoRaiz + ' (≈ ' + valor.toFixed(4) + ')') : textoRaiz;
            }
        }

        // Verificar si es fracción simple
        const frac = aFraccion(valor);
        if (frac && frac.denominador > 1) {
            const textoFrac = frac.numerador + '/' + frac.denominador;
            return incluirAprox ? (textoFrac + ' (≈ ' + valor.toFixed(4) + ')') : textoFrac;
        }

        // Decimal con hasta 4 cifras significativas
        return Number(valor.toFixed(4)).toString();
    }

    /**
     * Formatea las coordenadas de un punto en formato matemático limpio: "(x, y)".
     * @param {number} x
     * @param {number} y
     * @returns {string}
     */
    function formatearPunto(x, y) {
        let strX = formatearExacto(x, false);
        let strY = formatearExacto(y, false);
        // Usar signo menos tipográfico si es negativo
        strX = strX.replace(/^-/, '−');
        strY = strY.replace(/^-/, '−');
        return '(' + strX + ', ' + strY + ')';
    }

    /**
     * Construye la representación textual canónica de la elipse.
     * "(x − h)²/denX + (y − k)²/denY = 1"
     * Simplifica h=0 como "x²" y k=0 como "y²", evitando signos "+ -".
     * @param {number} h
     * @param {number} k
     * @param {number} denX
     * @param {number} denY
     * @returns {string}
     */
    function formatearEcuacion(h, k, denX, denY) {
        let parteX = '';
        if (Math.abs(h) < 1e-7) {
            parteX = 'x²';
        } else if (h > 0) {
            parteX = '(x − ' + formatearExacto(h, false) + ')²';
        } else {
            parteX = '(x + ' + formatearExacto(Math.abs(h), false) + ')²';
        }

        let parteY = '';
        if (Math.abs(k) < 1e-7) {
            parteY = 'y²';
        } else if (k > 0) {
            parteY = '(y − ' + formatearExacto(k, false) + ')²';
        } else {
            parteY = '(y + ' + formatearExacto(Math.abs(k), false) + ')²';
        }

        const strDenX = formatearExacto(denX, false);
        const strDenY = formatearExacto(denY, false);

        return parteX + '/' + strDenX + ' + ' + parteY + '/' + strDenY + ' = 1';
    }

    return {
        leerNumero,
        mcd,
        simplificarRaiz,
        aFraccion,
        formatearExacto,
        formatearPunto,
        formatearEcuacion
    };
}));
