/**
 * Laboratorio de la Elipse - Feria STEAM+
 * Controlador Principal: Navegación de pantallas, inicialización de módulos y mascota Mati
 */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    var pantallas = {
        bienvenida: document.getElementById('pantallaBienvenida'),
        menu: document.getElementById('pantallaMenu'),
        explora: document.getElementById('pantallaExplora'),
        analiza: document.getElementById('pantallaAnaliza'),
        arma: document.getElementById('pantallaArma'),
        retos: document.getElementById('pantallaRetos')
    };

    var inicializados = {
        explora: false,
        analiza: false,
        arma: false,
        retos: false
    };

    /**
     * Cambia la pantalla visible y ejecuta transiciones suaves.
     * @param {'bienvenida'|'menu'|'explora'|'analiza'|'arma'|'retos'} idDestino
     */
    function navegarA(idDestino) {
        Object.keys(pantallas).forEach(function (clave) {
            var el = pantallas[clave];
            if (el) {
                if (clave === idDestino) {
                    el.classList.add('activa');
                } else {
                    el.classList.remove('activa');
                }
            }
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Inicializar la actividad bajo demanda al entrar por primera vez
        if (idDestino === 'explora') {
            if (!inicializados.explora) {
                UIExplora.inicializar();
                inicializados.explora = true;
            } else {
                UIExplora.actualizar();
            }
        } else if (idDestino === 'analiza') {
            if (!inicializados.analiza) {
                UIAnaliza.inicializar();
                inicializados.analiza = true;
            }
        } else if (idDestino === 'arma') {
            if (!inicializados.arma) {
                UIArma.inicializar();
                inicializados.arma = true;
            }
        } else if (idDestino === 'retos') {
            if (!inicializados.retos) {
                UIRetos.inicializar();
                inicializados.retos = true;
            } else {
                UIRetos.iniciarJuego();
            }
        }
    }

    // 1. Botón "¡Empezar!" en Bienvenida
    var btnEmpezar = document.getElementById('btnEmpezar');
    if (btnEmpezar) {
        btnEmpezar.addEventListener('click', function () {
            navegarA('menu');
        });
    }

    // 2. Botón volver a Bienvenida desde el Menú
    var btnVolverBienvenida = document.getElementById('btnVolverBienvenida');
    if (btnVolverBienvenida) {
        btnVolverBienvenida.addEventListener('click', function () {
            navegarA('bienvenida');
        });
    }

    // 3. Tarjetas del Menú Principal
    var tarjetaExplora = document.getElementById('tarjetaExplora');
    if (tarjetaExplora) {
        tarjetaExplora.addEventListener('click', function () {
            navegarA('explora');
        });
    }

    var tarjetaAnaliza = document.getElementById('tarjetaAnaliza');
    if (tarjetaAnaliza) {
        tarjetaAnaliza.addEventListener('click', function () {
            navegarA('analiza');
        });
    }

    var tarjetaArma = document.getElementById('tarjetaArma');
    if (tarjetaArma) {
        tarjetaArma.addEventListener('click', function () {
            navegarA('arma');
        });
    }

    var tarjetaRetos = document.getElementById('tarjetaRetos');
    if (tarjetaRetos) {
        tarjetaRetos.addEventListener('click', function () {
            navegarA('retos');
        });
    }

    // 4. Botones "🏠 Volver al menú" en todas las actividades
    var botonesVolverMenu = document.querySelectorAll('.btn-volver-menu');
    botonesVolverMenu.forEach(function (btn) {
        btn.addEventListener('click', function () {
            navegarA('menu');
        });
    });

    // 5. Generar estrellas titilantes en el fondo cósmico de bienvenida
    generarEstrellasFondo();

    function generarEstrellasFondo() {
        var contenedor = document.getElementById('capaEstrellas');
        if (!contenedor) return;

        var numEstrellas = 60;
        for (var i = 0; i < numEstrellas; i++) {
            var estrella = document.createElement('div');
            estrella.className = 'estrella';
            var x = Math.random() * 100;
            var y = Math.random() * 100;
            var tam = Math.random() * 3 + 1.5;
            var retardo = Math.random() * 4;
            var duracion = Math.random() * 2 + 2;

            estrella.style.left = x + '%';
            estrella.style.top = y + '%';
            estrella.style.width = tam + 'px';
            estrella.style.height = tam + 'px';
            estrella.style.animationDelay = retardo + 's';
            estrella.style.animationDuration = duracion + 's';

            contenedor.appendChild(estrella);
        }
    }

    // Exponer función de navegación global si se requiere
    window.navegarA = navegarA;
});
