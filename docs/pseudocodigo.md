# Algoritmos y Pseudocódigo del Software

Este documento describe la arquitectura algorítmica del **Laboratorio de la Elipse**, detallando las entradas, cálculos, decisiones lógicas y manejo controlado de errores para cada componente.

---

## 1. Módulo de Entrada y Formateo (`formato.js`)

### Algoritmo `leerNumero(cadena)`
```text
ENTRADA: texto (string o number)
SALIDA: { ok: true, valor: float } o { ok: false, error: string }

INICIO:
  SI texto es nulo o indefinido ENTONCES
    RETORNAR { ok: falso, error: "Por favor ingresa un número" }
  SI texto es de tipo numérico ENTONCES
    SI es NaN o no es finito ENTONCES
      RETORNAR { ok: falso, error: "Número no válido" }
    RETORNAR { ok: verdadero, valor: texto }

  textoLimpio = recortarEspacios(texto).reemplazar(',', '.')
  SI longitud(textoLimpio) == 0 ENTONCES
    RETORNAR { ok: falso, error: "Este campo no puede estar vacío" }

  SI textoLimpio contiene '/' ENTONCES
    partes = dividir(textoLimpio, '/')
    SI cantidad(partes) != 2 ENTONCES
      RETORNAR { ok: falso, error: "La fracción debe tener numerador y denominador" }
    num = convertirANumero(partes[0])
    den = convertirANumero(partes[1])
    SI num o den son NaN ENTONCES
      RETORNAR { ok: falso, error: "Valores no numéricos en la fracción" }
    SI den == 0 ENTONCES
      RETORNAR { ok: falso, error: "No se puede dividir entre cero" }
    RETORNAR { ok: verdadero, valor: num / den }

  valor = convertirANumero(textoLimpio)
  SI valor es NaN ENTONCES
    RETORNAR { ok: falso, error: "No es un número válido" }
  SI valor no es finito ENTONCES
    RETORNAR { ok: falso, error: "Número demasiado grande" }

  RETORNAR { ok: verdadero, valor: valor }
FIN
```

---

## 2. Actividad 1: Explora la Elipse (`ui-explora.js` y `elipse.js`)

```text
ENTRADAS: h, k, a, b (deslizadores numéricos), orientacion ('horizontal' | 'vertical')

CÁLCULOS Y DECISIONES:
  SI b > a ENTONCES
    // Regla matemática: b no puede superar a a
    b = a
    notificarUsuario("b no puede ser mayor que a. Cuando a = b es una circunferencia.")

  a2 = a * a
  b2 = b * b
  c2 = a2 - b2
  c = raizCuadrada(c2)
  excentricidad = (a == b) ? 0 : (c / a)
  ladoRecto = (2 * b2) / a

  SI orientacion == 'horizontal' ENTONCES
    denX = a2; denY = b2
    Focos = [(h - c, k), (h + c, k)]
    Vertices = [(h - a, k), (h + a, k)]
    ExtremosMenor = [(h, k - b), (h, k + b)]
    EjeFocal = "y = " + k
  SINO (vertical)
    denX = b2; denY = a2
    Focos = [(h, k - c), (h, k + c)]
    Vertices = [(h, k - a), (h, k + a)]
    ExtremosMenor = [(h - b, k), (h + b, k)]
    EjeFocal = "x = " + h

  // Diagnóstico de achatamiento
  SI a == b O excentricidad < 0.05 ENTONCES
    diagnostico = "Circunferencia (e = 0)"
  SINO SI excentricidad < 0.3 ENTONCES
    diagnostico = "Casi redonda"
  SINO SI excentricidad <= 0.7 ENTONCES
    diagnostico = "Ovalada"
  SINO
    diagnostico = "Bien achatada"

SALIDA: Actualizar gráfica en Canvas con escala fija [-12, 12], medidor de achatamiento y panel numérico.
```

---

## 3. Actividad 2: Analiza una Ecuación (`ui-analiza.js`)

```text
ENTRADAS: h, k, denX, denY (canónica) O A, B, C (general Ax² + By² = C)

VALIDACIONES:
  SI modo == 'general' ENTONCES
    SI A <= 0 O B <= 0 O C <= 0 ENTONCES
      RETORNAR ERROR: "Los coeficientes deben ser mayores que cero"
    denX = C / A
    denY = C / B
    h = 0; k = 0

  SI denX <= 0 O denY <= 0 ENTONCES
    RETORNAR ERROR: "Los denominadores deben ser positivos estrictos"

DECISIÓN DE ORIENTACIÓN:
  SI denX == denY ENTONCES
    esCircunferencia = VERDADERO
    a = raiz(denX); b = a; c = 0; e = 0
    orientacion = 'horizontal'
  SINO SI denX > denY ENTONCES
    orientacion = 'horizontal'
    a = raiz(denX)
    b = raiz(denY)
  SINO
    orientacion = 'vertical'
    a = raiz(denY)
    b = raiz(denX)

CÁLCULOS:
  c = raiz(a² - b²)
  e = c / a
  LR = 2*b² / a
  Calcular coordenadas exactas (con representación √) y decimales.

SALIDA:
  Dibujar elipse en Canvas con autoescala centrada.
  Mostrar tabla de propiedades con valores exactos y aproximaciones.
```

---

## 4. Actividad 3: Arma tu Elipse (`ui-arma.js`)

```text
CASO A: Dados Centro (h, k), Eje Mayor (2a), Eje Menor (2b), Orientación
  SI 2b > 2a ENTONCES
    RETORNAR ERROR: "El eje menor no puede ser mayor que el eje mayor"
  a = (2a) / 2
  b = (2b) / 2
  c = raiz(a² - b²)
  Construir ecuación canónica directamente.

CASO B: Dados Vértices V1(x1, y1), V2(x2, y2) y Lado Recto (LR)
  SI y1 == y2 ENTONCES
    orientacion = 'horizontal'
    distancia = valorAbsoluto(x2 - x1)
  SINO SI x1 == x2 ENTONCES
    orientacion = 'vertical'
    distancia = valorAbsoluto(y2 - y1)
  SINO
    RETORNAR ERROR: "Los vértices deben estar alineados horizontal o verticalmente"

  Centro = ((x1 + x2)/2, (y1 + y2)/2)
  a = distancia / 2
  SI LR > 2*a ENTONCES
    RETORNAR ERROR: "El lado recto no puede exceder 2a"
  b² = (LR * a) / 2
  b = raiz(b²)
  c = raiz(a² - b²)
  Generar explicación paso a paso y graficar.

CASO C: Dados Vértices V1, V2 y Extremo Menor B(bx, by)
  Verificar alineación de vértices -> determinar Centro y orientación.
  SI orientacion == 'horizontal' ENTONCES
    SI bx != Centro.x ENTONCES
      RETORNAR ERROR: "El extremo menor debe estar en la perpendicular x = h"
    b = valorAbsoluto(by - Centro.y)
  SINO (vertical)
    SI by != Centro.y ENTONCES
      RETORNAR ERROR: "El extremo menor debe estar en la perpendicular y = k"
    b = valorAbsoluto(bx - Centro.x)

  SI b > a ENTONCES
    RETORNAR ERROR: "La distancia menor b no puede superar a a"
  Construir y graficar.
```

---

## 5. Actividad 4: Retos de Mati (`ui-retos.js`)

```text
INICIALIZAR RONDA:
  estrellas = 0
  preguntaActual = 1 hasta 8

GENERAR RETO:
  h = aleatorioEntre(-5, 5)
  k = aleatorioEntre(-5, 5)
  a = aleatorioEntre(3, 8)
  b = aleatorioEntre(2, a - 1)
  orientacion = aleatorioEntre(['horizontal', 'vertical'])
  Crear elipse y graficarla en Canvas.

  Elegir tipoPregunta al azar entre:
    ['a', 'b', 'c', 'ejeMayor', 'ejeMenor', 'ladoRecto', 'excentricidad', 'orientacion']

VERIFICAR RESPUESTA:
  SI tipoPregunta == 'orientacion' ENTONCES
    esCorrecto = (entradaUsuario == orientacionEsperada)
  SINO
    num = leerNumero(entradaUsuario)
    SI num.ok ENTONCES
      esCorrecto = (|num.valor - valorEsperado| <= 0.015) // Tolerancia pedagógica

  SI esCorrecto ENTONCES
    estrellas = estrellas + 1
    mostrarMensajeFelicitacion()
  SINO
    mostrarSolucionPasoAPaso()

  SI preguntaActual == 8 ENTONCES
    mostrarPantallaFinalConEstrellas(estrellas)
```
