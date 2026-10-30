# Laboratorio de la Elipse - Feria STEAM+ 2026

## 1. Resumen del Proyecto
El **Laboratorio de la Elipse** es una aplicación web interactiva desarrollada para la **Feria STEAM+ de Grado Décimo** en el área integrada de **Tecnología e Informática y Matemáticas**. Corresponde a la línea temática *"Explorador de secciones cónicas"*, enfocándose de manera integral en la **elipse con centro en $(h, k)$** y tratando la circunferencia como el caso especial límite cuando $a = b$.

La aplicación está diseñada pensando en los niños y jóvenes que visitan la feria, combinando una estética espacial atractiva, una mascota guía llamada **Mati**, controles interactivos en tiempo real, rigor matemático y accesibilidad universal.

---

## 2. Decisiones Técnicas y Pedagógicas Tomadas

1. **Arquitectura Vanilla Desacoplada (Sin Frameworks ni Librerías Externas):**
   * Se prescindió intencionalmente de frameworks (React, Vue) y librerías de gráficos (Chart.js, GeoGebra, D3) para garantizar que la aplicación funcione instantáneamente con **doble clic en `index.html`**, sin requerir conexión a internet ni servidores locales.
   * La lógica matemática pura se aisló en `js/matematicas/` (`elipse.js` y `formato.js`), libre de manipulación del DOM y empaquetada como UMD para ser 100% testeable en Node.js y en el navegador.

2. **Manejo Amable y Seguro de Errores (Sin Excepciones no Atrapadas):**
   * Todas las funciones matemáticas retornan un objeto estándar `{ ok: true, ...datos }` o `{ ok: false, error: "mensaje amable..." }`.
   * Los campos de entrada aceptan enteros, decimales con punto o coma, y fracciones simples (ej. `3/2`, `-1/2`). Si se detecta un dato inválido o una contradicción geométrica (como $b > a$ o división por cero), el sistema muestra una alerta clara y constructiva con sugerencias amigables de Mati.

3. **Corrección de Erratas y Rigor Matemático:**
   * En el libro de texto escolar de Grado 10 (pp. 195–196), en el Ejemplo 1 los extremos del eje menor aparecen con una errata en sus coordenadas. La aplicación implementa rigurosamente las fórmulas analíticas correctas: $B'(h, k - b)$ y $B(h, k + b)$ para elipses horizontales, y $B'(h - b, k)$ y $B(h + b, k)$ para verticales.
   * Se incorporó el algoritmo de simplificación de radicales exactos $\sqrt{N} = k\sqrt{m}$ (ej. $20 \to 2\sqrt{5}$) complementado con la aproximación decimal entre paréntesis para facilitar la comprensión tanto formal como intuitiva.

4. **Escalado Gráfico HiDPI en Canvas 2D:**
   * Se desarrolló un motor gráfico propio en Canvas con soporte para `devicePixelRatio`, asegurando trazos nítidos sin pixelado.
   * En el modo "Explora" se mantiene una escala fija $[-12, 12]$ para que el usuario aprecie el cambio de tamaño relativo, mientras que en los modos de análisis y resolución se activa una **autoescala dinámica centrada** que siempre incluye el origen $(0,0)$ y todos los elementos notables de la elipse.

5. **Accesibilidad y Reducción de Movimiento:**
   * Se implementó la media query `@media (prefers-reduced-motion: reduce)` en `animaciones.css`, desactivando transiciones, órbitas y efectos de titilado para usuarios que requieran una experiencia estática.
   * Todos los botones, campos de texto y controles cuentan con dimensiones táctiles generosas, contraste cromático WCAG AA y estados visibles de foco.

---

## 3. Guía de Ejecución y Pruebas

### Modo Usuario Final (Navegador):
* Abrir `laboratorio-elipse/index.html` con cualquier navegador web moderno (doble clic).

### Modo Pruebas Automatizadas (Consola / Node.js):
```bash
node pruebas/pruebas.js
```
* Ejecuta 111 aserciones unitarias cubriendo los ejemplos del libro, ejercicios complementarios, fracciones, radicales, invariantes y la propiedad focal del jardinero.

### Modo Pruebas Visuales (Navegador):
* Abrir `pruebas/pruebas.html` en el navegador para ver el informe gráfico de pruebas.
