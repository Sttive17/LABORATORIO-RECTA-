/**
 * Laboratorio de la Elipse - Actividad 1: Explora la Elipse
 * Valeria Hinestroza · Salomé Jiménez · Gabriela Muñoz
 * Controlador interactivo en tiempo real con amplio banco de 10 ejemplos guiados,
 * sliders de alta precisión, medidor de achatamiento y modo comparativo limpio.
 */

var UIExplora = (function () {
    'use strict';

    var graficador = null;
    var enModoComparacion = false;
    var datosComparacionElipses = null;
    var coloresComparacion = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

    var estado = {
        h: 0,
        k: 0,
        a: 5,
        b: 3,
        orientacion: 'horizontal'
    };

    // Banco completo de 10 ejemplos pedagógicos y astronómicos
    var ejemplosLibro = [
        {
            nombre: 'Ejemplo 1 del libro (Horizontal)',
            h: 2, k: -3, a: 3, b: 2.24, orientacion: 'horizontal',
            desc: 'Centro (2, -3), a=3, b=√5≈2.24. Eje focal horizontal y=-3.'
        },
        {
            nombre: 'Ejemplo 2 del libro (Vertical)',
            h: -2, k: 5, a: 5, b: 4, orientacion: 'vertical',
            desc: 'Centro (-2, 5), a=5, b=4. Eje focal vertical x=-2.'
        },
        {
            nombre: 'Ejemplo 3 del libro (Vertical con LR)',
            h: 3, k: 2, a: 4, b: 3.46, orientacion: 'vertical',
            desc: 'Centro (3, 2), a=4, b=√12≈3.46. Lado recto LR=6.'
        },
        {
            nombre: 'Ejercicio 2a (Horizontal en el origen)',
            h: 0, k: 0, a: 6, b: 2, orientacion: 'horizontal',
            desc: 'Centro (0, 0), a=6, b=2, c=√32≈5.66. Ecuación: x²/36 + y²/4 = 1.'
        },
        {
            nombre: 'Ejercicio 2b (Vertical en (-2, -1))',
            h: -2, k: -1, a: 10, b: 5, orientacion: 'vertical',
            desc: 'Centro (-2, -1), a=10, b=5, c=√75≈8.66. Ecuación: (x+2)²/25 + (y+1)²/100 = 1.'
        },
        {
            nombre: 'Ejercicio 4a (Horizontal canónica)',
            h: 0, k: 0, a: 4, b: 3, orientacion: 'horizontal',
            desc: 'Centro (0, 0), a=4, b=3, c=√7≈2.65. Ecuación: x²/16 + y²/9 = 1.'
        },
        {
            nombre: 'Ejercicio 4b (Horizontal con Centro)',
            h: -1, k: 2, a: 4, b: 2, orientacion: 'horizontal',
            desc: 'Centro (-1, 2), a=4, b=2, c=√12≈3.46. Vértices (-5, 2) y (3, 2).'
        },
        {
            nombre: 'Caso Especial Circunferencia (a = b)',
            h: 0, k: 0, a: 4, b: 4, orientacion: 'horizontal',
            desc: 'Radio r=4, c=0, e=0. ¡Es una circunferencia perfecta!'
        },
        {
            nombre: 'Órbita Planetaria de la Tierra (Casi Circular)',
            h: 0, k: 0, a: 7, b: 6.9, orientacion: 'horizontal',
            desc: 'Poco achatada (e≈0.17). El Sol se ubica en uno de los focos.'
        },
        {
            nombre: 'Cometa Halley (Órbita Súper Achatada)',
            h: 0, k: 0, a: 9, b: 2.3, orientacion: 'horizontal',
            desc: 'Muy alargada (e≈0.967). Vértices lejanos y focos en los extremos.'
        }
    ];
    var indiceEjemplo = 0;

    function inicializar() {
        var canvas = document.getElementById('canvasExplora');
        if (!canvas) return;

        graficador = new Graficador(canvas, { fijaEscala: true, rangoFijo: 12 });

        // Enlazar eventos de sliders e inputs
        enlazarControl('sliderH', 'h');
        enlazarControl('sliderK', 'k');
        enlazarControl('sliderA', 'a');
        enlazarControl('sliderB', 'b');

        // Botones de orientación
        var btnHoriz = document.getElementById('btnOrientacionH');
        var btnVert = document.getElementById('btnOrientacionV');

        if (btnHoriz && btnVert) {
            btnHoriz.addEventListener('click', function () {
                if (enModoComparacion) salirModoComparacion(false);
                estado.orientacion = 'horizontal';
                btnHoriz.classList.add('seleccionado');
                btnVert.classList.remove('seleccionado');
                actualizar();
            });

            btnVert.addEventListener('click', function () {
                if (enModoComparacion) salirModoComparacion(false);
                estado.orientacion = 'vertical';
                btnVert.classList.add('seleccionado');
                btnHoriz.classList.remove('seleccionado');
                actualizar();
            });
        }

        // Toggles de elementos gráficos
        var toggles = ['chkCentro', 'chkFocos', 'chkVertices', 'chkExtremos', 'chkEjeFocal', 'chkLadoRecto'];
        toggles.forEach(function (id) {
            var el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', function () {
                    if (enModoComparacion && datosComparacionElipses) {
                        graficador.dibujarComparacion(datosComparacionElipses, coloresComparacion, obtenerToggles());
                    } else {
                        actualizarGrafica();
                    }
                });
            }
        });

        // Botón Comparar
        var btnComp = document.getElementById('btnCompararExplora');
        if (btnComp) {
            btnComp.addEventListener('click', ejecutarComparacion);
        }

        // Botón Salir de Comparación
        var btnSalirComp = document.getElementById('btnSalirComparacion');
        if (btnSalirComp) {
            btnSalirComp.addEventListener('click', function () {
                salirModoComparacion(true);
            });
        }

        // Botón Probar Ejemplo
        var btnEjemplo = document.getElementById('btnEjemploExplora');
        if (btnEjemplo) {
            btnEjemplo.addEventListener('click', cargarSiguienteEjemplo);
        }

        // Selector desplegable de ejemplos guiados
        var selEjemplos = document.getElementById('selectEjemplosExplora');
        if (selEjemplos) {
            selEjemplos.innerHTML = '';
            ejemplosLibro.forEach(function (ej, idx) {
                var opt = document.createElement('option');
                opt.value = idx;
                opt.textContent = (idx + 1) + '. ' + ej.nombre;
                selEjemplos.appendChild(opt);
            });
            selEjemplos.addEventListener('change', function () {
                cargarEjemploPorIndice(parseInt(selEjemplos.value, 10));
            });
        }

        actualizar();
    }

    function enlazarControl(idSlider, propiedad) {
        var slider = document.getElementById(idSlider);
        var badge = document.getElementById('val' + propiedad.toUpperCase());
        if (!slider) return;

        slider.addEventListener('input', function () {
            if (enModoComparacion) {
                salirModoComparacion(false);
            }

            var val = parseFloat(slider.value);
            estado[propiedad] = val;

            // Regla pedagógica: b nunca puede superar a a
            if (propiedad === 'b' && estado.b > estado.a) {
                estado.b = estado.a;
                slider.value = estado.a;
                mostrarMensajeMati('¡Ojo! "b" no puede ser mayor que "a". Cuando a = b la elipse se convierte en una circunferencia 😊');
            } else if (propiedad === 'a' && estado.a < estado.b) {
                estado.b = estado.a;
                var sliderB = document.getElementById('sliderB');
                if (sliderB) sliderB.value = estado.a;
                var badgeB = document.getElementById('valB');
                if (badgeB) badgeB.textContent = estado.a;
            }

            if (badge) badge.textContent = Number(estado[propiedad].toFixed(2));
            actualizar();
        });
    }

    function actualizar() {
        if (enModoComparacion) {
            return;
        }

        // Actualizar badges y sliders físicamente en pantalla
        ['h', 'k', 'a', 'b'].forEach(function (prop) {
            var badge = document.getElementById('val' + prop.toUpperCase());
            var slider = document.getElementById('slider' + prop.toUpperCase());
            if (badge) badge.textContent = Number(estado[prop].toFixed(2));
            if (slider && document.activeElement !== slider) slider.value = estado[prop];
        });

        var res = Elipse.crearElipse({
            h: estado.h,
            k: estado.k,
            a: estado.a,
            b: estado.b,
            orientacion: estado.orientacion
        });

        if (!res.ok) {
            mostrarMensajeMati('¡Ups! ' + res.error);
            return;
        }

        // Renderizar ecuación canónica
        var elEcuacion = document.getElementById('ecuacionExplora');
        if (elEcuacion) elEcuacion.textContent = res.ecuacion;

        // Renderizar propiedades
        llenarPropiedad('propCentro', Formato.formatearPunto(res.centro.x, res.centro.y));
        llenarPropiedad('propA', Formato.formatearExacto(res.a));
        llenarPropiedad('propB', Formato.formatearExacto(res.b));
        llenarPropiedad('propC', Formato.formatearExacto(res.c));
        llenarPropiedad('propEjeMayor', Formato.formatearExacto(res.ejeMayor));
        llenarPropiedad('propEjeMenor', Formato.formatearExacto(res.ejeMenor));
        llenarPropiedad('propLadoRecto', Formato.formatearExacto(res.ladoRecto));
        llenarPropiedad('propEjeFocal', res.ejeFocal.ecuacion);

        if (res.esCircunferencia) {
            llenarPropiedad('propFocos', 'Coinciden con el centro C');
            llenarPropiedad('propVertices', 'Todos los puntos a r=' + res.radio);
            llenarPropiedad('propExtremos', 'Igual al radio');
        } else {
            llenarPropiedad('propFocos', Formato.formatearPunto(res.focos[0].x, res.focos[0].y) + ' y ' + Formato.formatearPunto(res.focos[1].x, res.focos[1].y));
            llenarPropiedad('propVertices', Formato.formatearPunto(res.vertices[0].x, res.vertices[0].y) + ' y ' + Formato.formatearPunto(res.vertices[1].x, res.vertices[1].y));
            llenarPropiedad('propExtremos', Formato.formatearPunto(res.extremosMenor[0].x, res.extremosMenor[0].y) + ' y ' + Formato.formatearPunto(res.extremosMenor[1].x, res.extremosMenor[1].y));
        }

        // Medidor de achatamiento (Excentricidad)
        actualizarMedidor(res);

        // Ocultar banner y tabla de comparación si estaban visibles
        var bannerComp = document.getElementById('bannerModoComparacion');
        if (bannerComp) bannerComp.style.display = 'none';

        var contComp = document.getElementById('contenedorComparacion');
        if (contComp) contComp.style.display = 'none';

        actualizarGrafica(res);
    }

    function llenarPropiedad(id, texto) {
        var el = document.getElementById(id);
        if (el) el.textContent = texto;
    }

    function actualizarMedidor(res) {
        var barra = document.getElementById('barraAchatamiento');
        var textoVal = document.getElementById('valorExcentricidad');
        var textoDiag = document.getElementById('diagnosticoAchatamiento');

        var e = res.excentricidad;
        var porcentaje = Math.min(Math.max(e * 100, 0), 100);

        if (barra) barra.style.width = porcentaje + '%';
        if (textoVal) textoVal.textContent = 'e = ' + e.toFixed(4);

        var diagnostico = '';
        var colorFondo = '';

        if (res.esCircunferencia || e < 0.05) {
            diagnostico = '¡Es una circunferencia perfecta! (e = 0, c = 0)';
            colorFondo = '#10b981';
            mostrarMensajeMati('¡Mira! Como a = b, c se vuelve 0 y la elipse es redonda como una pizza 🍕');
        } else if (e < 0.3) {
            diagnostico = 'Casi redonda (poco achatada)';
            colorFondo = '#10b981';
            mostrarMensajeMati('Esta elipse tiene e < 0.3: es gordita y casi redonda como la Tierra 🌍');
        } else if (e <= 0.7) {
            diagnostico = 'Ovalada (achatamiento medio)';
            colorFondo = '#f59e0b';
            mostrarMensajeMati('Tiene forma ovalada clásica, ¡parecida a un huevito o balón de rugby! 🏉');
        } else {
            diagnostico = 'Bien achatada (muy alargada)';
            colorFondo = '#8b5cf6';
            mostrarMensajeMati('¡Guau! e > 0.7: como c está cerca de a, está muy aplastada como la órbita de un cometa ☄️');
        }

        if (textoDiag) {
            textoDiag.textContent = diagnostico;
            textoDiag.style.backgroundColor = colorFondo;
        }
    }

    function obtenerToggles() {
        return {
            mostrarCentro: document.getElementById('chkCentro') ? document.getElementById('chkCentro').checked : true,
            mostrarFocos: document.getElementById('chkFocos') ? document.getElementById('chkFocos').checked : true,
            mostrarVertices: document.getElementById('chkVertices') ? document.getElementById('chkVertices').checked : true,
            mostrarExtremosMenor: document.getElementById('chkExtremos') ? document.getElementById('chkExtremos').checked : true,
            mostrarEjeFocal: document.getElementById('chkEjeFocal') ? document.getElementById('chkEjeFocal').checked : true,
            mostrarLadoRecto: document.getElementById('chkLadoRecto') ? document.getElementById('chkLadoRecto').checked : true
        };
    }

    function actualizarGrafica(res) {
        if (!graficador) return;
        if (!res) {
            res = Elipse.crearElipse({
                h: estado.h,
                k: estado.k,
                a: estado.a,
                b: estado.b,
                orientacion: estado.orientacion
            });
        }
        graficador.dibujar(res, obtenerToggles());
    }

    function ejecutarComparacion() {
        enModoComparacion = true;
        var a2 = 16;
        var listaB2 = [12, 9, 6, 2];
        var listaElipses = [];

        listaB2.forEach(function (b2) {
            var el = Elipse.crearElipse({
                h: 0,
                k: 0,
                a: 4,
                b: Math.sqrt(b2),
                orientacion: 'horizontal'
            });
            listaElipses.push(el);
        });

        datosComparacionElipses = listaElipses;

        // Mostrar banner de modo comparación
        var bannerComp = document.getElementById('bannerModoComparacion');
        if (bannerComp) bannerComp.style.display = 'flex';

        // Actualizar caja de ecuación con aviso
        var elEcuacion = document.getElementById('ecuacionExplora');
        if (elEcuacion) {
            elEcuacion.innerHTML = '🔬 <strong>Modo Comparación de Excentricidades:</strong> a² = 16 constante · b² = 12, 9, 6, 2 variable';
        }

        if (graficador) {
            graficador.dibujarComparacion(listaElipses, coloresComparacion, obtenerToggles());
        }

        var contComp = document.getElementById('contenedorComparacion');
        var cuerpoTabla = document.getElementById('cuerpoTablaComparacion');
        if (contComp && cuerpoTabla) {
            cuerpoTabla.innerHTML = '';
            var compData = Elipse.compararExcentricidad(a2, listaB2);
            compData.comparaciones.forEach(function (c, idx) {
                var fila = document.createElement('tr');
                fila.innerHTML = '<td><span class="punto-color" style="background:' + coloresComparacion[idx] + '"></span>' + (idx + 1) + '</td>' +
                                 '<td>16</td>' +
                                 '<td>' + c.b2 + '</td>' +
                                 '<td>' + Formato.formatearExacto(c.c) + '</td>' +
                                 '<td><strong>' + c.e.toFixed(4) + '</strong></td>' +
                                 '<td>' + c.achatamiento + '</td>';
                cuerpoTabla.appendChild(fila);
            });
            contComp.style.display = 'block';
        }

        mostrarMensajeMati('¡Compara cómo al disminuir b² (el semieje menor), los focos se alejan del centro y la elipse se aplasta más y más! 🔬');
    }

    function salirModoComparacion(notificar) {
        if (!enModoComparacion) return;
        enModoComparacion = false;

        var bannerComp = document.getElementById('bannerModoComparacion');
        if (bannerComp) bannerComp.style.display = 'none';

        var contComp = document.getElementById('contenedorComparacion');
        if (contComp) contComp.style.display = 'none';

        actualizar();
        if (notificar !== false) {
            mostrarMensajeMati('Regresaste a tu elipse interactiva individual. ¡Mueve los controles para seguir explorando! 🔭');
        }
    }

    function cargarEjemploPorIndice(idx) {
        if (enModoComparacion) {
            salirModoComparacion(false);
        }
        if (idx < 0 || idx >= ejemplosLibro.length) return;
        indiceEjemplo = idx;

        var ej = ejemplosLibro[idx];
        estado.h = ej.h;
        estado.k = ej.k;
        estado.a = ej.a;
        estado.b = ej.b;
        estado.orientacion = ej.orientacion;

        var btnHoriz = document.getElementById('btnOrientacionH');
        var btnVert = document.getElementById('btnOrientacionV');
        if (btnHoriz && btnVert) {
            if (ej.orientacion === 'horizontal') {
                btnHoriz.classList.add('seleccionado');
                btnVert.classList.remove('seleccionado');
            } else {
                btnVert.classList.add('seleccionado');
                btnHoriz.classList.remove('seleccionado');
            }
        }

        var sH = document.getElementById('sliderH'); if (sH) sH.value = ej.h;
        var sK = document.getElementById('sliderK'); if (sK) sK.value = ej.k;
        var sA = document.getElementById('sliderA'); if (sA) sA.value = ej.a;
        var sB = document.getElementById('sliderB'); if (sB) sB.value = ej.b;

        var sel = document.getElementById('selectEjemplosExplora');
        if (sel) sel.value = idx;

        actualizar();
        mostrarMensajeMati('Cargado el ' + ej.nombre + ': ' + ej.desc);
    }

    function cargarSiguienteEjemplo() {
        var prox = (indiceEjemplo + 1) % ejemplosLibro.length;
        cargarEjemploPorIndice(prox);
    }

    function mostrarMensajeMati(msg) {
        var globo = document.getElementById('globoMatiExplora');
        if (globo) globo.textContent = msg;
    }

    return {
        inicializar: inicializar,
        actualizar: actualizar,
        redibujar: actualizar,
        cargarEjemploPorIndice: cargarEjemploPorIndice
    };
})();
