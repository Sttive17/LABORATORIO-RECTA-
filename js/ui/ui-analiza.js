/**
 * Laboratorio de la Elipse - Actividad 2: Analiza una Ecuación
 * Permite ingresar denominadores y centro (con fracciones o decimales),
 * o coeficientes de la forma Ax² + By² = C, deduce orientación,
 * muestra elementos exactos y aproximados, y dibuja en canvas con autoescala.
 */

var UIAnaliza = (function () {
    'use strict';

    var graficador = null;
    var modoForma = 'canonica'; // 'canonica' o 'general'

    var ejemplosAnaliza = [
        {
            nombre: 'Ejemplo 1 (Horizontal)',
            h: '2', k: '-3', denX: '9', denY: '5',
            desc: '(x−2)²/9 + (y+3)²/5 = 1'
        },
        {
            nombre: 'Ejercicio 2b (Vertical)',
            h: '-2', k: '-1', denX: '25', denY: '100',
            desc: '(x+2)²/25 + (y+1)²/100 = 1'
        },
        {
            nombre: 'Ejercicio 3c (Fracciones en centro)',
            h: '3/2', k: '-1/2', denX: '121', denY: '81',
            desc: '(x − 3/2)²/121 + (y + 1/2)²/81 = 1'
        },
        {
            nombre: 'Caso Especial Circunferencia',
            h: '0', k: '0', denX: '16', denY: '16',
            desc: 'x²/16 + y²/16 = 1 (Radio = 4)'
        }
    ];
    var indiceEjemplo = 0;

    function inicializar() {
        var canvas = document.getElementById('canvasAnaliza');
        if (!canvas) return;

        graficador = new Graficador(canvas, { fijaEscala: false });

        var btnCalcular = document.getElementById('btnCalcularAnaliza');
        if (btnCalcular) btnCalcular.addEventListener('click', procesarAnalisis);

        var btnEjemplo = document.getElementById('btnEjemploAnaliza');
        if (btnEjemplo) btnEjemplo.addEventListener('click', cargarEjemplo);

        var btnLimpiar = document.getElementById('btnLimpiarAnaliza');
        if (btnLimpiar) btnLimpiar.addEventListener('click', limpiarCampos);

        // Selector de modo canónica vs general
        var tabCanonica = document.getElementById('tabFormaCanonica');
        var tabGeneral = document.getElementById('tabFormaGeneral');
        var secCanonica = document.getElementById('seccionCanonica');
        var secGeneral = document.getElementById('seccionGeneral');

        if (tabCanonica && tabGeneral) {
            tabCanonica.addEventListener('click', function () {
                modoForma = 'canonica';
                tabCanonica.classList.add('seleccionado');
                tabGeneral.classList.remove('seleccionado');
                secCanonica.style.display = 'block';
                secGeneral.style.display = 'none';
            });

            tabGeneral.addEventListener('click', function () {
                modoForma = 'general';
                tabGeneral.classList.add('seleccionado');
                tabCanonica.classList.remove('seleccionado');
                secCanonica.style.display = 'none';
                secGeneral.style.display = 'block';
            });
        }

        // Toggles de elementos gráficos
        var toggles = ['chkCentroAnaliza', 'chkFocosAnaliza', 'chkVerticesAnaliza', 'chkExtremosAnaliza', 'chkEjeFocalAnaliza', 'chkLadoRectoAnaliza'];
        toggles.forEach(function (id) {
            var el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', function () {
                    if (window.elipseAnalizadaActual) {
                        graficador.dibujar(window.elipseAnalizadaActual, obtenerToggles());
                    }
                });
            }
        });

        // Ejecutar primer ejemplo por defecto
        cargarEjemplo();
    }

    function procesarAnalisis() {
        ocultarAlerta();
        var resultado;

        if (modoForma === 'canonica') {
            var hStr = document.getElementById('inputAnalizaH').value;
            var kStr = document.getElementById('inputAnalizaK').value;
            var denXStr = document.getElementById('inputAnalizaDenX').value;
            var denYStr = document.getElementById('inputAnalizaDenY').value;

            var rH = Formato.leerNumero(hStr);
            if (!rH.ok) return mostrarError('Centro h: ' + rH.error);

            var rK = Formato.leerNumero(kStr);
            if (!rK.ok) return mostrarError('Centro k: ' + rK.error);

            var rDenX = Formato.leerNumero(denXStr);
            if (!rDenX.ok) return mostrarError('Denominador de X: ' + rDenX.error);

            var rDenY = Formato.leerNumero(denYStr);
            if (!rDenY.ok) return mostrarError('Denominador de Y: ' + rDenY.error);

            resultado = Elipse.analizarEcuacion({
                h: rH.valor,
                k: rK.valor,
                denX: rDenX.valor,
                denY: rDenY.valor
            });
        } else {
            var aStr = document.getElementById('inputGeneralA').value;
            var bStr = document.getElementById('inputGeneralB').value;
            var cStr = document.getElementById('inputGeneralC').value;

            var rA = Formato.leerNumero(aStr);
            if (!rA.ok) return mostrarError('Coeficiente A: ' + rA.error);

            var rB = Formato.leerNumero(bStr);
            if (!rB.ok) return mostrarError('Coeficiente B: ' + rB.error);

            var rC = Formato.leerNumero(cStr);
            if (!rC.ok) return mostrarError('Término C: ' + rC.error);

            resultado = Elipse.desdeFormaGeneral({
                A: rA.valor,
                B: rB.valor,
                C: rC.valor
            });
        }

        if (!resultado.ok) {
            return mostrarError(resultado.error);
        }

        window.elipseAnalizadaActual = resultado;
        mostrarResultados(resultado);
    }

    function mostrarResultados(res) {
        var elEcuacion = document.getElementById('ecuacionAnaliza');
        if (elEcuacion) elEcuacion.textContent = res.ecuacion;

        var elOrientacion = document.getElementById('orientacionAnaliza');
        if (elOrientacion) {
            if (res.esCircunferencia) {
                elOrientacion.textContent = 'Circunferencia (a = b)';
                elOrientacion.className = 'valor-badge';
                elOrientacion.style.backgroundColor = '#10b981';
            } else {
                elOrientacion.textContent = res.orientacion === 'horizontal' ? 'Horizontal (eje focal paralelo al eje X)' : 'Vertical (eje focal paralelo al eje Y)';
                elOrientacion.className = 'valor-badge';
                elOrientacion.style.backgroundColor = '#0284c7';
            }
        }

        llenar('resCentro', Formato.formatearPunto(res.centro.x, res.centro.y));
        llenar('resA', Formato.formatearExacto(res.a) + ' (a² = ' + Formato.formatearExacto(res.a2) + ')');
        llenar('resB', Formato.formatearExacto(res.b) + ' (b² = ' + Formato.formatearExacto(res.b2) + ')');
        llenar('resC', Formato.formatearExacto(res.c) + ' (c² = ' + Formato.formatearExacto(res.c2) + ')');
        llenar('resEjeMayor', Formato.formatearExacto(res.ejeMayor));
        llenar('resEjeMenor', Formato.formatearExacto(res.ejeMenor));
        llenar('resLadoRecto', Formato.formatearExacto(res.ladoRecto));
        llenar('resExcentricidad', 'e = ' + res.excentricidad.toFixed(4));
        llenar('resEjeFocal', res.ejeFocal.ecuacion);

        if (res.esCircunferencia) {
            llenar('resFocos', 'Coinciden con el centro C(' + res.centro.x + ', ' + res.centro.y + ')');
            llenar('resVertices', 'Todos los puntos a distancia r = ' + Formato.formatearExacto(res.radio));
            llenar('resExtremos', 'Radio constante = ' + Formato.formatearExacto(res.radio));
            mostrarAlertaEspecial(res.mensajeEspecial || '¡Es una circunferencia perfecta!');
        } else {
            llenar('resFocos', Formato.formatearPunto(res.focos[0].x, res.focos[0].y) + ' y ' + Formato.formatearPunto(res.focos[1].x, res.focos[1].y));
            llenar('resVertices', Formato.formatearPunto(res.vertices[0].x, res.vertices[0].y) + ' y ' + Formato.formatearPunto(res.vertices[1].x, res.vertices[1].y));
            llenar('resExtremos', Formato.formatearPunto(res.extremosMenor[0].x, res.extremosMenor[0].y) + ' y ' + Formato.formatearPunto(res.extremosMenor[1].x, res.extremosMenor[1].y));
            
            var mensajeMati = res.orientacion === 'horizontal'
                ? 'Como el número más grande (' + Formato.formatearExacto(res.denX) + ') está debajo de X, ¡la elipse se estira horizontalmente! ↔'
                : 'Como el número más grande (' + Formato.formatearExacto(res.denY) + ') está debajo de Y, ¡la elipse se estira verticalmente! ↕';
            mostrarMensajeMati(mensajeMati);
        }

        var panel = document.getElementById('panelResultadosAnaliza');
        if (panel) panel.style.display = 'block';

        graficador.dibujar(res, obtenerToggles());
    }

    function llenar(id, texto) {
        var el = document.getElementById(id);
        if (el) el.textContent = texto;
    }

    function obtenerToggles() {
        return {
            mostrarCentro: document.getElementById('chkCentroAnaliza') ? document.getElementById('chkCentroAnaliza').checked : true,
            mostrarFocos: document.getElementById('chkFocosAnaliza') ? document.getElementById('chkFocosAnaliza').checked : true,
            mostrarVertices: document.getElementById('chkVerticesAnaliza') ? document.getElementById('chkVerticesAnaliza').checked : true,
            mostrarExtremosMenor: document.getElementById('chkExtremosAnaliza') ? document.getElementById('chkExtremosAnaliza').checked : true,
            mostrarEjeFocal: document.getElementById('chkEjeFocalAnaliza') ? document.getElementById('chkEjeFocalAnaliza').checked : true,
            mostrarLadoRecto: document.getElementById('chkLadoRectoAnaliza') ? document.getElementById('chkLadoRectoAnaliza').checked : true
        };
    }

    function cargarEjemplo() {
        var ej = ejemplosAnaliza[indiceEjemplo];
        indiceEjemplo = (indiceEjemplo + 1) % ejemplosAnaliza.length;

        // Volver a modo canónica si estaba en general
        var tabCanonica = document.getElementById('tabFormaCanonica');
        if (tabCanonica) tabCanonica.click();

        document.getElementById('inputAnalizaH').value = ej.h;
        document.getElementById('inputAnalizaK').value = ej.k;
        document.getElementById('inputAnalizaDenX').value = ej.denX;
        document.getElementById('inputAnalizaDenY').value = ej.denY;

        procesarAnalisis();
        mostrarMensajeMati('Cargado el ' + ej.nombre + ': ' + ej.desc);
    }

    function limpiarCampos() {
        document.getElementById('inputAnalizaH').value = '0';
        document.getElementById('inputAnalizaK').value = '0';
        document.getElementById('inputAnalizaDenX').value = '';
        document.getElementById('inputAnalizaDenY').value = '';

        var panel = document.getElementById('panelResultadosAnaliza');
        if (panel) panel.style.display = 'none';

        ocultarAlerta();
        if (graficador) graficador.dibujar(null);
        mostrarMensajeMati('Ingresa los denominadores para descubrir todos los secretos de la elipse 🔍');
    }

    function mostrarError(msg) {
        var alerta = document.getElementById('alertaAnaliza');
        if (alerta) {
            alerta.className = 'caja-alerta error';
            alerta.innerHTML = '⚠️ <strong>¡Ups!</strong> ' + msg;
            alerta.style.display = 'flex';
        }
        mostrarMensajeMati('¡Revisa los números que ingresaste! ' + msg);
    }

    function mostrarAlertaEspecial(msg) {
        var alerta = document.getElementById('alertaAnaliza');
        if (alerta) {
            alerta.className = 'caja-alerta info';
            alerta.innerHTML = '💡 <strong>Nota Especial:</strong> ' + msg;
            alerta.style.display = 'flex';
        }
    }

    function ocultarAlerta() {
        var alerta = document.getElementById('alertaAnaliza');
        if (alerta) alerta.style.display = 'none';
    }

    function mostrarMensajeMati(msg) {
        var globo = document.getElementById('globoMatiAnaliza');
        if (globo) globo.textContent = msg;
    }

    function redibujar() {
        if (graficador && window.elipseAnalizadaActual) {
            graficador.dibujar(window.elipseAnalizadaActual, obtenerToggles());
        }
    }

    return {
        inicializar: inicializar,
        procesarAnalisis: procesarAnalisis,
        redibujar: redibujar
    };
})();
