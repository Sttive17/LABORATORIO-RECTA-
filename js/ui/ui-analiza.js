/**
 * Laboratorio de la Elipse - Actividad 2: Analiza una Ecuación
 * Valeria Hinestroza · Salomé Jiménez · Gabriela Muñoz
 * Permite ingresar denominadores y centro (con fracciones o decimales),
 * o coeficientes de la forma Ax² + By² = C, deduce orientación,
 * muestra elementos exactos y aproximados con un banco de 11 ejemplos completos.
 */

const UIAnaliza = (function () {
    'use strict';

    let graficador = null;
    let modoForma = 'canonica'; // 'canonica' o 'general'

    // Banco completo de 11 ejemplos representativos del libro de matemáticas
    const ejemplosAnaliza = [
        {
            nombre: 'Ejemplo 1 del libro (Horizontal)',
            modo: 'canonica',
            h: '2', k: '-3', denX: '9', denY: '5',
            desc: '(x−2)²/9 + (y+3)²/5 = 1  →  a²=9, b²=5, c²=4 (c=2)'
        },
        {
            nombre: 'Ejemplo 2 del libro (Vertical)',
            modo: 'canonica',
            h: '-2', k: '5', denX: '16', denY: '25',
            desc: '(x+2)²/16 + (y−5)²/25 = 1  →  a²=25, b²=16, c²=9 (c=3)'
        },
        {
            nombre: 'Ejercicio 2a (Origen Horizontal)',
            modo: 'canonica',
            h: '0', k: '0', denX: '36', denY: '4',
            desc: 'x²/36 + y²/4 = 1  →  a=6, b=2, c=√32≈5.66'
        },
        {
            nombre: 'Ejercicio 2b (Vertical en (-2, -1))',
            modo: 'canonica',
            h: '-2', k: '-1', denX: '25', denY: '100',
            desc: '(x+2)²/25 + (y+1)²/100 = 1  →  a=10, b=5, c=√75≈8.66'
        },
        {
            nombre: 'Ejercicio 3c (Centro Fraccionario)',
            modo: 'canonica',
            h: '3/2', k: '-1/2', denX: '121', denY: '81',
            desc: '(x − 3/2)²/121 + (y + 1/2)²/81 = 1  →  a=11, b=9'
        },
        {
            nombre: 'Ejercicio 4a (Horizontal canónica)',
            modo: 'canonica',
            h: '0', k: '0', denX: '16', denY: '9',
            desc: 'x²/16 + y²/9 = 1  →  a=4, b=3, c=√7≈2.65'
        },
        {
            nombre: 'Caso Especial Circunferencia (a = b)',
            modo: 'canonica',
            h: '0', k: '0', denX: '25', denY: '25',
            desc: 'x²/25 + y²/25 = 1 (Radio r = 5, c = 0, e = 0)'
        },
        {
            nombre: 'Forma General 1 (4x² + 9y² = 36)',
            modo: 'general',
            A: '4', B: '9', C: '36',
            desc: '4x² + 9y² = 36  →  x²/9 + y²/4 = 1 (a=3, b=2, horizontal)'
        },
        {
            nombre: 'Forma General 2 (16x² + 25y² = 400)',
            modo: 'general',
            A: '16', B: '25', C: '400',
            desc: '16x² + 25y² = 400  →  x²/25 + y²/16 = 1 (a=5, b=4, horizontal)'
        },
        {
            nombre: 'Forma General 3 (9x² + 4y² = 36)',
            modo: 'general',
            A: '9', B: '4', C: '36',
            desc: '9x² + 4y² = 36  →  x²/4 + y²/9 = 1 (a=3, b=2, vertical)'
        },
        {
            nombre: 'Forma General 4 (25x² + 169y² = 4225)',
            modo: 'general',
            A: '25', B: '169', C: '4225',
            desc: '25x² + 169y² = 4225  →  x²/169 + y²/25 = 1 (a=13, b=5, horizontal)'
        }
    ];
    let indiceEjemplo = 0;

    function limpiarErroresInputs() {
        const inputs = document.querySelectorAll('#pantallaAnaliza input[type="text"]');
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
        const canvas = document.getElementById('canvasAnaliza');
        if (!canvas) return;

        graficador = new Graficador(canvas, { fijaEscala: false });

        const btnCalcular = document.getElementById('btnCalcularAnaliza');
        if (btnCalcular) btnCalcular.addEventListener('click', procesarAnalisis);

        const btnEjemplo = document.getElementById('btnEjemploAnaliza');
        if (btnEjemplo) btnEjemplo.addEventListener('click', cargarSiguienteEjemplo);

        const btnLimpiar = document.getElementById('btnLimpiarAnaliza');
        if (btnLimpiar) btnLimpiar.addEventListener('click', restablecer);

        // Feedback inmediato: remover clase de error al escribir en cualquier campo
        const inputsAnaliza = document.querySelectorAll('#pantallaAnaliza input[type="text"]');
        inputsAnaliza.forEach(inp => {
            inp.addEventListener('input', () => {
                inp.classList.remove('campo-error');
                ocultarAlerta();
            });
        });

        // Selector de modo canónica vs general
        const tabCanonica = document.getElementById('tabFormaCanonica');
        const tabGeneral = document.getElementById('tabFormaGeneral');
        const secCanonica = document.getElementById('seccionCanonica');
        const secGeneral = document.getElementById('seccionGeneral');

        if (tabCanonica && tabGeneral) {
            tabCanonica.addEventListener('click', () => {
                limpiarErroresInputs();
                ocultarAlerta();
                modoForma = 'canonica';
                tabCanonica.classList.add('seleccionado');
                tabGeneral.classList.remove('seleccionado');
                if (secCanonica) secCanonica.style.display = 'block';
                if (secGeneral) secGeneral.style.display = 'none';
            });

            tabGeneral.addEventListener('click', () => {
                limpiarErroresInputs();
                ocultarAlerta();
                modoForma = 'general';
                tabGeneral.classList.add('seleccionado');
                tabCanonica.classList.remove('seleccionado');
                if (secCanonica) secCanonica.style.display = 'none';
                if (secGeneral) secGeneral.style.display = 'block';
            });
        }

        // Toggles de elementos gráficos
        const toggles = ['chkCentroAnaliza', 'chkFocosAnaliza', 'chkVerticesAnaliza', 'chkExtremosAnaliza', 'chkEjeFocalAnaliza', 'chkLadoRectoAnaliza'];
        toggles.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', () => redibujar());
            }
        });

        // Selector desplegable de ejemplos
        const selEjemplos = document.getElementById('selectEjemplosAnaliza');
        if (selEjemplos) {
            selEjemplos.innerHTML = '';
            ejemplosAnaliza.forEach((ej, idx) => {
                const opt = document.createElement('option');
                opt.value = idx;
                opt.textContent = (idx + 1) + '. ' + ej.nombre;
                selEjemplos.appendChild(opt);
            });
            selEjemplos.addEventListener('change', () => {
                cargarEjemploPorIndice(parseInt(selEjemplos.value, 10));
            });
        }

        // Ejecutar primer ejemplo por defecto para que la gráfica siempre esté viva
        cargarEjemploPorIndice(0);
    }

    function procesarAnalisis() {
        limpiarErroresInputs();
        ocultarAlerta();
        let resultado;

        try {
            if (modoForma === 'canonica') {
                const hInput = document.getElementById('inputAnalizaH');
                const kInput = document.getElementById('inputAnalizaK');
                const denXInput = document.getElementById('inputAnalizaDenX');
                const denYInput = document.getElementById('inputAnalizaDenY');

                const rH = Formato.leerNumero(hInput.value);
                if (!rH.ok) return marcarErrorInput('inputAnalizaH', 'Centro X (h): ' + rH.error);

                const rK = Formato.leerNumero(kInput.value);
                if (!rK.ok) return marcarErrorInput('inputAnalizaK', 'Centro Y (k): ' + rK.error);

                const rDenX = Formato.leerNumero(denXInput.value);
                if (!rDenX.ok) return marcarErrorInput('inputAnalizaDenX', 'Denominador de X: ' + rDenX.error);

                const rDenY = Formato.leerNumero(denYInput.value);
                if (!rDenY.ok) return marcarErrorInput('inputAnalizaDenY', 'Denominador de Y: ' + rDenY.error);

                resultado = Elipse.analizarEcuacion({
                    h: rH.valor,
                    k: rK.valor,
                    denX: rDenX.valor,
                    denY: rDenY.valor
                });
            } else {
                const aInput = document.getElementById('inputGeneralA');
                const bInput = document.getElementById('inputGeneralB');
                const cInput = document.getElementById('inputGeneralC');

                const rA = Formato.leerNumero(aInput.value);
                if (!rA.ok) return marcarErrorInput('inputGeneralA', 'Coeficiente A: ' + rA.error);

                const rB = Formato.leerNumero(bInput.value);
                if (!rB.ok) return marcarErrorInput('inputGeneralB', 'Coeficiente B: ' + rB.error);

                const rC = Formato.leerNumero(cInput.value);
                if (!rC.ok) return marcarErrorInput('inputGeneralC', 'Término C: ' + rC.error);

                resultado = Elipse.desdeFormaGeneral({
                    A: rA.valor,
                    B: rB.valor,
                    C: rC.valor
                });
            }
        } catch (err) {
            return mostrarError('Error en el cálculo algebraico: ' + err.message);
        }

        if (!resultado.ok) {
            return mostrarError(resultado.error);
        }

        window.elipseAnalizadaActual = resultado;
        mostrarResultados(resultado);
    }

    function mostrarResultados(res) {
        const elEcuacion = document.getElementById('ecuacionAnaliza');
        if (elEcuacion) elEcuacion.textContent = res.ecuacion;

        const elOrientacion = document.getElementById('orientacionAnaliza');
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
            
            const mensajeMati = res.orientacion === 'horizontal'
                ? 'Como el número más grande (' + Formato.formatearExacto(res.denX) + ') está debajo de X, ¡la elipse se estira horizontalmente! ↔'
                : 'Como el número más grande (' + Formato.formatearExacto(res.denY) + ') está debajo de Y, ¡la elipse se estira verticalmente! ↕';
            mostrarMensajeMati(mensajeMati);
        }

        // Mostrar procedimiento paso a paso si existe (en forma general)
        const cajaPasos = document.getElementById('cajaPasosAnaliza');
        if (cajaPasos) {
            if (res.pasos && res.pasos.length > 0) {
                cajaPasos.innerHTML = '<strong>📝 Procedimiento de Transformación a Forma Canónica:</strong><br><br>' + res.pasos.join('<br>');
                cajaPasos.style.display = 'block';
            } else {
                cajaPasos.innerHTML = '';
                cajaPasos.style.display = 'none';
            }
        }

        const panel = document.getElementById('panelResultadosAnaliza');
        if (panel) panel.style.display = 'block';

        if (graficador) {
            graficador.dibujar(res, obtenerToggles());
        }
    }

    function llenar(id, texto) {
        const el = document.getElementById(id);
        if (el) el.textContent = texto;
    }

    function obtenerToggles() {
        return {
            mostrarCentro: document.getElementById('chkCentroAnaliza')?.checked ?? true,
            mostrarFocos: document.getElementById('chkFocosAnaliza')?.checked ?? true,
            mostrarVertices: document.getElementById('chkVerticesAnaliza')?.checked ?? true,
            mostrarExtremosMenor: document.getElementById('chkExtremosAnaliza')?.checked ?? true,
            mostrarEjeFocal: document.getElementById('chkEjeFocalAnaliza')?.checked ?? true,
            mostrarLadoRecto: document.getElementById('chkLadoRectoAnaliza')?.checked ?? true
        };
    }

    function cargarEjemploPorIndice(idx) {
        if (idx < 0 || idx >= ejemplosAnaliza.length) return;
        indiceEjemplo = idx;
        const ej = ejemplosAnaliza[idx];

        limpiarErroresInputs();
        ocultarAlerta();

        if (ej.modo === 'canonica') {
            modoForma = 'canonica';
            document.getElementById('tabFormaCanonica')?.classList.add('seleccionado');
            document.getElementById('tabFormaGeneral')?.classList.remove('seleccionado');
            document.getElementById('seccionCanonica').style.display = 'block';
            document.getElementById('seccionGeneral').style.display = 'none';

            document.getElementById('inputAnalizaH').value = ej.h;
            document.getElementById('inputAnalizaK').value = ej.k;
            document.getElementById('inputAnalizaDenX').value = ej.denX;
            document.getElementById('inputAnalizaDenY').value = ej.denY;
        } else {
            modoForma = 'general';
            document.getElementById('tabFormaGeneral')?.classList.add('seleccionado');
            document.getElementById('tabFormaCanonica')?.classList.remove('seleccionado');
            document.getElementById('seccionCanonica').style.display = 'none';
            document.getElementById('seccionGeneral').style.display = 'block';

            document.getElementById('inputGeneralA').value = ej.A;
            document.getElementById('inputGeneralB').value = ej.B;
            document.getElementById('inputGeneralC').value = ej.C;
        }

        const sel = document.getElementById('selectEjemplosAnaliza');
        if (sel) sel.value = idx;

        procesarAnalisis();
        mostrarMensajeMati('Cargado el ' + ej.nombre + ': ' + ej.desc + ' 💡');
    }

    function cargarSiguienteEjemplo() {
        const prox = (indiceEjemplo + 1) % ejemplosAnaliza.length;
        cargarEjemploPorIndice(prox);
    }

    function restablecer() {
        limpiarErroresInputs();
        ocultarAlerta();
        cargarEjemploPorIndice(0);
        mostrarMensajeMati('Se restableció la actividad al Ejemplo 1. ¡Ingresa tus propios datos o prueba otro ejemplo! 🔄');
    }

    function mostrarError(msg) {
        const alerta = document.getElementById('alertaAnaliza');
        if (alerta) {
            alerta.className = 'caja-alerta error';
            alerta.innerHTML = '⚠️ <strong>Dato no válido:</strong> ' + msg;
            alerta.style.display = 'flex';
        }
        mostrarMensajeMati('¡Revisa el campo señalado en rojo! ' + msg);
    }

    function mostrarAlertaEspecial(msg) {
        const alerta = document.getElementById('alertaAnaliza');
        if (alerta) {
            alerta.className = 'caja-alerta info';
            alerta.innerHTML = '💡 <strong>Nota Especial:</strong> ' + msg;
            alerta.style.display = 'flex';
        }
    }

    function ocultarAlerta() {
        const alerta = document.getElementById('alertaAnaliza');
        if (alerta) alerta.style.display = 'none';
    }

    function mostrarMensajeMati(msg) {
        const globo = document.getElementById('globoMatiAnaliza');
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
        redibujar: redibujar,
        cargarEjemploPorIndice: cargarEjemploPorIndice,
        restablecer: restablecer
    };
})();

if (typeof self !== 'undefined') self.UIAnaliza = UIAnaliza;
