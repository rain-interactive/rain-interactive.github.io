# Metal Slug: segunda pasada visual

Fecha: 2026-10-05. Proyecto: Commandos: Most Wanted. Versión: 20261005-19.

## Referencias revisadas

Se volvió a consultar la cronología oficial de SNK, con especial atención a los juegos 2D Metal Slug, 2, X, 3, 4, 5, 6, 7 y XX: https://www.snk-corp.co.jp/us/anniversary/metalslug30th/history/

Se revisaron las hojas de referencia de la primera pasada: personajes de 1/X/3, elementos y escenas de X/3, desierto de 2 y 17 capturas oficiales de Metal Slug 6. Las capturas de MS6 son pequeñas; sirven para composición, contraste y densidad, no para reconstruir detalles finos. También se examinó de nuevo el vídeo oficial de aniversario de 27,4 segundos mediante 54 fotogramas a intervalos de medio segundo: https://www.snk-corp.co.jp/us/anniversary/metalslug30th/assets/video/bg_ms30th_v01_sp.mp4

Esta revisión cubre esas referencias concretas. No equivale a ver todas las partidas, imágenes o vídeos existentes de la saga. No se han importado sprites, música ni fotogramas de SNK al juego.

## Cambios aplicados

| Observación visual | Adaptación original en Commandos |
| --- | --- |
| Contacto claro entre paso y suelo | El ciclo de soldados y orugas avanza por distancia recorrida; al detenerse se estabiliza la pose. |
| Disparos con retroceso breve | Un reloj visual independiente empieza al disparar; fogonazo y retroceso dejan de anticipar erróneamente el ataque. |
| Lanzamiento con anticipación y remate | Tres poses del brazo: preparación, lanzamiento y seguimiento. |
| Máquinas con peso y desgaste | Arañazos por daño, humo, escape del tanque en movimiento y ligera inclinación del helicóptero. |
| Destrucción con elementos sólidos | Explosiones al destruir vehículos y siete fragmentos con trayectorias y giro; se mantiene el límite de 16 explosiones. |
| Proyectiles legibles entre efectos | Trazo orientado por velocidad, halo del láser y silueta diferenciada de proyectiles pesados. |
| Fondos vivos sin tapar el combate | Oscilación mínima de toldos y detalles de suelo distintos para puerto, industria y roca. |

Se conservaron los ataques independientes, tres ranuras, las 29 armas, las evoluciones y cofres, el director de oleadas, los textos ES/EN y el bucle musical.

## Verificación

- Render por software de cinco zonas y 20 variantes de soldados; inspección de captura del combate y explosión.
- Simulación de 900 fotogramas con render periódico.
- Pruebas de las 29 armas, ranuras, tiempos independientes, cinco familias de evolución, napalm, minas, cofres, transferencia de XP y partida completa de cinco zonas.
- No se realizó una prueba manual en navegador o dispositivo móvil; las comprobaciones son de código, simulación y render de canvas.
