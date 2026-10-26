# Tabla de Pruebas Unitarias y Validación de Aceptación

Matriz de verificación del software con los 15 grupos de prueba (98 aserciones automatizadas ejecutadas y superadas en Node.js y en el Navegador Web).

| N° | Caso / Enunciado | Entrada de Prueba | Resultado Esperado | Resultado Obtenido | Estado |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | **Ejemplo 1 del Libro**<br>Análisis canónico horizontal | `h=2, k=-3`<br>`denX=9, denY=5` | Horizontal, $a=3$, $b=\sqrt{5}$, $c=2$, $e=2/3$, $LR=10/3$, $C(2,-3)$, $F'(0,-3)$, $F(4,-3)$, $A'(-1,-3)$, $A(5,-3)$, $B'(2,-3-\sqrt{5})$, $B(2,-3+\sqrt{5})$, eje focal $y=-3$. | Idéntico al esperado. | ✅ PASÓ |
| **2** | **Ejemplo 2 del Libro**<br>Centro y ejes vertical | `C(-2, 5), 2a=10`<br>`2b=8, vertical` | $a=5$, $b=4$, $c=3$, ecuación $(x+2)^2/16 + (y-5)^2/25 = 1$, $F'(-2,2)$, $F(-2,8)$, $A'(-2,0)$, $A(-2,10)$, $B'(-6,5)$, $B(2,5)$, $e=0.6$, $LR=6.4$, eje focal $x=-2$. | Idéntico al esperado. | ✅ PASÓ |
| **3** | **Ejemplo 3 del Libro**<br>Vértices y lado recto | `V1(3,6), V2(3,-2)`<br>`LR=6` | Vertical, $C(3,2)$, $a=4$, $b^2=12$, $c=2$, $e=0.5$, $(x-3)^2/12 + (y-2)^2/16 = 1$, $F'(3,0)$, $F(3,4)$. | Idéntico al esperado. | ✅ PASÓ |
| **4** | **Ejercicio 2a**<br>Ecuación canónica | `h=2, k=6`<br>`denX=36, denY=4` | Horizontal, $a=6$, $b=2$, $c=4\sqrt{2}\approx 5.6569$, $e\approx 0.9428$, $LR=4/3\approx 1.3333$. | Idéntico al esperado. | ✅ PASÓ |
| **5** | **Ejercicio 2b**<br>Ecuación canónica | `h=-2, k=-1`<br>`denX=25, denY=100` | Vertical, $a=10$, $b=5$, $c=5\sqrt{3}\approx 8.6603$, $e\approx 0.8660$, $LR=5$, $A'(-2,-11)$, $A(-2,9)$. | Idéntico al esperado. | ✅ PASÓ |
| **6** | **Ejercicio 4a**<br>Construcción con eje focal | `C(2,6), 2a=8`<br>`2b=6, eje x=2` | Vertical, $a=4$, $b=3$, ecuación $(x-2)^2/9 + (y-6)^2/16 = 1$. | Idéntico al esperado. | ✅ PASÓ |
| **7** | **Ejercicio 4b**<br>Vértices y extremo menor | `V1(-5,2), V2(3,2)`<br>`B(-1,4)` | Horizontal, $C(-1,2)$, $a=4$, $b=2$, $c=\sqrt{12}\approx 3.4641$, $(x+1)^2/16 + (y-2)^2/4 = 1$. | Idéntico al esperado. | ✅ PASÓ |
| **8** | **Ejercicio 3c**<br>Entrada con fracciones | `h="3/2", k="-1/2"`<br>`denX=121, denY=81` | Horizontal, $C(1.5, -0.5)$, $a=11$, $b=9$, $c=\sqrt{40}\approx 6.3246$, $e\approx 0.5750$. | Idéntico al esperado. | ✅ PASÓ |
| **9** | **Ejercicio 5d**<br>Centro en el origen | `h=0, k=0`<br>`denX=11, denY=12` | Vertical, $a^2=12$, $b^2=11$, $c=1$, $e=1/\sqrt{12}\approx 0.2887$. | Idéntico al esperado. | ✅ PASÓ |
| **10** | **Ejercicio 3f**<br>Forma general $4x^2+9y^2=36$ | `A=4, B=9, C=36` | Horizontal, $denX=9, denY=4$, $a=3, b=2, c=\sqrt{5}\approx 2.2361, e\approx 0.7454$. | Idéntico al esperado. | ✅ PASÓ |
| **11** | **Comparación de Excentricidades** | $a^2=16$, $b^2=[12,9,6,2]$ | $e_1=0.5000$, $e_2\approx 0.6614$, $e_3\approx 0.7906$, $e_4\approx 0.9354$. | Idéntico al esperado. | ✅ PASÓ |
| **12** | **Caso Circunferencia ($a=b$)** | `denX=9, denY=9` | `esCircunferencia=true`, $r=3$, $c=0$, $e=0$, focos coinciden en $C$. | Idéntico al esperado. | ✅ PASÓ |
| **13** | **Control de Errores e Invariantes** | Denominador $\le 0$, $b > a$, vértices no alineados, $LR \le 0$, $LR > 2a$ | Retorno estructurado `{ ok: false, error: "mensaje amable..." }` sin lanzar excepciones. | Respuestas amables sin caídas del sistema. | ✅ PASÓ |
| **14** | **Lectura Numérica Flexible** | `"3/2"`, `"-1/2"`, `"2,5"`, `"abc"`, `"1/0"`, `""` | Correcta conversión a float o rechazo con `{ ok: false }`. | Conversión precisa. | ✅ PASÓ |
| **15** | **Simplificación de Raíces Cuadradas** | Radicandos: $5, 20, 32, 75, 12, 4$ | $\sqrt{5}$, $2\sqrt{5}$, $4\sqrt{2}$, $5\sqrt{3}$, $2\sqrt{3}$, $2$. | Cadenas exactas con radicales simplificados. | ✅ PASÓ |

---

### Resumen de la Ejecución
* **Total de Pruebas Ejecutadas:** 98
* **Pruebas Superadas Exitosamente:** 98 (100%)
* **Pruebas Falladas:** 0 (0%)
* **Ambientes de Verificación:**
  * Terminal CLI (Node.js v24.15.0): `node laboratorio-elipse/pruebas/pruebas.js`
  * Navegador Web: `laboratorio-elipse/pruebas/pruebas.html`
