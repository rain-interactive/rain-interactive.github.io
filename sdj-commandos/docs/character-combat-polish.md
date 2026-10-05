# Personajes y lectura del combate

Versión 20261005-20, 5 de octubre de 2026.

Primera prioridad de las mejoras propuestas: animación de personajes y claridad visual durante el combate.

## Cambios

- El jinete se inclina según la velocidad y mantiene una respiración discreta al detenerse. El balanceo del camello depende de la velocidad. La barba, el faldón y la cola del turbante acompañan el movimiento.
- Los agentes trajeados muestran una pistola compacta y una postura distinta. Las fuerzas especiales muestran visor de rifle y postura baja al detenerse. Se conservan sus colisiones y ataques actuales.
- Los proyectiles enemigos tienen contorno oscuro, cuerpo rojo y núcleo claro. Los pesados tienen una cola diferenciada. Se dibujan por encima del humo y las explosiones.
- Salud, granadas, experiencia y cofres tienen siluetas contrastadas y se dibujan después de los efectos. Los cofres llevan un rombo dorado y los suministros una pequeña flecha.
- Las marcas de puntería de vehículos tienen contorno y centro visibles por encima de los efectos. Mantienen el momento y la posición originales del ataque.
- Se omite el dibujo de proyectiles y objetos fuera de pantalla.

## Validación

La prueba de render comprueba por píxeles que un disparo enemigo y un objeto de salud siguen visibles bajo humo. También comprueba la portada sin jugador activo, las cinco zonas, las 20 variantes de soldados, la marcha detenida y en movimiento, el retroceso y el límite de explosiones.

La simulación determinista completa alcanza la victoria de las cinco zonas en 257,37 segundos simulados, con nivel 28, 15 cofres y tres evoluciones. También pasan las comprobaciones de las 29 armas, las tres ranuras, los tiempos independientes, el napalm, las minas y la transferencia de experiencia.

Las comprobaciones usan canvas por software y simulación. No son una prueba manual de navegador ni una medición de rendimiento en un móvil real. Los escenarios, la diferenciación mecánica adicional de armas y los nuevos patrones de jefes quedan para siguientes pasadas.
