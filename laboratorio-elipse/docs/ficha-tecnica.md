# Ficha Técnica del Proyecto

## 1. Identificación del Proyecto
* **Nombre de la Aplicación:** Laboratorio de la Elipse (Laboratorio Matemático Interactivo)
* **Línea Temática STEAM+:** Explorador de Secciones Cónicas (Línea de la Elipse)
* **Nivel Académico:** Grado Décimo (10°)
* **Áreas Integradas:** Tecnología e Informática y Matemáticas
* **Evento:** Feria STEAM+ 2026
* **Fecha de Entrega:** 26 de octubre de 2026

## 2. Equipo de Trabajo (Estudiantes)
* **Integrante 1:** Valeria Hinestroza
* **Integrante 2:** Salomé Jiménez
* **Integrante 3:** Gabriela Muñoz
* **Grado:** Décimo (10°)
* **Asignaturas:** Tecnología e Informática y Matemáticas

## 3. Tecnologías y Arquitectura Técnica
* **Lenguajes:**
  * **HTML5:** Estructura semántica, accesibilidad y gráficos vectoriales SVG interactivos.
  * **CSS3 Moderno:** Flexbox, CSS Grid, variables CSS, animaciones con `@keyframes`, sombras y media query `@media (prefers-reduced-motion: reduce)`.
  * **JavaScript Vanilla (ES5 / ES6 Puro):** Sin dependencias, sin frameworks (React, Vue o Angular), sin librerías externas (Chart.js, D3, CanvasJS) y sin GeoGebra ni CDNs.
* **Renderizado Gráfico:** API de Canvas 2D nativa de HTML5 con escalado adaptativo para pantallas de alta densidad (HiDPI / Retina display).
* **Módulos Matemáticos:** Funciones puras desacopladas del DOM, empaquetadas con arquitectura UMD compatible tanto con navegadores web como con entornos de servidor (Node.js).

## 4. Requisitos y Compatibilidad
* **Mecanismo de Ejecución:** Doble clic directo sobre `index.html`. No requiere instalación previa, ni servidor local (Node/Apache/Python), ni conexión a Internet.
* **Navegadores Soportados:** Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera (versiones modernas).
* **Dispositivos:** Optimizado para computadores de escritorio, portátiles y tablets para interacción táctil en la feria.

## 5. Estructura de Directorios del Software
```text
laboratorio-elipse/
├── index.html                   (Aplicación web interactiva principal)
├── css/
│   ├── base.css                 (Tipografía, botones, paleta y layout)
│   ├── animaciones.css          (Fondo espacial, órbita planetaria, mascota Mati)
│   └── elipse.css               (Estilos de sliders, canvas, retículas y retos)
├── js/
│   ├── main.js                  (Navegación entre pantallas y mascota)
│   ├── graficador.js            (Renderizado en Canvas de cuadrícula, elipse y puntos)
│   ├── matematicas/
│   │   ├── elipse.js            (Lógica matemática pura de la elipse canónica)
│   │   └── formato.js           (Lectura de fracciones/decimales y simplificación)
│   └── ui/
│       ├── ui-explora.js        (Controlador de Actividad 1: Explora)
│       ├── ui-analiza.js        (Controlador de Actividad 2: Analiza)
│       ├── ui-arma.js           (Controlador de Actividad 3: Arma)
│       └── ui-retos.js          (Controlador de Actividad 4: Retos)
├── pruebas/
│   ├── pruebas.js               (Suite ejecutable en consola con Node.js)
│   └── pruebas.html             (Suite ejecutable en navegador con interfaz visual)
└── docs/
    ├── ficha-tecnica.md         (Este documento)
    ├── explicacion-matematica.md(Fundamentos y ejercicios resueltos a mano)
    ├── pseudocodigo.md          (Lógica de algoritmos y decisiones)
    ├── tabla-pruebas.md         (Matriz de casos de prueba y aceptación)
    ├── manual-de-uso.md         (Guía rápida para los visitantes)
    └── README.md                (Decisiones de diseño e informe general)
```
