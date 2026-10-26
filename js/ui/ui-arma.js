/**
 * Laboratorio de la Elipse - Actividad 3: Arma tu Elipse
 * Permite construir la elipse a partir de 3 conjuntos distintos de datos geométricos,
 * explicando el procedimiento matemático paso a paso como en el libro de texto.
 */

var UIArma = (function () {
    'use strict';

    var graficador = null;
    var casoActual = 'a'; // 'a', 'b', o 'c'

    var ejemplosCasos = {
        a: {
            nombre: 'Ejemplo 2 del libro (Caso A)',
            h: '-2', k: '5', ejeMayor: '10', ejeMenor: '8', orientacion: 'vertical'
        },
        b: {
            nombre: 'Ejemplo 3 del libro (Caso B)',
            v1x: '3', v1y: '6', v2x: '3', v2y: '-2', lr: '6'
        },
        c: {
            nombre: 'Ejercicio 4b del libro (Caso C)',
            v1x: '-5', v1y: '2', v2x: '3', v2y: '2', bx: '-1', by: '4'
        }
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
        if (btnEjemplo) btnEjemplo.addEventListener('click', cargarEjemploActual);

        var btnLimpiar = document.getElementById('btnLimpiarArma');
        if (btnLimpiar) btnLimpiar.addEventListener('click', limpiarCampos);

        // Toggles gráficos
        var toggles = ['chkCentroArma', 'chkFocosArma', 'chkVerticesArma', 'chkExtremosArma', 'chkEjeFocalArma', 'chkLadoRectoArma'];
        toggles.forEach(function (id) {
            var el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', function () {
                    if (window.elipseArmadaActual) {
                        graficador.dibujar(window.elipseArmadaActual, obtenerToggles());
                    }
                });
            }
        });

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

        ocultarAlerta();
        cargarEjemploActual();
    }

    function procesarArmado() {
        ocultarAlerta();
        var resultado;

        if (casoActual === 'a') {
            var rH = Formato.leerNumero(document.getElementById('inputArmaH').value);
            var rK = Formato.leerNumero(document.getElementById('inputArmaK').value);
            var rMayor = Formato.leerNumero(document.getElementById('inputArmaEjeMayor').value);
            var rMenor = Formato.leerNumero(document.getElementById('inputArmaEjeMenor').value);
            var orient = document.getElementById('selectArmaOrientacion').value;

            if (!rH.ok) return mostrarError('Centro h: ' + rH.error);
            if (!rK.ok) return mostrarError('Centro k: ' + rK.error);
            if (!rMayor.ok) return mostrarError('Eje mayor: ' + rMayor.error);
            if (!rMenor.ok) return mostrarError('Eje menor: ' + rMenor.error);

            resultado = Elipse.desdeEjes({
                h: rH.valor,
                k: rK.valor,
                ejeMayor: rMayor.valor,
                ejeMenor: rMenor.valor,
                orientacion: orient
            });
        } else if (casoActual === 'b') {
            var rV1x = Formato.leerNumero(document.getElementById('inputArmaV1x').value);
            var rV1y = Formato.leerNumero(document.getElementById('inputArmaV1y').value);
            var rV2x = Formato.leerNumero(document.getElementById('inputArmaV2x').value);
            var rV2y = Formato.leerNumero(document.getElementById('inputArmaV2y').value);
            var rLR = Formato.leerNumero(document.getElementById('inputArmaLR').value);

            if (!rV1x.ok || !rV1y.ok) return mostrarError('Coordenadas de Vértice 1: ' + (rV1x.error || rV1y.error));
            if (!rV2x.ok || !rV2y.ok) return mostrarError('Coordenadas de Vértice 2: ' + (rV2x.error || rV2y.error));
            if (!rLR.ok) return mostrarError('Lado Recto: ' + rLR.error);

            resultado = Elipse.desdeVerticesYLadoRecto({
                v1: { x: rV1x.valor, y: rV1y.valor },
                v2: { x: rV2x.valor, y: rV2y.valor },
                ladoRecto: rLR.valor
            });
        } else if (casoActual === 'c') {
            var rCV1x = Formato.leerNumero(document.getElementById('inputArmaCV1x').value);
            var rCV1y = Formato.leerNumero(document.getElementById('inputArmaCV1y').value);
            var rCV2x = Formato.leerNumero(document.getElementById('inputArmaCV2x').value);
            var rCV2y = Formato.leerNumero(document.getElementById('inputArmaCV2y').value);
            var rBx = Formato.leerNumero(document.getElementById('inputArmaBx').value);
            var rBy = Formato.leerNumero(document.getElementById('inputArmaBy').value);

            if (!rCV1x.ok || !rCV1y.ok) return mostrarError('Coordenadas de Vértice 1: ' + (rCV1x.error || rCV1y.error));
            if (!rCV2x.ok || !rCV2y.ok) return mostrarError('Coordenadas de Vértice 2: ' + (rCV2x.error || rCV2y.error));
            if (!rBx.ok || !rBy.ok) return mostrarError('Extremo del eje menor: ' + (rBx.error || rBy.error));

            resultado = Elipse.desdeVerticesYExtremoMenor({
                v1: { x: rCV1x.valor, y: rCV1y.valor },
                v2: { x: rCV2x.valor, y: rCV2y.valor },
                extremoMenor: { x: rBx.valor, y: rBy.valor }
            });
        }

        if (!resultado || !resultado.ok) {
            return mostrarError(resultado.error);
        }

        window.elipseArmadaActual = resultado;
        mostrarResultados(resultado);
    }

    function mostrarResultados(res) {
        var elEcuacion = document.getElementById('ecuacionArma');
        if (elEcuacion) elEcuacion.textContent = res.ecuacion;

        // Mostrar procedimiento paso a paso
        var contenedorPasos = document.getElementById('cajaPasosArma');
        if (contenedorPasos && res.pasos) {
            contenedorPasos.innerHTML = '<strong>📝 Procedimiento Paso a Paso:</strong><br><br>' +
                res.pasos.join('<br><br>');
        }

        llenar('resArmaCentro', Formato.formatearPunto(res.centro.x, res.centro.y));
        llenar('resArmaA', Formato.formatearExacto(res.a));
        llenar('resArmaB', Formato.formatearExacto(res.b));
        llenar('resArmaC', Formato.formatearExacto(res.c));
        llenar('resArmaLR', Formato.formatearExacto(res.ladoRecto));
        llenar('resArmaE', 'e = ' + res.excentricidad.toFixed(4));

        var panel = document.getElementById('panelResultadosArma');
        if (panel) panel.style.display = 'block';

        mostrarMensajeMati('¡Fantástico! Hemos construido la elipse siguiendo el paso a paso del libro 🚀');
        graficador.dibujar(res, obtenerToggles());
    }

    function llenar(id, texto) {
        var el = document.getElementById(id);
        if (el) el.textContent = texto;
    }

    function cargarEjemploActual() {
        var ej = ejemplosCasos[casoActual];
        if (!ej) return;

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

        procesarArmado();
        mostrarMensajeMati('Cargado el ' + ej.nombre + ' 💡');
    }

    function limpiarCampos() {
        var inputs = document.querySelectorAll('#pantallaArma input[type="text"], #pantallaArma input[type="number"]');
        inputs.forEach(function (inp) { inp.value = ''; });

        var panel = document.getElementById('panelResultadosArma');
        if (panel) panel.style.display = 'none';

        ocultarAlerta();
        if (graficador) graficador.dibujar(null);
        mostrarMensajeMati('Ingresa tus datos geométricos para armar tu elipse paso a paso 🧩');
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

    return {
        inicializar: inicializar,
        procesarArmado: procesarArmado
    };
})();
