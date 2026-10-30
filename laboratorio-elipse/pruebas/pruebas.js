/**
 * Suite de Pruebas Unitarias - Laboratorio de la Elipse
 * Ejecutable en consola con: node pruebas/pruebas.js
 * O en navegador mediante pruebas/pruebas.html
 */

const esNode = typeof module !== 'undefined' && module.exports;

const Formato = esNode ? require('../js/matematicas/formato') : window.Formato;
const Elipse = esNode ? require('../js/matematicas/elipse') : window.Elipse;

let totalPruebas = 0;
let pruebasPasadas = 0;
let pruebasFalladas = 0;
const resultadosDetalle = [];

function probar(nombre, obtenido, esperado, tolerancia) {
    if (tolerancia === undefined) tolerancia = 0.001;
    totalPruebas++;

    let paso = false;

    if (typeof obtenido === 'number' && typeof esperado === 'number') {
        paso = Math.abs(obtenido - esperado) <= tolerancia;
    } else if (typeof obtenido === 'object' && typeof esperado === 'object' && obtenido !== null && esperado !== null) {
        paso = JSON.stringify(obtenido) === JSON.stringify(esperado);
    } else {
        paso = (obtenido === esperado);
    }

    if (paso) {
        pruebasPasadas++;
        const msg = '  ✅ ' + nombre;
        console.log(msg);
        resultadosDetalle.push({ nombre: nombre, paso: true, obtenido: obtenido, esperado: esperado });
    } else {
        pruebasFalladas++;
        const errMsg = '  ❌ ' + nombre + ' | Obtenido: ' + JSON.stringify(obtenido) + ' | Esperado: ' + JSON.stringify(esperado);
        console.error(errMsg);
        resultadosDetalle.push({ nombre: nombre, paso: false, obtenido: obtenido, esperado: esperado });
    }
}

console.log('\n======================================================');
console.log('🧪 INICIANDO SUITE DE PRUEBAS: LABORATORIO DE LA ELIPSE');
console.log('======================================================\n');

// 1. Ejemplo 1 del libro: (x-2)²/9 + (y+3)²/5 = 1
console.log('--- Caso 1: Ejemplo 1 del libro ---');
const ej1 = Elipse.analizarEcuacion({ h: 2, k: -3, denX: 9, denY: 5 });
probar('Ejemplo 1 - Estado ok', ej1.ok, true);
probar('Ejemplo 1 - Orientación horizontal', ej1.orientacion, 'horizontal');
probar('Ejemplo 1 - Centro X', ej1.centro.x, 2);
probar('Ejemplo 1 - Centro Y', ej1.centro.y, -3);
probar('Ejemplo 1 - Semieje a', ej1.a, 3);
probar('Ejemplo 1 - Semieje b', ej1.b, Math.sqrt(5));
probar('Ejemplo 1 - Distancia focal c', ej1.c, 2);
probar('Ejemplo 1 - Excentricidad e', ej1.excentricidad, 2 / 3);
probar('Ejemplo 1 - Lado Recto LR', ej1.ladoRecto, 10 / 3);
probar('Ejemplo 1 - Foco F\' x', ej1.focos[0].x, 0);
probar('Ejemplo 1 - Foco F\' y', ej1.focos[0].y, -3);
probar('Ejemplo 1 - Foco F x', ej1.focos[1].x, 4);
probar('Ejemplo 1 - Foco F y', ej1.focos[1].y, -3);
probar('Ejemplo 1 - Vértice A\' x', ej1.vertices[0].x, -1);
probar('Ejemplo 1 - Vértice A x', ej1.vertices[1].x, 5);
probar('Ejemplo 1 - Extremo menor B\' y', ej1.extremosMenor[0].y, -3 - Math.sqrt(5));
probar('Ejemplo 1 - Extremo menor B y', ej1.extremosMenor[1].y, -3 + Math.sqrt(5));
probar('Ejemplo 1 - Eje focal y = -3', ej1.ejeFocal.valor, -3);

// 2. Ejemplo 2: centro (-2,5), eje mayor 10, eje menor 8, vertical
console.log('\n--- Caso 2: Ejemplo 2 del libro ---');
const ej2 = Elipse.desdeEjes({ h: -2, k: 5, ejeMayor: 10, ejeMenor: 8, orientacion: 'vertical' });
probar('Ejemplo 2 - Estado ok', ej2.ok, true);
probar('Ejemplo 2 - a = 5', ej2.a, 5);
probar('Ejemplo 2 - b = 4', ej2.b, 4);
probar('Ejemplo 2 - c = 3', ej2.c, 3);
probar('Ejemplo 2 - Foco 1', ej2.focos[0].y, 2);
probar('Ejemplo 2 - Foco 2', ej2.focos[1].y, 8);
probar('Ejemplo 2 - Vértice 1', ej2.vertices[0].y, 0);
probar('Ejemplo 2 - Vértice 2', ej2.vertices[1].y, 10);
probar('Ejemplo 2 - Extremo B\' x', ej2.extremosMenor[0].x, -6);
probar('Ejemplo 2 - Extremo B x', ej2.extremosMenor[1].x, 2);
probar('Ejemplo 2 - Excentricidad 0.6', ej2.excentricidad, 0.6);
probar('Ejemplo 2 - LR 6.4', ej2.ladoRecto, 6.4);
probar('Ejemplo 2 - Eje focal x = -2', ej2.ejeFocal.valor, -2);

// 3. Ejemplo 3: vértices (3,6) y (3,-2) con LR=6
console.log('\n--- Caso 3: Ejemplo 3 del libro ---');
const ej3 = Elipse.desdeVerticesYLadoRecto({
    v1: { x: 3, y: 6 },
    v2: { x: 3, y: -2 },
    ladoRecto: 6
});
probar('Ejemplo 3 - Estado ok', ej3.ok, true);
probar('Ejemplo 3 - Centro (3, 2)', ej3.centro.x === 3 && ej3.centro.y === 2, true);
probar('Ejemplo 3 - a = 4', ej3.a, 4);
probar('Ejemplo 3 - b² = 12', ej3.b2, 12);
probar('Ejemplo 3 - c = 2', ej3.c, 2);
probar('Ejemplo 3 - e = 0.5', ej3.excentricidad, 0.5);
probar('Ejemplo 3 - Foco 1 y = 0', ej3.focos[0].y, 0);
probar('Ejemplo 3 - Foco 2 y = 4', ej3.focos[1].y, 4);

// 4. Ejercicio 2a: (x-2)²/36 + (y-6)²/4 = 1
console.log('\n--- Caso 4: Ejercicio 2a ---');
const ej2a = Elipse.analizarEcuacion({ h: 2, k: 6, denX: 36, denY: 4 });
probar('Ejercicio 2a - Horizontal', ej2a.orientacion, 'horizontal');
probar('Ejercicio 2a - a = 6', ej2a.a, 6);
probar('Ejercicio 2a - b = 2', ej2a.b, 2);
probar('Ejercicio 2a - c = 4√2 (≈ 5.6569)', ej2a.c, 4 * Math.SQRT2);
probar('Ejercicio 2a - e ≈ 0.9428', ej2a.excentricidad, (4 * Math.SQRT2) / 6);
probar('Ejercicio 2a - LR = 4/3', ej2a.ladoRecto, 4 / 3);

// 5. Ejercicio 2b: (x+2)²/25 + (y+1)²/100 = 1
console.log('\n--- Caso 5: Ejercicio 2b ---');
const ej2b = Elipse.analizarEcuacion({ h: -2, k: -1, denX: 25, denY: 100 });
probar('Ejercicio 2b - Vertical', ej2b.orientacion, 'vertical');
probar('Ejercicio 2b - a = 10', ej2b.a, 10);
probar('Ejercicio 2b - b = 5', ej2b.b, 5);
probar('Ejercicio 2b - c = 5√3 (≈ 8.6603)', ej2b.c, 5 * Math.sqrt(3));
probar('Ejercicio 2b - e ≈ 0.8660', ej2b.excentricidad, (5 * Math.sqrt(3)) / 10);
probar('Ejercicio 2b - LR = 5', ej2b.ladoRecto, 5);
probar('Ejercicio 2b - Vértice A\' y = -11', ej2b.vertices[0].y, -11);
probar('Ejercicio 2b - Vértice A y = 9', ej2b.vertices[1].y, 9);

// 6. Ejercicio 4a: centro (2,6), eje mayor 8, eje menor 6, eje focal x=2
console.log('\n--- Caso 6: Ejercicio 4a ---');
const ej4a = Elipse.desdeEjes({ h: 2, k: 6, ejeMayor: 8, ejeMenor: 6, orientacion: 'vertical' });
probar('Ejercicio 4a - a = 4, b = 3', ej4a.a === 4 && ej4a.b === 3, true);
probar('Ejercicio 4a - denX = 9, denY = 16', ej4a.denX === 9 && ej4a.denY === 16, true);

// 7. Ejercicio 4b: vértices (-5,2) y (3,2), extremo menor (-1,4)
console.log('\n--- Caso 7: Ejercicio 4b ---');
const ej4b = Elipse.desdeVerticesYExtremoMenor({
    v1: { x: -5, y: 2 },
    v2: { x: 3, y: 2 },
    extremoMenor: { x: -1, y: 4 }
});
probar('Ejercicio 4b - Centro (-1, 2)', ej4b.centro.x === -1 && ej4b.centro.y === 2, true);
probar('Ejercicio 4b - a = 4, b = 2', ej4b.a === 4 && ej4b.b === 2, true);
probar('Ejercicio 4b - c = √12 ≈ 3.4641', ej4b.c, Math.sqrt(12));

// 8. Ejercicio 3c: (x - 3/2)²/121 + (y + 1/2)²/81 = 1 con fracciones
console.log('\n--- Caso 8: Ejercicio 3c con fracciones ---');
const numH = Formato.leerNumero('3/2').valor;
const numK = Formato.leerNumero('-1/2').valor;
const ej3c = Elipse.analizarEcuacion({ h: numH, k: numK, denX: 121, denY: 81 });
probar('Ejercicio 3c - Centro (1.5, -0.5)', ej3c.centro.x === 1.5 && ej3c.centro.y === -0.5, true);
probar('Ejercicio 3c - a = 11, b = 9', ej3c.a === 11 && ej3c.b === 9, true);
probar('Ejercicio 3c - c = √40 ≈ 6.3246', ej3c.c, Math.sqrt(40));
probar('Ejercicio 3c - e ≈ 0.5750', ej3c.excentricidad, Math.sqrt(40) / 11);

// 9. Ejercicio 5d: x²/11 + y²/12 = 1
console.log('\n--- Caso 9: Ejercicio 5d ---');
const ej5d = Elipse.analizarEcuacion({ h: 0, k: 0, denX: 11, denY: 12 });
probar('Ejercicio 5d - Vertical', ej5d.orientacion, 'vertical');
probar('Ejercicio 5d - a² = 12', ej5d.a2, 12);
probar('Ejercicio 5d - b² = 11', ej5d.b2, 11);
probar('Ejercicio 5d - c = 1', ej5d.c, 1);
probar('Ejercicio 5d - e = 1/√12 ≈ 0.2887', ej5d.excentricidad, 1 / Math.sqrt(12));

// 10. Ejercicio 3f: 4x² + 9y² = 36
console.log('\n--- Caso 10: Ejercicio 3f forma general ---');
const ej3f = Elipse.desdeFormaGeneral({ A: 4, B: 9, C: 36 });
probar('Ejercicio 3f - denX = 9, denY = 4', ej3f.denX === 9 && ej3f.denY === 4, true);
probar('Ejercicio 3f - a = 3, b = 2', ej3f.a === 3 && ej3f.b === 2, true);
probar('Ejercicio 3f - c = √5 ≈ 2.2361', ej3f.c, Math.sqrt(5));
probar('Ejercicio 3f - e ≈ 0.7454', ej3f.excentricidad, Math.sqrt(5) / 3);

// 11. Comparar excentricidad a²=16 con b²=[12, 9, 6, 2]
console.log('\n--- Caso 11: Comparación de excentricidades ---');
const comp = Elipse.compararExcentricidad(16, [12, 9, 6, 2]);
probar('Comparar - b²=12 -> e=0.5', comp.comparaciones[0].e, 0.5);
probar('Comparar - b²=9 -> e=0.6614', comp.comparaciones[1].e, Math.sqrt(7) / 4);
probar('Comparar - b²=6 -> e=0.7906', comp.comparaciones[2].e, Math.sqrt(10) / 4);
probar('Comparar - b²=2 -> e=0.9354', comp.comparaciones[3].e, Math.sqrt(14) / 4);

// 12. Caso especial Circunferencia: denX = denY = 9
console.log('\n--- Caso 12: Circunferencia cuando a = b ---');
const circ = Elipse.analizarEcuacion({ h: 0, k: 0, denX: 9, denY: 9 });
probar('Circunferencia - esCircunferencia true', circ.esCircunferencia, true);
probar('Circunferencia - radio = 3', circ.radio, 3);
probar('Circunferencia - c = 0', circ.c, 0);
probar('Circunferencia - e = 0', circ.excentricidad, 0);

// 13. Errores esperados (ok: false)
console.log('\n--- Caso 13: Manejo de errores controlados (ok: false) ---');
probar('Error denX = 0', Elipse.analizarEcuacion({ h: 0, k: 0, denX: 0, denY: 5 }).ok, false);
probar('Error denY < 0', Elipse.analizarEcuacion({ h: 0, k: 0, denX: 4, denY: -5 }).ok, false);
probar('Error b > a en crearElipse', Elipse.crearElipse({ h: 0, k: 0, a: 3, b: 5, orientacion: 'horizontal' }).ok, false);
probar('Error vértices no alineados', Elipse.desdeVerticesYLadoRecto({ v1: { x: 0, y: 0 }, v2: { x: 1, y: 1 }, ladoRecto: 2 }).ok, false);
probar('Error LR <= 0', Elipse.desdeVerticesYLadoRecto({ v1: { x: 0, y: 0 }, v2: { x: 4, y: 0 }, ladoRecto: 0 }).ok, false);
probar('Error LR > 2a', Elipse.desdeVerticesYLadoRecto({ v1: { x: 0, y: 0 }, v2: { x: 4, y: 0 }, ladoRecto: 10 }).ok, false);
probar('Error extremo menor fuera de la perpendicular', Elipse.desdeVerticesYExtremoMenor({ v1: { x: -4, y: 0 }, v2: { x: 4, y: 0 }, extremoMenor: { x: 1, y: 2 } }).ok, false);

// 14. Función leerNumero
console.log('\n--- Caso 14: Lectura de números flexibles ---');
probar('leerNumero "3/2" -> 1.5', Formato.leerNumero('3/2').valor, 1.5);
probar('leerNumero "-1/2" -> -0.5', Formato.leerNumero('-1/2').valor, -0.5);
probar('leerNumero "2,5" -> 2.5', Formato.leerNumero('2,5').valor, 2.5);
probar('leerNumero "abc" -> ok:false', Formato.leerNumero('abc').ok, false);
probar('leerNumero "1/0" -> ok:false', Formato.leerNumero('1/0').ok, false);
probar('leerNumero "" -> ok:false', Formato.leerNumero('').ok, false);

// 15. Función simplificarRaiz / formatearExacto
console.log('\n--- Caso 15: Simplificación de raíces cuadradas exactas ---');
probar('simplificarRaiz(5) -> "√5"', Formato.simplificarRaiz(5), '√5');
probar('simplificarRaiz(20) -> "2√5"', Formato.simplificarRaiz(20), '2√5');
probar('simplificarRaiz(32) -> "4√2"', Formato.simplificarRaiz(32), '4√2');
probar('simplificarRaiz(75) -> "5√3"', Formato.simplificarRaiz(75), '5√3');
probar('simplificarRaiz(12) -> "2√3"', Formato.simplificarRaiz(12), '2√3');
probar('simplificarRaiz(4) -> "2"', Formato.simplificarRaiz(4), '2');

// 16. Definición geométrica: d(P,F') + d(P,F) = 2a para cualquier punto P de la elipse
console.log('\n--- Caso 16: Propiedad focal d1 + d2 = 2a (hilo del jardinero) ---');
const elHilo = Elipse.crearElipse({ h: 1, k: -3, a: 3, b: Math.sqrt(5), orientacion: 'horizontal' });
[0, 45, 90, 137, 180, 270, 333].forEach(function (g) {
    const P = Elipse.puntoEnElipse(elHilo, g);
    probar('Horizontal t=' + g + '° -> d1 + d2 = 2a = 6', Elipse.distanciasFocales(elHilo, P).suma, 6);
});
const elHiloV = Elipse.crearElipse({ h: -2, k: 5, a: 5, b: 4, orientacion: 'vertical' });
[30, 90, 210].forEach(function (g) {
    const P = Elipse.puntoEnElipse(elHiloV, g);
    probar('Vertical t=' + g + '° -> d1 + d2 = 2a = 10', Elipse.distanciasFocales(elHiloV, P).suma, 10);
});
const Pv = Elipse.puntoEnElipse(elHilo, 0);
probar('Vértice A(4,-3): d1 = a + c = 5', Elipse.distanciasFocales(elHilo, Pv).d1, 5);
probar('Vértice A(4,-3): d2 = a - c = 1', Elipse.distanciasFocales(elHilo, Pv).d2, 1);
probar('Punto inválido -> ok:false', Elipse.distanciasFocales(elHilo, { x: 'a', y: 0 }).ok, false);

console.log('\n======================================================');
console.log('📊 RESUMEN: ' + pruebasPasadas + ' superadas, ' + pruebasFalladas + ' falladas de ' + totalPruebas + ' pruebas.');
console.log('======================================================\n');

if (esNode) {
    if (pruebasFalladas > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}
