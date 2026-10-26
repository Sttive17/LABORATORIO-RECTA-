/**
 * Laboratorio de la Elipse - Actividad 4: Retos de Mati
 * Valeria Hinestroza · Salomé Jiménez · Gabriela Muñoz
 * Mini-juego educativo con banco expandido de retos variados,
 * canvas dinámico, botón de pista, calificación con tolerancia, retroalimentación y estrellas.
 */

var UIRetos = (function () {
    'use strict';

    var graficador = null;
    var totalRonda = 8;
    var preguntaActual = 0;
    var estrellas = 0;
    var datosPregunta = null;

    function inicializar() {
        var canvas = document.getElementById('canvasRetos');
        if (!canvas) return;

        graficador = new Graficador(canvas, { fijaEscala: false });

        var btnResponder = document.getElementById('btnResponderReto');
        if (btnResponder) btnResponder.addEventListener('click', verificarRespuesta);

        var btnPista = document.getElementById('btnPistaReto');
        if (btnPista) btnPista.addEventListener('click', mostrarPista);

        var btnSiguiente = document.getElementById('btnSiguienteReto');
        if (btnSiguiente) btnSiguiente.addEventListener('click', avanzarPregunta);

        var btnReiniciar = document.getElementById('btnReiniciarRetos');
        if (btnReiniciar) btnReiniciar.addEventListener('click', iniciarJuego);

        var inputResp = document.getElementById('inputRespuestaReto');
        if (inputResp) {
            inputResp.addEventListener('keyup', function (e) {
                if (e.key === 'Enter') verificarRespuesta();
            });
        }

        iniciarJuego();
    }

    function iniciarJuego() {
        preguntaActual = 0;
        estrellas = 0;
        actualizarEstrellas();
        document.getElementById('tarjetaFinRetos').style.display = 'none';
        document.getElementById('areaJuegoRetos').style.display = 'grid';
        generarPregunta();
    }

    function aleatorioEntero(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generarPregunta() {
        preguntaActual++;
        document.getElementById('numeroPreguntaActual').textContent = preguntaActual;
        document.getElementById('totalPreguntas').textContent = totalRonda;

        // Limpiar controles
        var inputResp = document.getElementById('inputRespuestaReto');
        inputResp.value = '';
        inputResp.disabled = false;
        inputResp.focus();

        document.getElementById('btnResponderReto').style.display = 'inline-flex';
        document.getElementById('btnSiguienteReto').style.display = 'none';
        document.getElementById('btnPistaReto').disabled = false;
        document.getElementById('cajaRetroalimentacion').style.display = 'none';

        // 1. Generar elipse aleatoria válida
        var h = aleatorioEntero(-5, 5);
        var k = aleatorioEntero(-5, 5);
        var a = aleatorioEntero(3, 8);
        var b = aleatorioEntero(2, a - 1);
        var orientacion = Math.random() < 0.5 ? 'horizontal' : 'vertical';

        var elipse = Elipse.crearElipse({
            h: h,
            k: k,
            a: a,
            b: b,
            orientacion: orientacion
        });

        // 2. Elegir tipo de pregunta de un banco amplio (12 tipos)
        var tipos = [
            'a', 'b', 'c', 'ejeMayor', 'ejeMenor', 'distanciaFocos',
            'ladoRecto', 'excentricidad', 'orientacion', 'centroH', 'centroK', 'circunferencia'
        ];
        var tipo = tipos[aleatorioEntero(0, tipos.length - 1)];

        var textoPregunta = '';
        var respuestaEsperada = null;
        var pista = '';
        var solucionPasoAPaso = '';

        if (tipo === 'a') {
            textoPregunta = '¿Cuánto mide el semieje mayor "a" de esta elipse?';
            respuestaEsperada = a;
            pista = 'Recuerda que "a" es la distancia desde el centro C hasta cualquiera de los dos vértices principales A o A\'.';
            solucionPasoAPaso = 'El semieje mayor a = ' + a + ' (la distancia del centro (' + h + ', ' + k + ') a los vértices).';
        } else if (tipo === 'b') {
            textoPregunta = '¿Cuánto mide el semieje menor "b" de esta elipse?';
            respuestaEsperada = b;
            pista = '"b" es la distancia desde el centro C hasta los extremos B o B\' del eje menor.';
            solucionPasoAPaso = 'El semieje menor b = ' + b + '.';
        } else if (tipo === 'c') {
            textoPregunta = '¿Cuál es la distancia focal "c"? (Puedes escribir decimal o fracción)';
            respuestaEsperada = elipse.c;
            pista = 'Usa la relación fundamental: a² = b² + c²  ⟹  c = √(a² − b²).';
            solucionPasoAPaso = 'c = √(a² − b²) = √(' + (a * a) + ' − ' + (b * b) + ') = √' + (a * a - b * b) + ' ≈ ' + elipse.c.toFixed(4) + '.';
        } else if (tipo === 'ejeMayor') {
            textoPregunta = '¿Cuál es la longitud total del Eje Mayor (2a)?';
            respuestaEsperada = 2 * a;
            pista = 'El eje mayor completo va de vértice a vértice: longitud = 2 · a.';
            solucionPasoAPaso = 'Eje Mayor = 2 · a = 2 · ' + a + ' = ' + (2 * a) + '.';
        } else if (tipo === 'ejeMenor') {
            textoPregunta = '¿Cuál es la longitud total del Eje Menor (2b)?';
            respuestaEsperada = 2 * b;
            pista = 'El eje menor completo es el doble del semieje b: longitud = 2 · b.';
            solucionPasoAPaso = 'Eje Menor = 2 · b = 2 · ' + b + ' = ' + (2 * b) + '.';
        } else if (tipo === 'distanciaFocos') {
            textoPregunta = '¿Cuál es la distancia total entre los dos focos F y F\' (2c)?';
            respuestaEsperada = 2 * elipse.c;
            pista = 'La distancia interfocal completa es el doble de la distancia focal c: 2 · c.';
            solucionPasoAPaso = 'Distancia entre focos = 2 · c = 2 · ' + elipse.c.toFixed(4) + ' ≈ ' + (2 * elipse.c).toFixed(4) + '.';
        } else if (tipo === 'ladoRecto') {
            textoPregunta = '¿Cuánto mide el Lado Recto (LR)?';
            respuestaEsperada = elipse.ladoRecto;
            pista = 'La fórmula del lado recto en el libro es: LR = 2b² / a.';
            solucionPasoAPaso = 'LR = 2b² / a = (2 · ' + (b * b) + ') / ' + a + ' = ' + (2 * b * b) + '/' + a + ' ≈ ' + elipse.ladoRecto.toFixed(4) + '.';
        } else if (tipo === 'excentricidad') {
            textoPregunta = '¿Cuál es la excentricidad "e" de esta elipse? (Tolerancia ±0.02)';
            respuestaEsperada = elipse.excentricidad;
            pista = 'La excentricidad mide el achatamiento: e = c / a. Siempre está entre 0 y 1.';
            solucionPasoAPaso = 'e = c / a = ' + elipse.c.toFixed(4) + ' / ' + a + ' ≈ ' + elipse.excentricidad.toFixed(4) + '.';
        } else if (tipo === 'orientacion') {
            textoPregunta = '¿La elipse es horizontal o vertical? (Escribe "horizontal" o "vertical")';
            respuestaEsperada = orientacion;
            pista = 'Mira hacia dónde está más estirada o alargada: ¿a lo largo del eje X o del eje Y?';
            solucionPasoAPaso = 'La elipse es ' + orientacion + ' porque su semieje mayor "a" está alineado con el eje ' + (orientacion === 'horizontal' ? 'X' : 'Y') + '.';
        } else if (tipo === 'centroH') {
            textoPregunta = '¿Cuál es la coordenada X (h) del centro de esta elipse?';
            respuestaEsperada = h;
            pista = 'Observa el centro C(h, k) o mira el término (x − h)² en la ecuación.';
            solucionPasoAPaso = 'El centro es C(' + h + ', ' + k + '), por lo que h = ' + h + '.';
        } else if (tipo === 'centroK') {
            textoPregunta = '¿Cuál es la coordenada Y (k) del centro de esta elipse?';
            respuestaEsperada = k;
            pista = 'Observa el centro C(h, k) o mira el término (y − k)² en la ecuación.';
            solucionPasoAPaso = 'El centro es C(' + h + ', ' + k + '), por lo que k = ' + k + '.';
        } else if (tipo === 'circunferencia') {
            textoPregunta = 'Si en una elipse se cumple que a = b, ¿en qué figura geométrica especial se convierte?';
            respuestaEsperada = 'circunferencia';
            pista = 'Cuando los dos semiejes son exactamente iguales (a = b), la distancia focal c se hace 0 y la figura es redonda.';
            solucionPasoAPaso = 'Cuando a = b, la excentricidad es e = 0 y la elipse se convierte en una circunferencia.';
        }

        datosPregunta = {
            elipse: elipse,
            tipo: tipo,
            texto: textoPregunta,
            esperada: respuestaEsperada,
            pista: pista,
            solucion: solucionPasoAPaso
        };

        document.getElementById('textoPreguntaReto').textContent = textoPregunta;
        document.getElementById('ecuacionReto').textContent = elipse.ecuacion;

        // Dibujar en el canvas
        graficador.dibujar(elipse, {
            mostrarCentro: true,
            mostrarFocos: true,
            mostrarVertices: true,
            mostrarExtremosMenor: true,
            mostrarEjeFocal: true,
            mostrarLadoRecto: tipo === 'ladoRecto'
        });

        mostrarMensajeMati('¡Reto ' + preguntaActual + ' de ' + totalRonda + '! Analiza la gráfica y la ecuación con atención 🧠');
    }

    function verificarRespuesta() {
        var inputResp = document.getElementById('inputRespuestaReto');
        var textoIngresado = inputResp.value.trim().toLowerCase();

        if (textoIngresado.length === 0) {
            mostrarMensajeMati('¡Escribe tu respuesta antes de continuar! Puedes ingresar números, fracciones o texto según la pregunta 🙂');
            return;
        }

        var esCorrecto = false;

        if (datosPregunta.tipo === 'orientacion') {
            if (textoIngresado === datosPregunta.esperada ||
                (datosPregunta.esperada === 'horizontal' && (textoIngresado === 'h' || textoIngresado === 'x')) ||
                (datosPregunta.esperada === 'vertical' && (textoIngresado === 'v' || textoIngresado === 'y'))) {
                esCorrecto = true;
            }
        } else if (datosPregunta.tipo === 'circunferencia') {
            if (textoIngresado.indexOf('circunfer') !== -1 || textoIngresado.indexOf('circul') !== -1) {
                esCorrecto = true;
            }
        } else {
            var num = Formato.leerNumero(textoIngresado);
            if (num.ok) {
                var tolerancia = (datosPregunta.tipo === 'excentricidad') ? 0.03 : 0.15;
                if (Math.abs(num.valor - datosPregunta.esperada) <= tolerancia) {
                    esCorrecto = true;
                }
            }
        }

        // Mostrar retroalimentación
        var caja = document.getElementById('cajaRetroalimentacion');
        var titulo = document.getElementById('tituloRetroalimentacion');
        var textoSol = document.getElementById('solucionReto');

        caja.style.display = 'block';

        if (esCorrecto) {
            estrellas++;
            actualizarEstrellas();
            caja.className = 'caja-alerta exito';
            titulo.innerHTML = '🎉 ¡CORRECTO! ¡Excelente razonamiento!';
            mostrarMensajeMati('¡Fantástico! Has ganado una estrella ⭐. ¡Sigue así!');
        } else {
            caja.className = 'caja-alerta error';
            var respuestaMostrar = (typeof datosPregunta.esperada === 'number')
                ? Formato.formatearExacto(datosPregunta.esperada)
                : datosPregunta.esperada;
            titulo.innerHTML = '❌ ¡Casi! La respuesta correcta era: <strong>' + respuestaMostrar + '</strong>';
            mostrarMensajeMati('No te preocupes, ¡de los errores se aprende! Revisa el paso a paso matemático 👇');
        }

        textoSol.innerHTML = '<strong>Explicación:</strong> ' + datosPregunta.solucion;

        // Desactivar input y preparar botón siguiente
        inputResp.disabled = true;
        document.getElementById('btnResponderReto').style.display = 'none';
        document.getElementById('btnPistaReto').disabled = true;
        document.getElementById('btnSiguienteReto').style.display = 'inline-flex';
        document.getElementById('btnSiguienteReto').focus();
    }

    function mostrarPista() {
        if (!datosPregunta) return;
        mostrarMensajeMati('💡 Pista de Mati: ' + datosPregunta.pista);
    }

    function avanzarPregunta() {
        if (preguntaActual >= totalRonda) {
            finalizarJuego();
        } else {
            generarPregunta();
        }
    }

    function actualizarEstrellas() {
        var elEstrellas = document.getElementById('estrellasRetos');
        if (elEstrellas) {
            elEstrellas.textContent = '⭐ ' + estrellas;
        }
    }

    function finalizarJuego() {
        document.getElementById('areaJuegoRetos').style.display = 'none';
        document.getElementById('tarjetaFinRetos').style.display = 'block';

        var elEstrellasFin = document.getElementById('estrellasFinRetos');
        var textoFelicitacion = document.getElementById('textoFelicitacionRetos');

        if (elEstrellasFin) {
            elEstrellasFin.textContent = '⭐'.repeat(estrellas) + ' (' + estrellas + ' de ' + totalRonda + ')';
        }

        var mensaje = '';
        if (estrellas === totalRonda) {
            mensaje = '🏆 ¡PERFECTO! ¡Puntaje perfecto de 8/8! Eres el Gran Maestro de las Elipses en la Feria STEAM+ 🚀';
        } else if (estrellas >= 6) {
            mensaje = '🎉 ¡Increíble! Lograste ' + estrellas + ' estrellas. Tienes un dominio excelente de las secciones cónicas.';
        } else if (estrellas >= 4) {
            mensaje = '👏 ¡Muy buen esfuerzo! Lograste ' + estrellas + ' estrellas. ¡Sigue practicando en el explorador!';
        } else {
            mensaje = '💪 ¡Buen comienzo! Lograste ' + estrellas + ' estrellas. Repasa con el modo "Explora la elipse" y vuelve a intentarlo.';
        }

        if (textoFelicitacion) textoFelicitacion.textContent = mensaje;
        mostrarMensajeMati(mensaje);
    }

    function mostrarMensajeMati(msg) {
        var globo = document.getElementById('globoMatiRetos');
        if (globo) globo.textContent = msg;
    }

    function redibujar() {
        if (graficador && datosPregunta && datosPregunta.elipse) {
            graficador.dibujar(datosPregunta.elipse, {
                mostrarCentro: true,
                mostrarFocos: true,
                mostrarVertices: true,
                mostrarExtremosMenor: true,
                mostrarEjeFocal: true,
                mostrarLadoRecto: datosPregunta.tipo === 'ladoRecto'
            });
        }
    }

    return {
        inicializar: inicializar,
        iniciarJuego: iniciarJuego,
        redibujar: redibujar
    };
})();
