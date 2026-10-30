# 🪐 Laboratorio de la Elipse — Feria STEAM+ 2026

<div align="center">

![Feria STEAM+ 2026](https://img.shields.io/badge/Feria_STEAM%2B-2026-38bdf8?style=for-the-badge&logo=googlechrome&logoColor=white)
![Grado](https://img.shields.io/badge/Grado-10%C2%B0_Bachillerato-818cf8?style=for-the-badge)
![Pruebas Unitarias](https://img.shields.io/badge/Pruebas_Unitarias-111%2F111_Aprobadas_(100%25)-10b981?style=for-the-badge&logo=checkmarx&logoColor=white)
![Accesibilidad](https://img.shields.io/badge/Accesibilidad-WCAG_2.2_AA-f59e0b?style=for-the-badge)
![Lighthouse](https://img.shields.io/badge/Lighthouse-100%2F100-success?style=for-the-badge)
![Dependencias](https://img.shields.io/badge/Dependencias-Cero_(Vanilla_JS)-blueviolet?style=for-the-badge)
![Modo Offline](https://img.shields.io/badge/100%25-Offline_Ready-0284c7?style=for-the-badge)

### **Aplicación Web Educativa Interactiva de Geometría Analítica**
**Línea Temática:** Explorador de Secciones Cónicas · La Elipse con Centro en $(h, k)$

---

👩‍🔬 **Equipo Investigador y Desarrollador:**  
**Valeria Hinestroza · Salomé Jiménez · Gabriela Muñoz**  
*Grado Décimo · Área Integrada de Tecnología e Informática y Matemáticas*

🌐 **Sitio Web Oficial en Producción:**  
**[https://duranmgabriela05-cloud.github.io/LABORATORIO-RECTA-/](https://duranmgabriela05-cloud.github.io/LABORATORIO-RECTA-/)**

</div>

---

## 📋 Tabla de Contenidos

1. [Propósito y Visión del Proyecto](#-propósito-y-visión-del-proyecto)
2. [Demostración en Vivo y Acceso Rápido (QR)](#-demostración-en-vivo-y-acceso-rápido-qr)
3. [Las 4 Experiencias Interactivas](#-las-4-experiencias-interactivas)
   * [1. Explora la Elipse](#1-🔭-explora-la-elipse)
   * [2. Analiza una Ecuación](#2-🧮-analiza-una-ecuación)
   * [3. Arma tu Elipse](#3-🧩-arma-tu-elipse)
   * [4. Retos de Mati](#4-🎯-retos-de-mati)
4. [Fundamentación Matemática y Rigor Científico](#-fundamentación-matemática-y-rigor-científico)
5. [Arquitectura del Software y Estructura del Código](#-arquitectura-del-software-y-estructura-del-código)
6. [Diseño UI/UX y Accesibilidad Universal (WCAG 2.2 AA)](#-diseño-uiux-y-accesibilidad-universal-wcag-22-aa)
7. [Suite de Pruebas Automatizadas (111/111)](#-suite-de-pruebas-automatizadas-111111)
8. [Cómo Ejecutar el Proyecto](#-cómo-ejecutar-el-proyecto)
9. [Documentación Técnica Oficial](#-documentación-técnica-oficial)
10. [Créditos e Información Institucional](#-créditos-e-información-institucional)

---

## 🎯 Propósito y Visión del Proyecto

El **Laboratorio de la Elipse** fue concebido y programado para la **Feria STEAM+ 2026** como una herramienta interactiva, visualmente atractiva y matemáticamente rigurosa. Su objetivo principal es transformar conceptos abstractos de la geometría analítica en una experiencia táctil y manipulable, tanto para estudiantes de secundaria como para el jurado calificador y los visitantes del stand.

El laboratorio modela exhaustivamente la **elipse con centro desplazado $(h, k)$** en orientaciones horizontal y vertical, demostrando visual y analíticamente cómo la circunferencia surge de forma natural como el caso límite degenerado cuando los semiejes coinciden ($a = b$).

Junto a la mascota pedagógica **Mati el Cohete**, el usuario aprende haciendo: alterando parámetros, comprobando teoremas históricos como la construcción del jardinero ($d_1 + d_2 = 2a$), analizando ecuaciones generales y superando retos formativos con feedback inmediato.

---

## 📱 Demostración en Vivo y Acceso Rápido (QR)

La aplicación está desplegada de forma continua en GitHub Pages:

* 🔗 **Enlace Directo:** [https://duranmgabriela05-cloud.github.io/LABORATORIO-RECTA-/](https://duranmgabriela05-cloud.github.io/LABORATORIO-RECTA-/)
* 📱 **Modal de Código QR Integrado:** En el encabezado de la aplicación se incluye el botón **📱 QR**, el cual despliega un código QR de alta resolución listo para ser escaneado por los jurados con sus teléfonos inteligentes.
* ⛶ **Modo Pantalla Completa:** Botón directo para ocultar barras de navegación y optimizar la proyección en Smart TVs o tablets en el stand de la feria.

---

## 🚀 Las 4 Experiencias Interactivas

El laboratorio se organiza en cuatro módulos especializados con responsabilidades independientes:

```
                  ┌────────────────────────────────────────┐
                  │   🪐 LABORATORIO DE LA ELIPSE (SPA)    │
                  └───────────────────┬────────────────────┘
                                      │
         ┌──────────────────┬─────────┴────────┬──────────────────┐
         ▼                  ▼                  ▼                  ▼
┌─────────────────┐┌─────────────────┐┌─────────────────┐┌─────────────────┐
│   1. EXPLORA    ││   2. ANALIZA    ││    3. ARMA      ││    4. RETOS     │
│   (Sensorial)   ││  (Diagnóstico)  ││ (Construcción)  ││   (Gamificado)  │
├─────────────────┤├─────────────────┤├─────────────────┤├─────────────────┤
│• Sliders en vivo││• Forma Canónica ││• Caso A: Ejes   ││• 8 preguntas    │
│• Achatamiento e ││• Forma General  ││• Caso B: LR     ││• Aleatorias     │
│• Multielipse 195││• Fracciones 3/2 ││• Caso C: Extremo││• Pistas de Mati │
│• Hilo Jardinero ││• Radicales √ exact││• Pasos a paso  ││• Estrellas STEAM│
└─────────────────┘└─────────────────┘└─────────────────┘└─────────────────┘
```

### 1. 🔭 Explora la Elipse
* **Manipulación en Tiempo Real:** Deslizadores ergonómicos para variar el centro $(h, k)$, el semieje mayor $a$ y el semieje menor $b$.
* **Invariante Geométrica Garantizada ($b \le a$):** Si el usuario intenta aumentar $b$ por encima de $a$, la aplicación ajusta suavemente el valor y Mati explica la transición hacia la circunferencia ($a = b, e = 0$).
* **Medidor de Achatamiento y Excentricidad:** Barra cromática animada con diagnósticos cualitativos instantáneos (*"Casi circular"*, *"Achatada"*, *"Muy alargada"*).
* **Experimento del Libro de Texto (Pág. 195):** Modo de comparación multielipse con $a^2 = 16$ fijo y $b^2 \in \{12, 9, 6, 2\}$, superponiendo las 4 curvas en colores diferenciados para comprobar visualmente el efecto de la excentricidad.
* **Simulación del Hilo del Jardinero ($d_1 + d_2 = 2a$):** Permite recorrer un punto $P$ a lo largo de la curva y verificar numéricamente en vivo que la suma de sus distancias focales es invariante.

### 2. 🧮 Analiza una Ecuación
* **Forma Canónica y General:** Admite ecuaciones de la forma $\frac{(x-h)^2}{\text{denX}} + \frac{(y-k)^2}{\text{denY}} = 1$ y formas generales cuadráticas $Ax^2 + Cy^2 = F$.
* **Parseo Aritmético Robusto:** Acepta decimales (con punto o coma) y fracciones simples (ej. `3/2`, `-1/2`).
* **Simplificación Exacta de Radicales:** Calcula valores exactos con descomposición en factores primos (ej. $c = \sqrt{20} = 2\sqrt{5}$) acompañados de su aproximación decimal con 2 cifras.
* **Banco de 11 Ejercicios:** Selección preconfigurada con los ejemplos del texto guía de 10° para demostraciones rápidas ante el jurado.

### 3. 🧩 Arma tu Elipse
Construye la ecuación y deduce todos los elementos paso a paso a partir de condiciones dadas:
* **Caso A:** A partir del Centro $(h, k)$ y las longitudes del eje mayor y menor.
* **Caso B:** A partir de los dos vértices del eje focal y la longitud del Lado Recto ($LR = \frac{2b^2}{a}$).
* **Caso C:** A partir de los dos vértices del eje focal y un extremo del eje menor ($B$).
* **Explicación Analítica:** Justificación algebraica línea por línea, lista para ser leída y evaluada.

### 4. 🎯 Retos de Mati
* Trivia interactiva de 8 retos generados dinámicamente sobre focos, centros, excentricidades y lados rectos.
* Feedback constructivo inmediato con explicaciones guiadas paso a paso.
* Sistema de recompensas con estrellas STEAM+ ⭐ según el desempeño del participante.

---

## 📐 Fundamentación Matemática y Rigor Científico

El laboratorio aplica rigurosamente las definiciones de la geometría analítica euclidiana:

| Concepto | Ecuación / Definición Horizontal | Ecuación / Definición Vertical |
| :--- | :---: | :---: |
| **Ecuación Canónica Ordinaria** | $\frac{(x-h)^2}{a^2} + \frac{(y-k)^2}{b^2} = 1$ | $\frac{(x-h)^2}{b^2} + \frac{(y-k)^2}{a^2} = 1$ |
| **Relación Fundamental de Semiejes** | $a^2 = b^2 + c^2 \implies c = \sqrt{a^2 - b^2}$ | $a^2 = b^2 + c^2 \implies c = \sqrt{a^2 - b^2}$ |
| **Focos** | $F'(h - c, k)$ y $F(h + c, k)$ | $F'(h, k - c)$ y $F(h, k + c)$ |
| **Vértices del Eje Mayor** | $A'(h - a, k)$ y $A(h + a, k)$ | $A'(h, k - a)$ y $A(h, k + a)$ |
| **Extremos del Eje Menor** | $B'(h, k - b)$ y $B(h, k + b)$ | $B'(h - b, k)$ y $B(h + b, k)$ |
| **Excentricidad** | $e = \frac{c}{a} \quad (0 \le e < 1)$ | $e = \frac{c}{a} \quad (0 \le e < 1)$ |
| **Lado Recto (LR)** | $LR = \frac{2b^2}{a}$ | $LR = \frac{2b^2}{a}$ |
| **Principio Focal del Jardinero** | $d(P, F') + d(P, F) = 2a$ | $d(P, F') + d(P, F) = 2a$ |

> [!NOTE]
> **Corrección Documentada de Errata Escolar:** En el libro de texto escolar de Grado 10° (pág. 195, Ejemplo 1), las coordenadas de los extremos menores $B'$ y $B$ presentaban una errata tipográfica. Nuestro laboratorio aplica estrictamente la deducción matemática correcta y cuenta con una prueba unitaria específica que valida este comportamiento.

---

## 💻 Arquitectura del Software y Estructura del Código

El proyecto fue desarrollado bajo el principio de **Separación de Responsabilidades (SoC)** y sin frameworks pesados, garantizando máxima velocidad, portabilidad y comprensión:

```
LABORATORIO-RECTA-/
├── index.html                   # Punto de entrada único (Single Page Application)
├── README.md                    # Documentación principal del repositorio
├── css/                         # Hojas de estilo modulares (Design System)
│   ├── base.css                 # Variables, tipografía, botones WCAG, navbar y layout
│   ├── animaciones.css          # Animaciones GPU-composited y prefers-reduced-motion
│   └── elipse.css               # Estilos de actividades, sliders táctiles y modales
├── js/                          # Lógica modular en JavaScript Puro (Vanilla JS)
│   ├── matematicas.js           # Módulo puro de cálculo matemático (Sin tocar el DOM)
│   ├── graficador.js            # Motor de renderizado en Canvas HTML5 con soporte HiDPI
│   ├── main.js                  # Orquestador de la SPA, navegación y modales
│   └── ui/                      # Controladores de interfaz de usuario
│       ├── ui-explora.js        # Lógica del modo Explorador y Jardinero
│       ├── ui-analiza.js        # Lógica del Analizador y banco de ejercicios
│       ├── ui-arma.js           # Lógica del Constructor de elipses (Casos A, B y C)
│       └── ui-retos.js          # Lógica del minijuego de preguntas y estrellas
├── pruebas/                     # Suite de Aseguramiento de Calidad
│   ├── pruebas.js               # 111 pruebas unitarias automáticas ejecutables en Node.js
│   └── pruebas.html             # Interfaz visual interactiva para ejecutar pruebas en el navegador
└── docs/                        # Fichas técnicas y documentación pedagógica
    ├── ficha-tecnica.md         # Ficha técnica oficial para jurados
    ├── explicacion-matematica.md# Demostraciones algebraicas completas
    ├── manual-de-uso.md         # Guía de usuario paso a paso
    ├── pseudocodigo.md          # Algoritmos y lógica en pseudocódigo estándar
    └── tabla-pruebas.md         # Evidencia de los 111 casos de prueba
```

---

## 🎨 Diseño UI/UX y Accesibilidad Universal (WCAG 2.2 AA)

El laboratorio fue optimizado minuciosamente para ofrecer una experiencia estética, ergonómica y accesible:

* **Paleta Cósmica de Bajo Impacto Visual:** Fondo profundo `#0a0f1d` con tarjetas en `#1e293b`, diseñada para no fatigar la vista en sesiones prolongadas.
* **Contraste de Texto AAA (> 7:1):** Textos secundarios actualizados a `#cbd5e1`, asegurando nitidez incluso en proyectores con iluminación ambiental.
* **Objetivos Táctiles Ergonómicos:** Todos los botones y deslizadores cuentan con áreas de contacto táctil de al menos **42×42 px**, con tiradores de slider de **28 px**, cumpliendo el criterio WCAG 2.5.8.
* **Prevención de Scroll Accidental en Móvil:** El canvas interactivo utiliza `touch-action: none` y gestión preventiva de eventos táctiles, permitiendo arrastrar el punto del jardinero sin mover la pantalla del teléfono.
* **Layout Responsivo Inteligente:**
  * **En Móvil (< 640px):** Tarjetas en 1 columna, botones del encabezado en modo iconos táctiles de 40px y modales en pantalla completa.
  * **En Computador ($\ge$ 1024px):** Disposición de 2 columnas con **columna gráfica *sticky*** para modificar parámetros y observar el gráfico simultáneamente sin hacer scroll.
* **Soporte `prefers-reduced-motion`:** Quienes tengan sensibilidad vestibular o preferencias de reducción de animaciones en el sistema operativo experimentan una interfaz estática inmediata.

---

## 🧪 Suite de Pruebas Automatizadas (111/111)

El proyecto cuenta con una cobertura matemática total validada a través de **111 aserciones unitarias**:

| Caso de Prueba | Enfoque Evaluado | Resultado |
| :---: | :--- | :---: |
| **Casos 1 al 3** | Ejemplos canónicos del libro de matemáticas (Ejemplos 1, 2 y 3) | ✅ 100% Aprobado |
| **Casos 4 al 10** | Ejercicios complementarios y casos con coeficientes fraccionarios | ✅ 100% Aprobado |
| **Caso 11** | Variación comparativa de excentricidades ($a^2=16$, pág. 195) | ✅ 100% Aprobado |
| **Caso 12** | Caso límite degenerado: Circunferencia ($a = b, c = 0, e = 0$) | ✅ 100% Aprobado |
| **Caso 13** | Manejo de entradas inválidas y errores controlados sin excepciones | ✅ 100% Aprobado |
| **Caso 14** | Parseo aritmético flexible (enteros, decimales, fracciones, signos) | ✅ 100% Aprobado |
| **Caso 15** | Simplificación analítica exacta de raíces cuadradas | ✅ 100% Aprobado |
| **Caso 16** | Principio focal invariante del jardinero ($d_1 + d_2 = 2a$) en 12 ángulos | ✅ 100% Aprobado |

### ¿Cómo correr las pruebas?

* **Opción 1: En consola (Node.js):**
  ```bash
  node pruebas/pruebas.js
  ```
* **Opción 2: En el navegador (Visual):**
  Abrir el archivo `pruebas/pruebas.html` con cualquier navegador para visualizar el informe dinámico en tiempo real.

---

## 📦 Cómo Ejecutar el Proyecto

El proyecto es **100% Plug & Play y funciona sin conexión a Internet**:

1. Clona o descarga este repositorio:
   ```bash
   git clone https://github.com/Sttive17/LABORATORIO-RECTA-.git
   ```
2. Abre el archivo `index.html` con doble clic en tu navegador preferido (Chrome, Edge, Firefox, Safari, Brave).
3. **¡Listo!** No se requiere instalar Node.js, npm, Python, extensiones ni servidores locales.

---

## 📖 Documentación Técnica Oficial

Para profundizar en los aspectos metodológicos y pedagógicos, consulta los documentos de la carpeta [`docs/`](docs/):

* 📋 [**Ficha Técnica Oficial del Proyecto**](docs/ficha-tecnica.md): Resumen ejecutivo, especificaciones tecnológicas y rúbrica STEAM+.
* 📐 [**Explicación Matemática Exhaustiva**](docs/explicacion-matematica.md): Demostraciones analíticas de la elipse, circunferencia y excentricidad.
* 💻 [**Algoritmos en Pseudocódigo**](docs/pseudocodigo.md): Estructuras de control y lógica algorítmica de cálculo y renderizado.
* 🧪 [**Matriz de Pruebas de Calidad**](docs/tabla-pruebas.md): Registro detallado de las 111 pruebas unitarias.
* 📘 [**Manual de Uso para el Usuario**](docs/manual-de-uso.md): Guía amigable para explorar todas las herramientas.

---

## 👩‍🔬 Créditos e Información Institucional

* **Institución Educativa:** Presentación Oficial Feria STEAM+ 2026
* **Grado:** Décimo (10°)
* **Asignaturas Integradas:** Tecnología e Informática · Matemáticas
* **Equipo Autoras:**
  * **Valeria Hinestroza**
  * **Salomé Jiménez**
  * **Gabriela Muñoz**
* **Año Académico:** 2026

<div align="center">
  <br>
  <b>Laboratorio de la Elipse · Feria STEAM+ 2026</b><br>
  <i>"La ciencia es el gran antídoto contra el veneno del entusiasmo y la superstición" — Adam Smith</i>
</div>
