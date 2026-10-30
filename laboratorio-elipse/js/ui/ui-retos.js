/**
 * Laboratorio de la Elipse - Actividad 4: Retos de Mati
 * Valeria Hinestroza · Salomé Jiménez · Gabriela Muñoz
 * Mini-juego educativo con banco expandido de retos variados,
 * canvas dinámico, botón de pista, calificación con tolerancia, retroalimentación y estrellas.
 */

const UIRetos = (function () {
    'use strict';

    let graficador = null;
    const totalRonda = 8;
    let preguntaActual = 0;
    let estrellas = 0;
    let datosPregunta = null;

    function inicializar() {
        const canvas = document.getElementById('canvasRetos');
        if (!canvas) return;

        graficador = new Graficador(canvas, { fijaEscala: false });

        const btnResponder = document.getElementById('btnResponderReto');
        if (btnResponder) btnResponder.addEventListener('click', verificarRespuesta);

        const btnPista = document.getElementById('btnPistaReto');
        if (btnPista) btnPista.addEventListener('click', mostrarPista);

        const btnSiguiente = document.getElementById('btnSiguienteReto');
        if (btnSiguiente) btnSiguiente.addEventListener('click', avanzarPregunta);

        const btnReiniciar = document.getElementById('btnReiniciarRetos');
        if (btnReiniciar) btnReiniciar.addEventListener('click', iniciarJuego);

        const btnDiploma = document.getElementById('btnDescargarDiploma');
        if (btnDiploma) btnDiploma.addEventListener('click', descargarDiploma);

        const inputResp = document.getElementById('inputRespuestaReto');
        if (inputResp) {
            inputResp.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') verificarRespuesta();
            });
            inputResp.addEventListener('input', () => {
                inputResp.classList.remove('campo-error');
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

        const inputResp = document.getElementById('inputRespuestaReto');
        inputResp.value = '';
        inputResp.disabled = false;
        inputResp.classList.remove('campo-error');
        inputResp.focus();

        const btnResp = document.getElementById('btnResponderReto');
        if (btnResp) btnResp.style.display = 'inline-flex';
        const btnPista = document.getElementById('btnPistaReto');
        if (btnPista) btnPista.disabled = false;
        const btnSig = document.getElementById('btnSiguienteReto');
        if (btnSig) btnSig.style.display = 'none';

        const cajaRetro = document.getElementById('cajaRetroalimentacion');
        if (cajaRetro) cajaRetro.style.display = 'none';

        // Generar elipse didáctica con números limpios
        const h = aleatorioEntero(-4, 4);
        const k = aleatorioEntero(-4, 4);
        const esCirc = Math.random() < 0.12; // 12% de probabilidad de caso circunferencia

        let a, b;
        if (esCirc) {
            a = aleatorioEntero(3, 7);
            b = a;
        } else {
            const paresPitagoricos = [
                { a: 5, b: 4, c: 3 },
                { a: 5, b: 3, c: 4 },
                { a: 13, b: 5, c: 12 },
                { a: 13, b: 12, c: 5 },
                { a: 10, b: 8, c: 6 },
                { a: 10, b: 6, c: 8 },
                { a: 4, b: 2, c: Math.sqrt(12) },
                { a: 6, b: 2, c: Math.sqrt(32) }
            ];
            const sel = paresPitagoricos[aleatorioEntero(0, paresPitagoricos.length - 1)];
            a = sel.a;
            b = sel.b;
        }

        const orientacion = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        const elipse = Elipse.crearElipse({ h, k, a, b, orientacion });

        // Seleccionar tipo de reto entre 8 variantes didácticas
        const tipos = ['semiejeA', 'semiejeB', 'distanciaC', 'ladoRecto', 'excentricidad', 'orientacion', 'centroH', 'centroK'];
        const tipoPregunta = esCirc ? 'circunferencia' : tipos[(preguntaActual - 1) % tipos.length];

        datosPregunta = construirPreguntaSegunTipo(tipoPregunta, elipse);

        document.getElementById('textoPreguntaReto').innerHTML = datosPregunta.texto;
        document.getElementById('ecuacionReto').textContent = elipse.ecuacion;

        if (graficador) {
            graficador.dibujar(elipse, {
                mostrarCentro: true,
                mostrarFocos: true,
                mostrarVertices: true,
                mostrarExtremosMenor: true,
                mostrarEjeFocal: true,
                mostrarLadoRecto: tipoPregunta === 'ladoRecto'
            });
        }

        mostrarMensajeMati('Observa con atención la ecuación y la gráfica. ¡Tú puedes! 🧠');
    }

    function construirPreguntaSegunTipo(tipo, elipse) {
        let texto = '';
        let esperada = null;
        let solucion = '';
        let pista = '';

        switch (tipo) {
            case 'semiejeA':
                texto = '¿Cuánto mide el <strong>Semieje Mayor (a)</strong> de esta elipse?';
                esperada = elipse.a;
                pista = 'Recuerda que a² es el denominador MÁS GRANDE de la ecuación. a = √(denominador mayor).';
                solucion = 'El denominador mayor es ' + elipse.a2 + ', por lo tanto a = √' + elipse.a2 + ' = ' + Formato.formatearExacto(elipse.a) + '.';
                break;

            case 'semiejeB':
                texto = '¿Cuánto mide el <strong>Semieje Menor (b)</strong> de esta elipse?';
                esperada = elipse.b;
                pista = 'b² es el denominador MÁS PEQUEÑO de la ecuación. b = √(denominador menor).';
                solucion = 'El denominador menor es ' + elipse.b2 + ', por lo tanto b = √' + elipse.b2 + ' = ' + Formato.formatearExacto(elipse.b) + '.';
                break;

            case 'distanciaC':
                texto = '¿Cuál es la <strong>Distancia Focal (c)</strong> desde el centro a cualquiera de los focos?';
                esperada = elipse.c;
                pista = 'Usa la relación fundamental pitagórica: c = √(a² − b²).';
                solucion = 'c = √(a² − b²) = √(' + elipse.a2 + ' − ' + elipse.b2 + ') = √' + elipse.c2 + ' = ' + Formato.formatearExacto(elipse.c) + '.';
                break;

            case 'ladoRecto':
                texto = '¿Cuál es la longitud del <strong>Lado Recto (LR)</strong> de esta elipse?';
                esperada = elipse.ladoRecto;
                pista = 'La fórmula del lado recto es: LR = (2 · b²) / a.';
                solucion = 'LR = (2 · b²) / a = (2 · ' + elipse.b2 + ') / ' + elipse.a + ' = ' + (2 * elipse.b2) + '/' + elipse.a + ' = ' + Formato.formatearExacto(elipse.ladoRecto) + '.';
                break;

            case 'excentricidad':
                texto = '¿Cuál es la <strong>Excentricidad (e)</strong>? (Escribe el decimal con 2 o 3 cifras, ej. 0.6 o 0.75):';
                esperada = elipse.excentricidad;
                pista = 'La excentricidad se define como la razón e = c / a (mide qué tan achatada es la curva).';
                solucion = 'e = c / a = ' + Formato.formatearExacto(elipse.c) + ' / ' + elipse.a + ' ≈ ' + elipse.excentricidad.toFixed(4) + '.';
                break;

            case 'orientacion':
                texto = '¿Hacia qué eje se estira esta elipse? Escribe <strong>horizontal</strong> o <strong>vertical</strong>:';
                esperada = elipse.orientacion;
                pista = 'Mira debajo de qué variable está el denominador más grande. Si está bajo x es horizontal; si bajo y es vertical.';
                solucion = 'El número mayor (' + elipse.a2 + ') está bajo la variable ' + (elipse.orientacion === 'horizontal' ? 'x' : 'y') + ', por tanto la elipse es ' + elipse.orientacion + '.';
                break;

            case 'centroH':
                texto = '¿Cuál es la coordenada <strong>X del Centro (h)</strong>?';
                esperada = elipse.h;
                pista = 'En la ecuación (x − h)², el valor de h tiene signo opuesto al que ves dentro del paréntesis.';
                solucion = 'En el término de x vemos (x ' + (elipse.h >= 0 ? '− ' + elipse.h : '+ ' + Math.abs(elipse.h)) + ')², por lo que h = ' + elipse.h + '.';
                break;

            case 'centroK':
                texto = '¿Cuál es la coordenada <strong>Y del Centro (k)</strong>?';
                esperada = elipse.k;
                pista = 'En la ecuación (y − k)², el valor de k tiene signo opuesto al que ves dentro del paréntesis.';
                solucion = 'En el término de y vemos (y ' + (elipse.k >= 0 ? '− ' + elipse.k : '+ ' + Math.abs(elipse.k)) + ')², por lo que k = ' + elipse.k + '.';
                break;

            case 'circunferencia':
                texto = 'Observa los denominadores: ¡ambos son iguales (' + elipse.a2 + ')! ¿Cómo se llama este caso especial de la elipse?';
                esperada = 'circunferencia';
                pista = 'Cuando a = b y los focos se unen en el centro, la curva es perfectamente redonda.';
                solucion = 'Como a = b, la distancia c = 0 y la excentricidad e = 0: ¡es una Circunferencia!';
                break;

            default:
                texto = '¿Cuál es el valor del semieje mayor a?';
                esperada = elipse.a;
                pista = 'a = √(denominador mayor).';
                solucion = 'a = ' + elipse.a;
        }

        return { tipo, texto, esperada, solucion, pista, elipse };
    }

    function verificarRespuesta() {
        const inputResp = document.getElementById('inputRespuestaReto');
        const textoIngresado = inputResp.value.trim().toLowerCase();

        if (textoIngresado.length === 0) {
            inputResp.classList.add('campo-error');
            inputResp.focus();
            mostrarMensajeMati('¡Escribe tu respuesta antes de continuar! Puedes ingresar números, fracciones o texto 🙂');
            return;
        }

        inputResp.classList.remove('campo-error');
        let esCorrecto = false;

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
            const num = Formato.leerNumero(textoIngresado);
            if (num.ok) {
                const tolerancia = (datosPregunta.tipo === 'excentricidad') ? 0.03 : 0.15;
                if (Math.abs(num.valor - datosPregunta.esperada) <= tolerancia) {
                    esCorrecto = true;
                }
            }
        }

        // Mostrar retroalimentación
        const caja = document.getElementById('cajaRetroalimentacion');
        const titulo = document.getElementById('tituloRetroalimentacion');
        const textoSol = document.getElementById('solucionReto');

        if (caja) caja.style.display = 'block';

        const respuestaMostrar = (typeof datosPregunta.esperada === 'number')
            ? Formato.formatearExacto(datosPregunta.esperada)
            : datosPregunta.esperada;

        if (esCorrecto) {
            estrellas++;
            actualizarEstrellas();
            if (caja) caja.className = 'caja-alerta exito';
            if (titulo) {
                titulo.innerHTML = '🎉 ¡CORRECTO! ¡Excelente razonamiento!';
            }
            mostrarMensajeMati('¡Fantástico! Has ganado una estrella ⭐. ¡Sigue así!');
        } else {
            if (caja) caja.className = 'caja-alerta error';
            if (titulo) {
                titulo.innerHTML = '❌ ¡Casi! La respuesta correcta era: <strong>' + respuestaMostrar + '</strong>';
            }
            mostrarMensajeMati('No te preocupes, ¡de los errores se aprende! Revisa el paso a paso matemático 👇');
        }

        if (textoSol) {
            textoSol.innerHTML = '<strong>Explicación:</strong> ' + datosPregunta.solucion;
        } else if (caja && !titulo) {
            caja.innerHTML = (esCorrecto ? '🎉 ¡CORRECTO! ¡Excelente razonamiento!' : '❌ ¡Casi! La respuesta correcta era: <strong>' + respuestaMostrar + '</strong>') +
                '<br><br><strong>Explicación:</strong> ' + datosPregunta.solucion;
        }

        // Desactivar input y preparar botón siguiente
        inputResp.disabled = true;
        const btnResp = document.getElementById('btnResponderReto');
        if (btnResp) btnResp.style.display = 'none';
        const btnPista = document.getElementById('btnPistaReto');
        if (btnPista) btnPista.disabled = true;
        const btnSig = document.getElementById('btnSiguienteReto');
        if (btnSig) {
            btnSig.style.display = 'inline-flex';
            btnSig.focus();
        }
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
        const elEstrellas = document.getElementById('contadorEstrellas') || document.getElementById('estrellasRetos');
        if (elEstrellas) {
            elEstrellas.textContent = estrellas + ' / ' + totalRonda;
        }
    }

    function finalizarJuego() {
        const areaJuego = document.getElementById('areaJuegoRetos');
        if (areaJuego) areaJuego.style.display = 'none';
        const tarjetaFin = document.getElementById('tarjetaFinRetos');
        if (tarjetaFin) tarjetaFin.style.display = 'block';

        const elEstrellasFin = document.getElementById('estrellasFinales') || document.getElementById('estrellasFinRetos');
        const textoFelicitacion = document.getElementById('mensajeFinalMati') || document.getElementById('textoFelicitacionRetos');

        if (elEstrellasFin) {
            elEstrellasFin.textContent = '⭐'.repeat(estrellas) + ' (' + estrellas + ' de ' + totalRonda + ')';
        }

        let mensaje = '';
        if (estrellas === totalRonda) {
            mensaje = '🏆 ¡PERFECTO! ¡Puntaje perfecto de ' + totalRonda + '/' + totalRonda + '! Eres el Gran Maestro de las Elipses en la Feria STEAM+ 🚀';
        } else if (estrellas >= 6) {
            mensaje = '🎉 ¡Increíble! Lograste ' + estrellas + ' de ' + totalRonda + ' estrellas. Tienes un dominio excelente de las secciones cónicas.';
        } else if (estrellas >= 4) {
            mensaje = '👏 ¡Muy buen esfuerzo! Lograste ' + estrellas + ' de ' + totalRonda + ' estrellas. ¡Sigue practicando en el explorador!';
        } else {
            mensaje = '💪 ¡Buen comienzo! Lograste ' + estrellas + ' de ' + totalRonda + ' estrellas. Repasa con el modo "Explora la elipse" y vuelve a intentarlo.';
        }

        if (textoFelicitacion) textoFelicitacion.textContent = mensaje;
        mostrarMensajeMati(mensaje);
    }

    function mostrarMensajeMati(msg) {
        const globo = document.getElementById('globoMatiRetos');
        if (globo) globo.textContent = msg;
    }

    function descargarDiploma() {
        const inputNombre = document.getElementById('inputNombreDiploma');
        const nombre = (inputNombre && inputNombre.value.trim()) ? inputNombre.value.trim() : 'Visitante Distinguido de la Feria STEAM+';
        
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');

        // Fondo degradado elegante
        const grad = ctx.createRadialGradient(600, 400, 100, 600, 400, 700);
        grad.addColorStop(0, '#1e293b');
        grad.addColorStop(1, '#0a0f1d');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1200, 800);

        // Marco dorado de honor
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 6;
        ctx.strokeRect(40, 40, 1120, 720);

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.strokeRect(52, 52, 1096, 696);

        // Esquinas decorativas
        const esquinas = [[60, 60], [1140, 60], [60, 740], [1140, 740]];
        esquinas.forEach(eq => {
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath(); ctx.arc(eq[0], eq[1], 8, 0, Math.PI * 2); ctx.fill();
        });

        // Encabezados
        ctx.textAlign = 'center';
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('FERIA STEAM+ 2026 · GRADO DÉCIMO', 600, 110);

        ctx.fillStyle = '#f59e0b';
        ctx.font = '800 42px sans-serif';
        ctx.fillText('🏆 DIPLOMA DE EXCELENCIA MATEMÁTICA 🏆', 600, 175);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '22px sans-serif';
        ctx.fillText('El Laboratorio Matemático Interactivo de la Elipse certifica que:', 600, 240);

        // Nombre del evaluador / estudiante
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 46px sans-serif';
        ctx.fillText(nombre, 600, 320);

        // Línea dorada bajo el nombre
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(350, 345);
        ctx.lineTo(850, 345);
        ctx.stroke();

        // Texto de mérito
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '22px sans-serif';
        ctx.fillText('Ha completado la ronda de retos demostrando un dominio superior en Secciones Cónicas,', 600, 410);
        ctx.fillText('Geometría Analítica, deducción de ecuaciones canónicas y análisis gráfico.', 600, 445);

        // Puntaje de estrellas
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText('Puntaje Obtenido: ' + estrellas + ' de ' + totalRonda + ' Estrellas ⭐', 600, 520);

        // Firmas de las autoras
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('Valeria Hinestroza · Salomé Jiménez · Gabriela Muñoz', 600, 630);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '16px sans-serif';
        ctx.fillText('Comité Estudiantil de Desarrollo STEAM+ 2026 · Tecnología e Informática y Matemáticas', 600, 665);

        // Descarga automática en PNG
        const a = document.createElement('a');
        const nombreLimpio = nombre.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
        a.download = 'Diploma-STEAM-Elipse-' + (nombreLimpio || 'participante') + '.png';
        a.href = canvas.toDataURL('image/png');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
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
        inicializar,
        iniciarJuego,
        redibujar
    };
})();

if (typeof self !== 'undefined') self.UIRetos = UIRetos;
