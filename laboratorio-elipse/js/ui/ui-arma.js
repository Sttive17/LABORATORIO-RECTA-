/**
 * Laboratorio de la Elipse - Actividad 3: Arma tu Elipse
 * Valeria Hinestroza · Salomé Jiménez · Gabriela Muñoz
 * Permite construir la elipse a partir de 3 conjuntos distintos de datos geométricos,
 * explicando el procedimiento paso a paso, con un banco de 15 ejemplos del libro.
 */

var UIArma = (function () {
    'use strict';

    var graficador = null;
    var casoActual = 'a'; // 'a', 'b', o 'c'
    var indicesCasos = { a: 0, b: 0, c: 0 };

    // Banco completo de 15 ejemplos (5 para cada uno de los 3 casos)
    var ejemplosPorCaso = {
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
                nombre: 'Vertical desplazada',
                v1x: '1', v1y: '7', v2x: '1', v2y: '-1', bx: '4', by: '3',
                desc: 'Vértices (1, 7) y (1, -1), Extremo B(4, 3) → a=4, b=3'
            },
            {
                nombre: 'Horizontal con decimales',
                v1x: '-3', v1y: '1', v2x: '5', v2y: '1', bx: '1', by: '3.5',
                desc: 'Vértices (-3, 1) y (5, 1), Extremo B(1, 3.5) → a=4, b=2.5'
            }
        ]
    };

    function inicializar() {
        var canvas = document.getElementById('canvasArma');
        if (!canvas) return;

        graficador = new Graficador(canvas, { fijaEscala: false });

        // Selector de casos
        var radios = document.getElementsByName('tipoDatosArma');
        for (var i = 0; i < radios.length; i++) {
            radios[i].addEventListener('change', cambiarCaso);
        }

        var btnCalcular = document.getElementById('btnCalcularArma');
        if (btnCalcular) btnCalcular.addEventListener('click', procesarArmado);

        var btnEjemplo = document.getElementById('btnEjemploArma');
        if (btnEjemplo) btnEjemplo.addEventListener('click', cargarSiguienteEjemplo);

        var btnLimpiar = document.getElementById('btnLimpiarArma');
        if (btnLimpiar) btnLimpiar.addEventListener('click', limpiarCampos);

        // Toggles gráficos
        var toggles = ['chkCentroArma', 'chkFocosArma', 'chkVerticesArma', 'chkExtremosArma', 'chkEjeFocalArma', 'chkLadoRectoArma'];
        toggles.forEach(function (id) {
            var el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', function () {
                    redibujar();
                });
            }
        });

        // Selector desplegable de ejemplos
        var selEjemplos = document.getElementById('selectEjemplosArma');
        if (selEjemplos) {
            selEjemplos.addEventListener('change', function () {
                cargarEjemploPorIndice(parseInt(selEjemplos.value, 10));
            });
        }

        cambiarCaso();
    }

    function cambiarCaso() {
        var radios = document.getElementsByName('tipoDatosArma');
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                casoActual = radios[i].value;
                break;
            }
        }

        document.getElementById('formArmaA').style.display = casoActual === 'a' ? 'block' : 'none';
        document.getElementById('formArmaB').style.display = casoActual === 'b' ? 'block' : 'none';
        document.getElementById('formArmaC').style.display = casoActual === 'c' ? 'block' : 'none';

        // Actualizar opciones del selector desplegable de ejemplos según el caso activo
        actualizarSelectEjemplos();

        ocultarAlerta();
        cargarEjemploPorIndice(0);
    }

    function actualizarSelectEjemplos() {
        var sel = document.getElementById('selectEjemplosArma');
        if (!sel) return;
        sel.innerHTML = '';
        var lista = ejemplosPorCaso[casoActual] || [];
        lista.forEach(function (ej, idx) {
            var opt = document.createElement('option');
            opt.value = idx;
            opt.textContent = (idx + 1) + '. ' + ej.nombre;
            sel.appendChild(opt);
        });
        sel.value = indicesCasos[casoActual] || 0;
    }

    function procesarArmado() {
        ocultarAlerta();
        var resultado;

        if (casoActual === 'a') {
            var rH = Formato.leerNumero(document.getElementById('inputArmaH').value);
            var rK = Formato.leerNumero(document.getElementById('inputArmaK').value);
            var rMayor = Formato.leerNumero(document.getElementById('inputArmaEjeMayor').value);
            var rMenor = Formato.leerNumero(document.getElementById('inputArmaEjeMenor').value);
            var orientacion = document.getElementById('selectArmaOrientacion').value;

            if (!rH.ok) return mostrarError('Centro h: ' + rH.error);
            if (!rK.ok) return mostrarError('Centro k: ' + rK.error);
            if (!rMayor.ok) return mostrarError('Longitud del Eje Mayor: ' + rMayor.error);
            if (!rMenor.ok) return mostrarError('Longitud del Eje Menor: ' + rMenor.error);

            resultado = Elipse.construirDesdeEjes({
                h: rH.valor,
                k: rK.valor,
                longitudEjeMayor: rMayor.valor,
                longitudEjeMenor: rMenor.valor,
                orientacion: orientacion
            });
        } else if (casoActual === 'b') {
            var rV1x = Formato.leerNumero(document.getElementById('inputArmaV1x').value);
            var rV1y = Formato.leerNumero(document.getElementById('inputArmaV1y').value);
            var rV2x = Formato.leerNumero(document.getElementById('inputArmaV2x').value);
            var rV2y = Formato.leerNumero(document.getElementById('inputArmaV2y').value);
            var rLR = Formato.leerNumero(document.getElementById('inputArmaLR').value);

            if (!rV1x.ok || !rV1y.ok) return mostrarError('Vértice A1: ingresa números válidos');
            if (!rV2x.ok || !rV2y.ok) return mostrarError('Vértice A2: ingresa números válidos');
            if (!rLR.ok) return mostrarError('Lado Recto: ' + rLR.error);

            resultado = Elipse.construirDesdeVerticesYLadoRecto({
                v1: { x: rV1x.valor, y: rV1y.valor },
                v2: { x: rV2x.valor, y: rV2y.valor },
                ladoRecto: rLR.valor
            });
        } else if (casoActual === 'c') {
            var rV1x = Formato.leerNumero(document.getElementById('inputArmaCV1x').value);
            var rV1y = Formato.leerNumero(document.getElementById('inputArmaCV1y').value);
            var rV2x = Formato.leerNumero(document.getElementById('inputArmaCV2x').value);
            var rV2y = Formato.leerNumero(document.getElementById('inputArmaCV2y').value);
            var rBx = Formato.leerNumero(document.getElementById('inputArmaBx').value);
            var rBy = Formato.leerNumero(document.getElementById('inputArmaBy').value);

            if (!rV1x.ok || !rV1y.ok) return mostrarError('Vértice A1: números inválidos');
            if (!rV2x.ok || !rV2y.ok) return mostrarError('Vértice A2: números inválidos');
            if (!rBx.ok || !rBy.ok) return mostrarError('Extremo B: números inválidos');

            resultado = Elipse.construirDesdeVerticesYExtremoMenor({
                v1: { x: rV1x.valor, y: rV1y.valor },
                v2: { x: rV2x.valor, y: rV2y.valor },
                extremoMenor: { x: rBx.valor, y: rBy.valor }
            });
        }

        if (!resultado.ok) {
            return mostrarError(resultado.error);
        }

        window.elipseArmadaActual = resultado;
        mostrarResultados(resultado);
    }

    function mostrarResultados(res) {
        var elEcuacion = document.getElementById('ecuacionArma');
        if (elEcuacion) elEcuacion.textContent = res.ecuacion;

        var elPasos = document.getElementById('cajaPasosArma');
        if (elPasos && res.pasos) {
            elPasos.innerHTML = '<strong>📐 Procedimiento de Construcción Paso a Paso:</strong><br><br>' + res.pasos.join('<br>');
        }

        llenar('resArmaCentro', Formato.formatearPunto(res.centro.x, res.centro.y));
        llenar('resArmaA', Formato.formatearExacto(res.a));
        llenar('resArmaB', Formato.formatearExacto(res.b));
        llenar('resArmaC', Formato.formatearExacto(res.c));
        llenar('resArmaLR', Formato.formatearExacto(res.ladoRecto));
        llenar('resArmaE', res.excentricidad.toFixed(4));

        var panel = document.getElementById('panelResultadosArma');
        if (panel) panel.style.display = 'block';

        mostrarMensajeMati('¡Elipse armada exitosamente! Revisa el procedimiento paso a paso y la gráfica 🧩');
        graficador.dibujar(res, obtenerToggles());
    }

    function llenar(id, texto) {
        var el = document.getElementById(id);
        if (el) el.textContent = texto;
    }

    function obtenerToggles() {
        return {
            mostrarCentro: document.getElementById('chkCentroArma') ? document.getElementById('chkCentroArma').checked : true,
            mostrarFocos: document.getElementById('chkFocosArma') ? document.getElementById('chkFocosArma').checked : true,
            mostrarVertices: document.getElementById('chkVerticesArma') ? document.getElementById('chkVerticesArma').checked : true,
            mostrarExtremosMenor: document.getElementById('chkExtremosArma') ? document.getElementById('chkExtremosArma').checked : true,
            mostrarEjeFocal: document.getElementById('chkEjeFocalArma') ? document.getElementById('chkEjeFocalArma').checked : true,
            mostrarLadoRecto: document.getElementById('chkLadoRectoArma') ? document.getElementById('chkLadoRectoArma').checked : true
        };
    }

    function cargarEjemploPorIndice(idx) {
        var lista = ejemplosPorCaso[casoActual] || [];
        if (idx < 0 || idx >= lista.length) return;
        indicesCasos[casoActual] = idx;
        var ej = lista[idx];

        if (casoActual === 'a') {
            document.getElementById('inputArmaH').value = ej.h;
            document.getElementById('inputArmaK').value = ej.k;
            document.getElementById('inputArmaEjeMayor').value = ej.ejeMayor;
            document.getElementById('inputArmaEjeMenor').value = ej.ejeMenor;
            document.getElementById('selectArmaOrientacion').value = ej.orientacion;
        } else if (casoActual === 'b') {
            document.getElementById('inputArmaV1x').value = ej.v1x;
            document.getElementById('inputArmaV1y').value = ej.v1y;
            document.getElementById('inputArmaV2x').value = ej.v2x;
            document.getElementById('inputArmaV2y').value = ej.v2y;
            document.getElementById('inputArmaLR').value = ej.lr;
        } else if (casoActual === 'c') {
            document.getElementById('inputArmaCV1x').value = ej.v1x;
            document.getElementById('inputArmaCV1y').value = ej.v1y;
            document.getElementById('inputArmaCV2x').value = ej.v2x;
            document.getElementById('inputArmaCV2y').value = ej.v2y;
            document.getElementById('inputArmaBx').value = ej.bx;
            document.getElementById('inputArmaBy').value = ej.by;
        }

        var sel = document.getElementById('selectEjemplosArma');
        if (sel) sel.value = idx;

        procesarArmado();
        mostrarMensajeMati('Cargado el ' + ej.nombre + ': ' + ej.desc);
    }

    function cargarSiguienteEjemplo() {
        var lista = ejemplosPorCaso[casoActual] || [];
        var prox = ((indicesCasos[casoActual] || 0) + 1) % lista.length;
        cargarEjemploPorIndice(prox);
    }

    function limpiarCampos() {
        if (casoActual === 'a') {
            document.getElementById('inputArmaH').value = '0';
            document.getElementById('inputArmaK').value = '0';
            document.getElementById('inputArmaEjeMayor').value = '';
            document.getElementById('inputArmaEjeMenor').value = '';
        } else if (casoActual === 'b') {
            document.getElementById('inputArmaV1x').value = '';
            document.getElementById('inputArmaV1y').value = '';
            document.getElementById('inputArmaV2x').value = '';
            document.getElementById('inputArmaV2y').value = '';
            document.getElementById('inputArmaLR').value = '';
        } else if (casoActual === 'c') {
            document.getElementById('inputArmaCV1x').value = '';
            document.getElementById('inputArmaCV1y').value = '';
            document.getElementById('inputArmaCV2x').value = '';
            document.getElementById('inputArmaCV2y').value = '';
            document.getElementById('inputArmaBx').value = '';
            document.getElementById('inputArmaBy').value = '';
        }

        var panel = document.getElementById('panelResultadosArma');
        if (panel) panel.style.display = 'none';

        ocultarAlerta();
        if (graficador) graficador.dibujar(null);
        mostrarMensajeMati('Ingresa los datos para construir tu elipse geométrica 🔨');
    }

    function mostrarError(msg) {
        var alerta = document.getElementById('alertaArma');
        if (alerta) {
            alerta.className = 'caja-alerta error';
            alerta.innerHTML = '⚠️ <strong>¡Ups!</strong> ' + msg;
            alerta.style.display = 'flex';
        }
        mostrarMensajeMati('Revisa los datos ingresados: ' + msg);
    }

    function ocultarAlerta() {
        var alerta = document.getElementById('alertaArma');
        if (alerta) alerta.style.display = 'none';
    }

    function mostrarMensajeMati(msg) {
        var globo = document.getElementById('globoMatiArma');
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
        cargarEjemploPorIndice: cargarEjemploPorIndice
    };
})();
