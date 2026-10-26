# 🪐 Laboratorio de la Elipse - Feria STEAM+ 2026

**Proyecto Interactivo de Grado Décimo · Tecnología e Informática y Matemáticas**

Aplicación web educativa interactiva desarrollada en **HTML5, CSS3 y JavaScript Puro (Vanilla JS)** para explorar, analizar y construir elipses con centro en $(h, k)$, con la circunferencia como caso especial cuando $a = b$.

---

## 🌟 Características Principales

1. **🔭 Explora la Elipse:**
   * Controles deslizantes en tiempo real para $h, k, a, b$ y orientación.
   * Restricción pedagógica automática ($b \le a$).
   * Medidor interactivo de achatamiento y excentricidad ($e = c/a$) con diagnósticos intuitivos.
   * Comparador multielipse ($a^2 = 16$, $b^2 = 12, 9, 6, 2$) con 4 colores y tabla de excentricidades.
   * Casos de prueba clásicos del libro escolar.

2. **🧮 Analiza una Ecuación:**
   * Acepta forma canónica $\frac{(x-h)^2}{\text{denX}} + \frac{(y-k)^2}{\text{denY}} = 1$ y general $Ax^2 + By^2 = C$.
   * Admite enteros, decimales y fracciones simples (ej. `3/2`, `-1/2`).
   * Detección automática de orientación y caso especial de circunferencia.
   * Valores exactos (radicales simplificados como $2\sqrt{5}$) y aproximaciones decimales.

3. **🧩 Arma tu Elipse:**
   * Construcción paso a paso a partir de:
     * a) Centro y longitudes de los ejes.
     * b) Dos vértices del eje mayor y longitud del lado recto ($LR$).
     * c) Dos vértices del eje mayor y un extremo del eje menor.
   * Procedimiento matemático detallado con justificación analítica.

4. **🎯 Retos de Mati:**
   * Mini-juego con 8 preguntas aleatorias dinámicas generadas en vivo.
   * Pistas matemáticas contextuales, retroalimentación positiva y acumulación de estrellas ⭐.

---

## 🚀 Cómo Ejecutar la Aplicación

No requiere instalación, ni Node.js, ni servidores locales, ni conexión a Internet.
* **Doble clic en `laboratorio-elipse/index.html`** (o en el archivo raíz `index.html`) para abrir directamente en cualquier navegador moderno.

---

## 🧪 Pruebas Unitarias Automatizadas

* **En consola con Node.js:**
  ```bash
  node laboratorio-elipse/pruebas/pruebas.js
  ```
  *(98 aserciones ejecutadas y superadas al 100%)*
* **En el navegador:**
  * Abrir `laboratorio-elipse/pruebas/pruebas.html` para ver el reporte interactivo.

---

## 📚 Documentación Técnica Completa
En la carpeta [`laboratorio-elipse/docs/`](laboratorio-elipse/docs/):
* [`ficha-tecnica.md`](laboratorio-elipse/docs/ficha-tecnica.md)
* [`explicacion-matematica.md`](laboratorio-elipse/docs/explicacion-matematica.md)
* [`pseudocodigo.md`](laboratorio-elipse/docs/pseudocodigo.md)
* [`tabla-pruebas.md`](laboratorio-elipse/docs/tabla-pruebas.md)
* [`manual-de-uso.md`](laboratorio-elipse/docs/manual-de-uso.md)
* [`README.md`](laboratorio-elipse/docs/README.md)
