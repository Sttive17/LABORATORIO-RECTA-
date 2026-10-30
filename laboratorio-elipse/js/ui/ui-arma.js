/**
 * Laboratorio de la Elipse - Actividad 3: Arma tu Elipse
 * Valeria Hinestroza · Salomé Jiménez · Gabriela Muñoz
 * Permite construir la elipse a partir de 3 conjuntos distintos de datos geométricos,
 * explicando el procedimiento paso a paso, con un banco de 15 ejemplos del libro.
 */

const UIArma = (function () {
    'use strict';

    let graficador = null;
    let casoActual = 'a'; // 'a', 'b', o 'c'
    const indicesCasos = { a: 0, b: 0, c: 0 };

    // Banco completo de 15 ejemplos (5 para cada uno de los 3 casos)
    const ejemplosPorCaso = {
        a: [
            {
                nombre: 'Ejemplo 2 del libro (Vertical)',
                h: '-2', k: '5', ejeMayor: '10', ejeMenor: '8', orientacion: 'vertical',
                desc: 'Centro (-2, 5), Eje Mayor 2a=10, Eje Menor 2b=8, Vertical'
            },
            {
                nombre: 'Ejercicio 2a (Horizontal en el origen)',
                h: '0', k: '0', ejeMayor: '12', ejeMenor: '4', orientacion: 'horizontal',
                desc: 'Centro (0, 0), Eje Mayor 2a=12, Eje Menor 2b=4, Horizontal'
            },
            {
                nombre: 'Ejercicio 4a (Horizontal canónica)',
                h: '0', k: '0', ejeMayor: '8', ejeMenor: '6', orientacion: 'horizontal',
                desc: 'Centro (0, 0), Eje Mayor 2a=8, Eje Menor 2b=6, Horizontal'
            },
            {
                nombre: 'Centro desplazado (Horizontal)',
                h: '3', k: '-1', ejeMayor: '14', ejeMenor: '6', orientacion: 'horizontal',
                desc: 'Centro (3, -1), Eje Mayor 2a=14, Eje Menor 2b=6, Horizontal'
            },
            {
                nombre: 'Caso Circunferencia (a = b)',
                h: '1', k: '2', ejeMayor: '8', ejeMenor: '8', orientacion: 'horizontal',
                desc: 'Centro (1, 2), Eje Mayor=8, Eje Menor=8 (Radio r = 4)'
            }
        ],
        b: [
            {
                nombre: 'Ejemplo 3 del libro (Vertical con LR=6)',
                v1x: '3', v1y: '6', v2x: '3', v2y: '-2', lr: '6',
                desc: 'Vértices (3, 6) y (3, -2), LR=6 → a=4, b=√12≈3.46'
            },
            {
                nombre: 'Ejercicio 2b (Vertical con LR=5)',
                v1x: '-2', v1y: '9', v2x: '-2', v2y: '-11', lr: '5',
                desc: 'Vértices (-2, 9) y (-2, -11), LR=5 → a=10, b=5'
            },
            {
                nombre: 'Horizontal en el origen (LR = 4/3)',
                v1x: '-6', v1y: '0', v2x: '6', v2y: '0', lr: '4/3',
                desc: 'Vértices (-6, 0) y (6, 0), LR=4/3 ≈ 1.33 → a=6, b=2'
            },
            {
                nombre: 'Horizontal desplazada (LR = 3.2)',
                v1x: '-4', v1y: '2', v2x: '6', v2y: '2', lr: '3.2',
                desc: 'Vértices (-4, 2) y (6, 2), LR=3.2 → a=5, b=4'
            },
            {
                nombre: 'Vertical desplazada (LR = 3.6)',
                v1x: '2', v1y: '8', v2x: '2', v2y: '-2', lr: '3.6',
                desc: 'Vértices (2, 8) y (2, -2), LR=3.6 → a=5, b=3'
            }
        ],
        c: [
            {
                nombre: 'Ejercicio 4b del libro (Horizontal)',
                v1x: '-5', v1y: '2', v2x: '3', v2y: '2', bx: '-1', by: '4',
                desc: 'Vértices (-5, 2) y (3, 2), Extremo B(-1, 4) → a=4, b=2'
            },
            {
                nombre: 'Ejercicio 4a del libro (Horizontal en origen)',
                v1x: '-4', v1y: '0', v2x: '4', v2y: '0', bx: '0', by: '3',
                desc: 'Vértices (-4, 0) y (4, 0), Extremo B(0, 3) → a=4, b=3'
            },
            {
                nombre: 'Vertical en el origen',
                v1x: '0', v1y: '5', v2x: '0', v2y: '-5', bx: '3', by: '0',
                desc: 'Vértices (0, 5) y (0, -5), Extremo B(3, 0) → a=5, b=3'
            },
            {
                nombre: 'Horizontal desplazada en (-2, 3)',
                v1x: '-8', v1y: '3', v2x: '4', v2y: '3', bx: '-2', by: '7',
                desc: 'Vértices (-8, 3) y (4, 3), Extremo B(-2, 7) → a=6, b=4'
            },
            {
                nombre: 'Vertical desplazada en (1, -1)',
                v1x: '1', v1y: '4', v2x: '1', v2y: '-6', bx: '4', by: '-1',
                desc: 'Vértices (1, 4) y (1, -6), Extremo B(4, -1) → a=5, b=3'
            }
        ]
    };

    function limpiarErroresInputs() {
        const inputs = document.querySelectorAll('#pantallaArma input[type="text"]');
        inputs.forEach(inp => inp.classList.remove('campo-error'));
    }

    function marcarErrorInput(idInput, mensaje) {
        const el = document.getElementById(idInput);
        if (el) {
            el.classList.add('campo-error');
            el.focus();
        }
        mostrarError(mensaje);
    }

    function inicializar() {
        const canvas = document.getElementById('canvasArma');
        if (!canvas) return;

        graficador = new Graficador(canvas, { fijaEscala: false });

        const btnCalcular = document.getElementById('btnCalcularArma');
        if (btnCalcular) btnCalcular.addEventListener('click', procesarArmado);

        const btnEjemplo = document.getElementById('btnEjemploArma');
        if (btnEjemplo) btnEjemplo.addEventListener('click', cargarSiguienteEjemplo);

        const btnLimpiar = document.getElementById('btnLimpiarArma');
        if (btnLimpiar) btnLimpiar.addEventListener('click', restablecer);

        // Feedback inmediato: remover clase de error al escribir en cualquier campo
        const inputsArma = document.querySelectorAll('#pantallaArma input[type="text"]');
        inputsArma.forEach(inp => {
            inp.addEventListener('input', () => {
                inp.classList.remove('campo-error');
                ocultarAlerta();
            });
        });

        // Radios de selección de caso
        const radios = document.getElementsByName('tipoDatosArma');
        radios.forEach(r => {
            r.addEventListener('change', cambiarCaso);
        });

        // Toggles de visualización
        const toggles = ['chkCentroArma', 'chkFocosArma', 'chkVerticesArma', 'chkExtremosArma', 'chkEjeFocalArma', 'chkLadoRectoArma'];
        toggles.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', () => redibujar());
            }
        });

        // Selector desplegable de ejemplos
        const selEjemplos = document.getElementById('selectEjemplosArma');
        if (selEjemplos) {
            selEjemplos.addEventListener('change', () => {
                cargarEjemploPorIndice(parseInt(selEjemplos.value, 10));
            });
        }

        cambiarCaso();
    }

    function cambiarCaso() {
        limpiarErroresInputs();
        ocultarAlerta();

        const radios = document.getElementsByName('tipoDatosArma');
        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                casoActual = radios[i].value;
                break;
            }
        }

        document.getElementById('formArmaA').style.display = casoActual === 'a' ? 'block' : 'none';
        document.getElementById('formArmaB').style.display = casoActual === 'b' ? 'block' : 'none';
        document.getElementById('formArmaC').style.display = casoActual === 'c' ? 'block' : 'none';

        actualizarSelectEjemplos();
        cargarEjemploPorIndice(0);
    }

    function actualizarSelectEjemplos() {
        const sel = document.getElementById('selectEjemplosArma');
        if (!sel) return;
        sel.innerHTML = '';
        const lista = ejemplosPorCaso[casoActual] || [];
        lista.forEach((ej, idx) => {
            const opt = document.createElement('option');
            opt.value = idx;
            opt.textContent = (idx + 1) + '. ' + ej.nombre;
            sel.appendChild(opt);
        });
        sel.value = indicesCasos[casoActual] || 0;
    }

    function procesarArmado() {
        limpiarErroresInputs();
        ocultarAlerta();
        let resultado;

        try {
            if (casoActual === 'a') {
                const hInput = document.getElementById('inputArmaH');
                const kInput = document.getElementById('inputArmaK');
                const mayorInput = document.getElementById('inputArmaEjeMayor');
                const menorInput = document.getElementById('inputArmaEjeMenor');
                const orientacion = document.getElementById('selectArmaOrientacion').value;

                const rH = Formato.leerNumero(hInput.value);
                if (!rH.ok) return marcarErrorInput('inputArmaH', 'Centro X (h): ' + rH.error);

                const rK = Formato.leerNumero(kInput.value);
                if (!rK.ok) return marcarErrorInput('inputArmaK', 'Centro Y (k): ' + rK.error);

                const rMayor = Formato.leerNumero(mayorInput.value);
                if (!rMayor.ok) return marcarErrorInput('inputArmaEjeMayor', 'Longitud del Eje Mayor (2a): ' + rMayor.error);

                const rMenor = Formato.leerNumero(menorInput.value);
                if (!rMenor.ok) return marcarErrorInput('inputArmaEjeMenor', 'Longitud del Eje Menor (2b): ' + rMenor.error);

                resultado = (Elipse.desdeEjes || Elipse.construirDesdeEjes)({
                    h: rH.valor,
                    k: rK.valor,
                    ejeMayor: rMayor.valor,
                    ejeMenor: rMenor.valor,
                    longitudEjeMayor: rMayor.valor,
                    longitudEjeMenor: rMenor.valor,
                    orientacion: orientacion
                });
            } else if (casoActual === 'b') {
                const v1xInput = document.getElementById('inputArmaV1x');
                const v1yInput = document.getElementById('inputArmaV1y');
                const v2xInput = document.getElementById('inputArmaV2x');
                const v2yInput = document.getElementById('inputArmaV2y');
                const lrInput = document.getElementById('inputArmaLR');

                const rV1x = Formato.leerNumero(v1xInput.value);
                if (!rV1x.ok) return marcarErrorInput('inputArmaV1x', 'Vértice 1 X (A\'): ' + rV1x.error);

                const rV1y = Formato.leerNumero(v1yInput.value);
                if (!rV1y.ok) return marcarErrorInput('inputArmaV1y', 'Vértice 1 Y (A\'): ' + rV1y.error);

                const rV2x = Formato.leerNumero(v2xInput.value);
                if (!rV2x.ok) return marcarErrorInput('inputArmaV2x', 'Vértice 2 X (A): ' + rV2x.error);

                const rV2y = Formato.leerNumero(v2yInput.value);
                if (!rV2y.ok) return marcarErrorInput('inputArmaV2y', 'Vértice 2 Y (A): ' + rV2y.error);

                const rLR = Formato.leerNumero(lrInput.value);
                if (!rLR.ok) return marcarErrorInput('inputArmaLR', 'Longitud del Lado Recto (LR): ' + rLR.error);

                resultado = (Elipse.desdeVerticesYLadoRecto || Elipse.construirDesdeVerticesYLadoRecto)({
                    v1: { x: rV1x.valor, y: rV1y.valor },
                    v2: { x: rV2x.valor, y: rV2y.valor },
                    ladoRecto: rLR.valor
                });
            } else if (casoActual === 'c') {
                const cv1xInput = document.getElementById('inputArmaCV1x');
                const cv1yInput = document.getElementById('inputArmaCV1y');
                const cv2xInput = document.getElementById('inputArmaCV2x');
                const cv2yInput = document.getElementById('inputArmaCV2y');
                const bxInput = document.getElementById('inputArmaBx');
                const byInput = document.getElementById('inputArmaBy');

                const rV1x = Formato.leerNumero(cv1xInput.value);
                if (!rV1x.ok) return marcarErrorInput('inputArmaCV1x', 'Vértice 1 X (A\'): ' + rV1x.error);

                const rV1y = Formato.leerNumero(cv1yInput.value);
                if (!rV1y.ok) return marcarErrorInput('inputArmaCV1y', 'Vértice 1 Y (A\'): ' + rV1y.error);

                const rV2x = Formato.leerNumero(cv2xInput.value);
                if (!rV2x.ok) return marcarErrorInput('inputArmaCV2x', 'Vértice 2 X (A): ' + rV2x.error);

                const rV2y = Formato.leerNumero(cv2yInput.value);
                if (!rV2y.ok) return marcarErrorInput('inputArmaCV2y', 'Vértice 2 Y (A): ' + rV2y.error);

                const rBx = Formato.leerNumero(bxInput.value);
                if (!rBx.ok) return marcarErrorInput('inputArmaBx', 'Extremo Menor X (B): ' + rBx.error);

                const rBy = Formato.leerNumero(byInput.value);
                if (!rBy.ok) return marcarErrorInput('inputArmaBy', 'Extremo Menor Y (B): ' + rBy.error);

                resultado = (Elipse.desdeVerticesYExtremoMenor || Elipse.construirDesdeVerticesYExtremoMenor)({
                    v1: { x: rV1x.valor, y: rV1y.valor },
                    v2: { x: rV2x.valor, y: rV2y.valor },
                    extremoMenor: { x: rBx.valor, y: rBy.valor }
                });
            }
        } catch (err) {
            return mostrarError('Error en la construcción geométrica: ' + err.message);
        }

        if (!resultado || !resultado.ok) {
            return mostrarError(resultado ? resultado.error : 'Ocurrió un error al procesar los datos.');
        }

        window.elipseArmadaActual = resultado;

        const elEcuacion = document.getElementById('ecuacionArma');
        if (elEcuacion) elEcuacion.textContent = resultado.ecuacion;

        const elPasos = document.getElementById('cajaPasosArma');
        if (elPasos && resultado.pasos) {
            elPasos.innerHTML = '<strong>📝 Procedimiento de Construcción Paso a Paso:</strong><br><br>' + resultado.pasos.join('<br>');
        }

        llenar('resArmaCentro', Formato.formatearPunto(resultado.centro.x, resultado.centro.y));
        llenar('resArmaA', Formato.formatearExacto(resultado.a));
        llenar('resArmaB', Formato.formatearExacto(resultado.b));
        llenar('resArmaC', Formato.formatearExacto(resultado.c));
        llenar('resArmaLR', Formato.formatearExacto(resultado.ladoRecto));
        llenar('resArmaE', 'e = ' + resultado.excentricidad.toFixed(4));

        const panel = document.getElementById('panelResultadosArma');
        if (panel) panel.style.display = 'block';

        mostrarMensajeMati('¡Elipse armada exitosamente! Revisa el procedimiento analítico y la gráfica 🧩');
        graficador.dibujar(resultado, obtenerToggles());
    }

    function llenar(id, texto) {
        const el = document.getElementById(id);
        if (el) el.textContent = texto;
    }

    function obtenerToggles() {
        return {
            mostrarCentro: document.getElementById('chkCentroArma')?.checked ?? true,
            mostrarFocos: document.getElementById('chkFocosArma')?.checked ?? true,
            mostrarVertices: document.getElementById('chkVerticesArma')?.checked ?? true,
            mostrarExtremosMenor: document.getElementById('chkExtremosArma')?.checked ?? true,
            mostrarEjeFocal: document.getElementById('chkEjeFocalArma')?.checked ?? true,
            mostrarLadoRecto: document.getElementById('chkLadoRectoArma')?.checked ?? true
        };
    }

    function cargarEjemploPorCaso(caso, idx) {
        const lista = ejemplosPorCaso[caso];
        if (!lista || idx < 0 || idx >= lista.length) return;
        indicesCasos[caso] = idx;
        const ej = lista[idx];

        limpiarErroresInputs();
        ocultarAlerta();

        if (caso === 'a') {
            document.getElementById('inputArmaH').value = ej.h;
            document.getElementById('inputArmaK').value = ej.k;
            document.getElementById('inputArmaEjeMayor').value = ej.ejeMayor;
            document.getElementById('inputArmaEjeMenor').value = ej.ejeMenor;
            document.getElementById('selectArmaOrientacion').value = ej.orientacion;
        } else if (caso === 'b') {
            document.getElementById('inputArmaV1x').value = ej.v1x;
            document.getElementById('inputArmaV1y').value = ej.v1y;
            document.getElementById('inputArmaV2x').value = ej.v2x;
            document.getElementById('inputArmaV2y').value = ej.v2y;
            document.getElementById('inputArmaLR').value = ej.lr;
        } else if (caso === 'c') {
            document.getElementById('inputArmaCV1x').value = ej.v1x;
            document.getElementById('inputArmaCV1y').value = ej.v1y;
            document.getElementById('inputArmaCV2x').value = ej.v2x;
            document.getElementById('inputArmaCV2y').value = ej.v2y;
            document.getElementById('inputArmaBx').value = ej.bx;
            document.getElementById('inputArmaBy').value = ej.by;
        }

        const sel = document.getElementById('selectEjemplosArma');
        if (sel) sel.value = idx;

        procesarArmado();
        mostrarMensajeMati('Cargado el ' + ej.nombre + ' 💡');
    }

    function cargarEjemploPorIndice(idx) {
        cargarEjemploPorCaso(casoActual, idx);
    }

    function cargarSiguienteEjemplo() {
        const lista = ejemplosPorCaso[casoActual] || [];
        const prox = ((indicesCasos[casoActual] || 0) + 1) % lista.length;
        cargarEjemploPorIndice(prox);
    }

    function restablecer() {
        limpiarErroresInputs();
        ocultarAlerta();
        cargarEjemploPorIndice(0);
        mostrarMensajeMati('Se restableció el caso ' + casoActual.toUpperCase() + ' a los datos del Ejemplo 1. ¡Comienza de nuevo! 🔄');
    }

    function mostrarError(msg) {
        const alerta = document.getElementById('alertaArma');
        if (alerta) {
            alerta.className = 'caja-alerta error';
            alerta.innerHTML = '⚠️ <strong>Dato no válido:</strong> ' + msg;
            alerta.style.display = 'flex';
        }
        mostrarMensajeMati('¡Revisa el campo señalado en rojo! ' + msg);
    }

    function ocultarAlerta() {
        const alerta = document.getElementById('alertaArma');
        if (alerta) alerta.style.display = 'none';
    }

    function mostrarMensajeMati(msg) {
        const globo = document.getElementById('globoMatiArma');
        if (globo) globo.textContent = msg;
    }

    function redibujar() {
        if (graficador && window.elipseArmadaActual) {
            graficador.dibujar(window.elipseArmadaActual, obtenerToggles());
        }
    }

    return {
        inicializar: inicializar,
        procesarArmado: procesarArmado,
        redibujar: redibujar,
        cargarEjemploPorCaso: cargarEjemploPorCaso,
        restablecer: restablecer
    };
})();

if (typeof self !== 'undefined') self.UIArma = UIArma;
