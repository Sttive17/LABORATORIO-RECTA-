# Explicación Matemática: La Elipse Canónica con Centro en $(h, k)$

## 1. Definición Geométrica y Dominio
Una **elipse** es el lugar geométrico de todos los puntos $P(x, y)$ del plano cartesiano tales que la suma de sus distancias a dos puntos fijos llamados **focos** ($F'$ y $F$) es constante e igual a $2a$:
$$d(P, F') + d(P, F) = 2a$$

### Variables y Condiciones Fundamentales:
* **Centro $C(h, k)$:** Punto medio del segmento que une los dos focos y los dos vértices.
* **Semieje mayor ($a$):** Distancia desde el centro a cualquiera de los dos vértices principales ($a > 0$).
* **Semieje menor ($b$):** Distancia desde el centro a cualquiera de los extremos del eje menor ($b > 0$).
* **Distancia focal ($c$):** Distancia desde el centro a cualquiera de los dos focos.
* **Condición de orden:** $a > b > 0$ (el semieje mayor siempre es mayor que el semieje menor).
* **Relación fundamental (Teorema de Pitágoras en la elipse):**
  $$a^2 = b^2 + c^2 \quad \implies \quad c = \sqrt{a^2 - b^2}$$
* **Caso Especial de la Circunferencia ($a = b$):**
  Si $a = b$, entonces $c = \sqrt{a^2 - a^2} = 0$. Los dos focos coinciden exactamente en el centro $C(h, k)$ y la curva se transforma en una circunferencia de radio $r = a$.

---

## 2. Elementos Principales de la Elipse
1. **Longitud del Eje Mayor:** $2a$.
2. **Longitud del Eje Menor:** $2b$.
3. **Distancia entre Focos (Eje Focal):** $2c$.
4. **Lado Recto ($LR$):** Longitud de la cuerda perpendicular al eje focal que pasa por cada uno de los focos:
   $$LR = \frac{2b^2}{a}$$
5. **Excentricidad ($e$):** Mide el grado de achatamiento o elongación de la elipse:
   $$e = \frac{c}{a}, \quad \text{donde } 0 \le e < 1$$
   * **Interpretación para niños:**
     * Si $c \to 0$, entonces $e \to 0$: los focos están muy cerca del centro y la elipse es **casi redonda** (como la órbita de la Tierra).
     * Si $c \to a$, entonces $e \to 1$: los focos se alejan hacia los vértices y la elipse es **bien achatada** (como la órbita alargada de un cometa).

---

## 3. Ecuaciones Canónicas según la Orientación

### Caso 1: Eje Focal Paralelo al Eje X (Horizontal)
Ocurre cuando el denominador mayor $a^2$ se encuentra debajo de la variable $x$:
$$\frac{(x - h)^2}{a^2} + \frac{(y - k)^2}{b^2} = 1$$
* **Eje focal:** Recta horizontal de ecuación $y = k$.
* **Vértices principales:** $A'(h - a, k)$ y $A(h + a, k)$.
* **Focos:** $F'(h - c, k)$ y $F(h + c, k)$.
* **Extremos del eje menor:** $B'(h, k - b)$ y $B(h, k + b)$.

### Caso 2: Eje Focal Paralelo al Eje Y (Vertical)
Ocurre cuando el denominador mayor $a^2$ se encuentra debajo de la variable $y$:
$$\frac{(x - h)^2}{b^2} + \frac{(y - k)^2}{a^2} = 1$$
* **Eje focal:** Recta vertical de ecuación $x = h$.
* **Vértices principales:** $A'(h, k - a)$ y $A(h, k + a)$.
* **Focos:** $F'(h, k - c)$ y $F(h, k + c)$.
* **Extremos del eje menor:** $B'(h - b, k)$ y $B(h + b, k)$.

---

## 4. Ejemplos del Libro de Texto Resueltos a Mano Paso a Paso

### Ejemplo 1: Análisis a partir de la ecuación canónica
**Enunciado:** Analizar y hallar todos los elementos de la elipse dada por:
$$\frac{(x - 2)^2}{9} + \frac{(y + 3)^2}{5} = 1$$

**Solución paso a paso:**
1. Identificar el centro: $(x - 2)^2 \implies h = 2$, $(y + 3)^2 = (y - (-3))^2 \implies k = -3$.
   $$\text{Centro } C(2, -3)$$
2. Identificar denominadores:
   * Debajo de $x$: $9$
   * Debajo de $y$: $5$
   * Como $9 > 5$, el denominador mayor es $a^2 = 9$ y está debajo de $x$. Por tanto, la elipse es **horizontal** con eje focal paralelo al eje X ($y = -3$).
3. Calcular semiejes:
   $$a = \sqrt{9} = 3$$
   $$b = \sqrt{5} \approx 2.2361$$
4. Calcular distancia focal $c$:
   $$c = \sqrt{a^2 - b^2} = \sqrt{9 - 5} = \sqrt{4} = 2$$
5. Longitud de los ejes y lado recto:
   * Eje mayor: $2a = 2(3) = 6$
   * Eje menor: $2b = 2\sqrt{5} \approx 4.4721$
   * Lado Recto: $LR = \frac{2b^2}{a} = \frac{2(5)}{3} = \frac{10}{3} \approx 3.3333$
   * Excentricidad: $e = \frac{c}{a} = \frac{2}{3} \approx 0.6667$
6. Coordenadas de los puntos singulares:
   * **Vértices:** $A'(2 - 3, -3) = (-1, -3)$ y $A(2 + 3, -3) = (5, -3)$.
   * **Focos:** $F'(2 - 2, -3) = (0, -3)$ y $F(2 + 2, -3) = (4, -3)$.
   * **Extremos del eje menor:**
     > **Nota sobre errata del libro:** En el texto impreso original los extremos del eje menor aparecen con una errata en sus coordenadas. La aplicación y la matemática rigurosa aplican la fórmula correcta:
     $$B'(h, k - b) = (2, -3 - \sqrt{5}) \quad \text{y} \quad B(h, k + b) = (2, -3 + \sqrt{5})$$

---

### Ejemplo 2: Deducción de la ecuación a partir de centro y ejes
**Enunciado:** Hallar la ecuación canónica y los elementos de una elipse con centro en $(-2, 5)$, eje mayor de longitud $10$, eje menor de longitud $8$ y eje focal vertical.

**Solución paso a paso:**
1. Datos iniciales:
   * Centro $C(h, k) = (-2, 5) \implies h = -2, k = 5$.
   * Eje mayor $2a = 10 \implies a = 5 \implies a^2 = 25$.
   * Eje menor $2b = 8 \implies b = 4 \implies b^2 = 16$.
   * Orientación: Vertical $\implies a^2$ va debajo del término de $y$.
2. Formulación de la ecuación canónica:
   $$\frac{(x - (-2))^2}{16} + \frac{(y - 5)^2}{25} = 1 \implies \frac{(x + 2)^2}{16} + \frac{(y - 5)^2}{25} = 1$$
3. Calcular distancia focal $c$:
   $$c = \sqrt{a^2 - b^2} = \sqrt{25 - 16} = \sqrt{9} = 3$$
4. Elementos geométricos:
   * Eje focal: $x = -2$.
   * Vértices: $A'(-2, 5 - 5) = (-2, 0)$ y $A(-2, 5 + 5) = (-2, 10)$.
   * Focos: $F'(-2, 5 - 3) = (-2, 2)$ y $F(-2, 5 + 3) = (-2, 8)$.
   * Extremos del eje menor: $B'(-2 - 4, 5) = (-6, 5)$ y $B(-2 + 4, 5) = (2, 5)$.
   * Excentricidad: $e = \frac{c}{a} = \frac{3}{5} = 0.6$.
   * Lado Recto: $LR = \frac{2b^2}{a} = \frac{2(16)}{5} = \frac{32}{5} = 6.4$.

---

### Ejemplo 3: Deducción a partir de vértices y lado recto
**Enunciado:** Hallar la ecuación de la elipse cuyos vértices principales son $(3, 6)$ y $(3, -2)$ y cuyo lado recto mide $6$.

**Solución paso a paso:**
1. Orientación y Centro:
   * Los vértices tienen la misma abscisa ($x = 3$), por lo cual el eje focal es **vertical**.
   * El centro $C(h, k)$ es el punto medio entre los dos vértices:
     $$h = 3, \quad k = \frac{6 + (-2)}{2} = \frac{4}{2} = 2 \implies C(3, 2)$$
2. Calcular $a$:
   * La distancia entre vértices es $2a = 6 - (-2) = 8 \implies a = 4 \implies a^2 = 16$.
3. Calcular $b$ a partir del Lado Recto:
   $$LR = \frac{2b^2}{a} \implies 6 = \frac{2b^2}{4} \implies 6 = \frac{b^2}{2} \implies b^2 = 12 \implies b = \sqrt{12} \approx 3.4641$$
4. Ecuación canónica (vertical):
   $$\frac{(x - 3)^2}{12} + \frac{(y - 2)^2}{16} = 1$$
5. Distancia focal $c$ y excentricidad:
   $$c = \sqrt{a^2 - b^2} = \sqrt{16 - 12} = \sqrt{4} = 2$$
   $$e = \frac{c}{a} = \frac{2}{4} = 0.5$$
   * Focos: $F'(3, 2 - 2) = (3, 0)$ y $F(3, 2 + 2) = (3, 4)$.

---

## 5. Referencia Bibliográfica (Normas APA)
* Autor(es): [Equipo de Autores del Texto Escolar]
* Año de publicación: [Año, ej. 2024]
* Título de la obra: *Matemáticas 10: Libro del Estudiante*
* Capítulo/Sección: Unidad de Geometría Analítica — "Ecuación canónica de la elipse con centro en (h, k)", pp. 195–196.
* Editorial: [Nombre de la Editorial, ej. Santillana / SM / MEN]
* Ciudad/País: Colombia.
